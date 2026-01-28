import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IUserOrderService } from "../../core/interfaces/services/user/IUserOrder.service";
import { IUserOrderRepository } from "../../core/interfaces/repositories/user/IUserOrder.repository";
import { IUserProductRepository } from "../../core/interfaces/repositories/user/IUserProduct.repository";
import { IOrder } from "../../models/order.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";
import crypto from "crypto";
import logger from "../../utils/logger";

import razorpay from "../../config/razorpay";

@injectable()
export class UserOrderService implements IUserOrderService {
    constructor(
        @inject(TYPES.IUserOrderRepository) private _orderRepository: IUserOrderRepository,
        @inject(TYPES.IUserProductRepository) private _productRepository: IUserProductRepository
    ) { }

    async getUserOrders(userId: string): Promise<IOrder[]> {
        const orders = await this._orderRepository.findByUserId(userId);

        // Auto-expire pending orders
        const now = new Date();
        const updatedOrders = await Promise.all(orders.map(async (order) => {
            if (order.orderStatus === "payment_pending" && now > order.paymentExpiresAt) {
                await this.cancelOrder(order);
                const refreshedOrder = await this._orderRepository.findByIdAndUserId(order._id!.toString(), userId);
                return refreshedOrder || order;
            }
            return order;
        }));

        return updatedOrders;
    }

    async getOrderDetail(orderId: string, userId: string): Promise<IOrder> {
        let order = await this._orderRepository.findByIdAndUserId(orderId, userId);
        if (!order) {
            throw new CustomError("Order not found", StatusCode.NOT_FOUND);
        }

        // Auto-expire if pending and expired
        if (order.orderStatus === "payment_pending" && new Date() > order.paymentExpiresAt) {
            await this.cancelOrder(order);
            const refreshedOrder = await this._orderRepository.findByIdAndUserId(orderId, userId);
            if (refreshedOrder) order = refreshedOrder;
        }

        return order;
    }

    async verifyPayment(userId: string, data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }): Promise<IOrder> {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

        const order = await this._orderRepository.findByGatewayOrderId(razorpay_order_id);
        if (!order) {
            throw new CustomError("Order not found", StatusCode.NOT_FOUND);
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
            .update(body.toString())
            .digest("hex");

        const isVerified = expectedSignature === razorpay_signature;

        if (isVerified) {
            return await this.processPaymentSuccess(order, razorpay_payment_id, razorpay_signature);
        } else {
            await this._orderRepository.updateOrder(order._id!.toString(), {
                paymentStatus: "failed"
            });
            throw new CustomError("Payment verification failed", StatusCode.BAD_REQUEST);
        }
    }

    async retryPayment(orderId: string, userId: string): Promise<IOrder> {
        const order = await this._orderRepository.findByIdAndUserId(orderId, userId);
        if (!order) {
            throw new CustomError("Order not found", StatusCode.NOT_FOUND);
        }

        if (order.paymentStatus === "completed") {
            throw new CustomError("Order is already paid", StatusCode.BAD_REQUEST);
        }

        if (order.orderStatus === "cancelled") {
            throw new CustomError("Order is cancelled", StatusCode.BAD_REQUEST);
        }

        // Check if expired
        if (new Date() > order.paymentExpiresAt) {
            // Mark as cancelled if expired during retry attempt
            await this.cancelOrder(order);
            throw new CustomError("Order payment window has expired. Please place a new order.", StatusCode.BAD_REQUEST);
        }

        // Create a new Razorpay order for retry
        try {
            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(order.finalAmount * 100),
                currency: "INR",
                receipt: `retry_rcptid_${order._id}`
            });

            const updatedOrder = await this._orderRepository.updateOrder(order._id!.toString(), {
                paymentDetails: {
                    ...order.paymentDetails,
                    gatewayOrderId: razorpayOrder.id
                }
            });

            return updatedOrder as IOrder;
        } catch (error: any) {
            logger.error("Razorpay Retry Order Creation Error", error);
            throw new CustomError("Failed to initiate payment retry", StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async handleWebhook(payload: any, signature: string): Promise<void> {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(JSON.stringify(payload))
            .digest("hex");

        if (expectedSignature !== signature) {
            logger.warn("Razorpay Webhook Signature Mismatch");
            return;
        }

        const event = payload.event;
        const payment = payload.payload.payment.entity;
        const orderId = payment.order_id;

        if (event === "payment.captured") {
            const order = await this._orderRepository.findByGatewayOrderId(orderId);
            if (order && order.paymentStatus !== "completed") {
                await this.processPaymentSuccess(order, payment.id, signature);
            }
        } else if (event === "payment.failed") {
            const order = await this._orderRepository.findByGatewayOrderId(orderId);
            if (order && order.paymentStatus === "pending") {
                await this._orderRepository.updateOrder(order._id!.toString(), {
                    paymentStatus: "failed"
                });
            }
        }
    }

    private async processPaymentSuccess(order: IOrder, paymentId: string, signature: string): Promise<IOrder> {
        const updatedOrder = (await this._orderRepository.updateOrder(order._id!.toString(), {
            paymentStatus: "completed",
            orderStatus: "processing",
            paymentDetails: {
                ...order.paymentDetails,
                gatewayPaymentId: paymentId,
                gatewaySignature: signature,
                paidAt: new Date()
            }
        })) as IOrder;

        // Commit stock (move from reserved to sold)
        try {
            for (const item of updatedOrder.items) {
                await this._productRepository.commitStock(
                    item.product.toString(),
                    item.variantName,
                    item.quantity
                );
            }
        } catch (error) {
            logger.error("Error committing stock for order: " + updatedOrder._id, error);
        }

        return updatedOrder;
    }

    private async cancelOrder(order: IOrder): Promise<void> {
        await this._orderRepository.updateOrder(order._id!.toString(), {
            orderStatus: "cancelled",
            paymentStatus: "expired"
        });

        // Release stock back to inventory
        try {
            for (const item of order.items) {
                await this._productRepository.releaseStock(
                    item.product.toString(),
                    item.variantName,
                    item.quantity
                );
            }
        } catch (error) {
            logger.error("Error releasing stock for order: " + order._id, error);
        }
    }
}
