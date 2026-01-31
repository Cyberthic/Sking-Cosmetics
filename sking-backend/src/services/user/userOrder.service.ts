import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IUserOrderService } from "../../core/interfaces/services/user/IUserOrder.service";
import { IUserOrderRepository } from "../../core/interfaces/repositories/user/IUserOrder.repository";
import { IUserProductRepository } from "../../core/interfaces/repositories/user/IUserProduct.repository";
import { ICartRepository } from "../../core/interfaces/repositories/user/ICart.repository";
import { IUserCouponService } from "../../core/interfaces/services/user/IUserCoupon.service";
import { IAdminTransactionRepository } from "../../core/interfaces/repositories/admin/IAdminTransaction.repository";
import { IOrder } from "../../models/order.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";
import crypto from "crypto";
import logger from "../../utils/logger";
import mongoose from "mongoose";
import razorpay from "../../config/razorpay";
import { IWhatsappService } from "../../core/interfaces/services/IWhatsapp.service";

@injectable()
export class UserOrderService implements IUserOrderService {
    constructor(
        @inject(TYPES.IUserOrderRepository) private _orderRepository: IUserOrderRepository,
        @inject(TYPES.IUserProductRepository) private _productRepository: IUserProductRepository,
        @inject(TYPES.ICartRepository) private _cartRepository: ICartRepository,
        @inject(TYPES.IUserCouponService) private _couponService: IUserCouponService,
        @inject(TYPES.IAdminTransactionRepository) private _transactionRepository: IAdminTransactionRepository,
        @inject(TYPES.IWhatsappService) private _whatsappService: IWhatsappService
    ) { }

    async getUserOrders(userId: string): Promise<IOrder[]> {
        const orders = await this._orderRepository.findByUserId(userId);
        const now = new Date();

        const updatedOrders = await Promise.all(orders.map(async (order) => {
            if (order.orderStatus === "payment_pending" && now > order.paymentExpiresAt) {
                await this._cancelOrderInternal(order);
                const refreshedOrder = await this._orderRepository.findByIdAndUserId(order._id!.toString(), userId);
                return refreshedOrder || order;
            }
            return order;
        }));

        return updatedOrders;
    }

    async getOrderDetail(orderId: string, userId: string): Promise<IOrder> {
        let order: IOrder | null = null;
        if (mongoose.Types.ObjectId.isValid(orderId)) {
            order = await this._orderRepository.findByIdAndUserId(orderId, userId);
        }
        if (!order) {
            order = await this._orderRepository.findByDisplayIdAndUserId(orderId, userId);
        }

        if (!order) {
            throw new CustomError("Order not found", StatusCode.NOT_FOUND);
        }

        if (order.orderStatus === "payment_pending" && new Date() > order.paymentExpiresAt) {
            await this._cancelOrderInternal(order);
            const refreshedOrder = await this._orderRepository.findByIdAndUserId(order._id!.toString(), userId);
            if (refreshedOrder) order = refreshedOrder;
        }

        return order;
    }

    async verifyPayment(userId: string, data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }): Promise<IOrder> {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

        const order = await this._orderRepository.findByGatewayOrderId(razorpay_order_id);
        if (!order) {
            logger.error(`Order not found for gatewayOrderId: ${razorpay_order_id}`);
            throw new CustomError("Order not found or already processed", StatusCode.NOT_FOUND);
        }

        if (order.user.toString() !== userId) {
            throw new CustomError("Unauthorized", StatusCode.FORBIDDEN);
        }

        if (order.paymentStatus === "completed") {
            return order;
        }

        if (order.orderStatus === "cancelled") {
            throw new CustomError("This order has been cancelled and cannot be paid", StatusCode.BAD_REQUEST);
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            return await this.processPaymentSuccess(order, razorpay_payment_id, razorpay_signature);
        } else {
            await this._orderRepository.updateOrder(order._id!.toString(), { paymentStatus: "failed" });
            try {
                await this._whatsappService.sendOrderFailureMessage(order);
            } catch (error) {
                logger.error("Error sending order failure WhatsApp message", error);
            }
            throw new CustomError("Payment verification failed", StatusCode.BAD_REQUEST);
        }
    }

    async retryPayment(orderId: string, userId: string): Promise<IOrder> {
        let order: IOrder | null = null;
        if (mongoose.Types.ObjectId.isValid(orderId)) {
            order = await this._orderRepository.findByIdAndUserId(orderId, userId);
        }
        if (!order) {
            order = await this._orderRepository.findByDisplayIdAndUserId(orderId, userId);
        }

        if (!order) {
            throw new CustomError("Order not found", StatusCode.NOT_FOUND);
        }

        if (order.paymentStatus === "completed") {
            throw new CustomError("Order is already paid", StatusCode.BAD_REQUEST);
        }

        if (order.orderStatus === "cancelled") {
            throw new CustomError("Order is cancelled", StatusCode.BAD_REQUEST);
        }

        if (new Date() > order.paymentExpiresAt) {
            await this._cancelOrderInternal(order);
            throw new CustomError("Order payment window has expired.", StatusCode.BAD_REQUEST);
        }

        try {
            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(order.finalAmount * 100),
                currency: "INR",
                receipt: `retry_rcptid_${order.displayId}`
            });

            const updatedOrder = await this._orderRepository.updateOrder(order._id!.toString(), {
                paymentDetails: {
                    ...(order.toObject().paymentDetails || {}),
                    gatewayOrderId: razorpayOrder.id
                }
            });

            return updatedOrder as IOrder;
        } catch (error: any) {
            logger.error("Razorpay Retry Order Creation Error", error);
            throw new CustomError("Failed to initiate payment retry", StatusCode.INTERNAL_SERVER_ERROR);
        }
    }

    async cancelOrder(orderId: string, userId: string): Promise<void> {
        let order: IOrder | null = null;
        if (mongoose.Types.ObjectId.isValid(orderId)) {
            order = await this._orderRepository.findByIdAndUserId(orderId, userId);
        }
        if (!order) {
            order = await this._orderRepository.findByDisplayIdAndUserId(orderId, userId);
        }

        if (!order) {
            throw new CustomError("Order not found", StatusCode.NOT_FOUND);
        }

        if (order.paymentStatus === "completed") {
            throw new CustomError("Cannot cancel a paid order", StatusCode.BAD_REQUEST);
        }

        if (order.orderStatus === "cancelled") return;

        await this._cancelOrderInternal(order);
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
                await this._orderRepository.updateOrder(order._id!.toString(), { paymentStatus: "failed" });
                try {
                    await this._whatsappService.sendOrderFailureMessage(order);
                } catch (error) {
                    logger.error("Error sending order failure WhatsApp message", error);
                }
            }
        }
    }

    private async processPaymentSuccess(order: IOrder, paymentId: string, signature: string): Promise<IOrder> {
        // Idempotency check
        const freshOrder = await this._orderRepository.findByIdAndUserId(order._id!.toString(), order.user.toString());
        if (!freshOrder || freshOrder.paymentStatus === "completed") {
            return freshOrder || order;
        }

        const updatedOrder = await this._orderRepository.updateOrder(order._id!.toString(), {
            paymentStatus: "completed",
            orderStatus: "processing",
            paymentDetails: {
                ...(order.toObject().paymentDetails || {}),
                gatewayPaymentId: paymentId,
                gatewaySignature: signature,
                paidAt: new Date()
            }
        });

        if (!updatedOrder) throw new Error("Failed to update order");

        try { await this._cartRepository.clearCart(order.user.toString()); } catch (e) { logger.error(e); }
        if (updatedOrder.discountCode) {
            try { await this._couponService.markCouponUsed(updatedOrder.discountCode, updatedOrder.user.toString()); } catch (e) { logger.error(e); }
        }

        for (const item of updatedOrder.items) {
            try {
                await this._productRepository.commitStock(item.product.toString(), item.variantName, item.quantity);
            } catch (e) { logger.error(e); }
        }

        try {
            await this._transactionRepository.create({
                user: order.user as any,
                order: order._id as any,
                amount: order.finalAmount,
                type: 'debit',
                status: 'completed',
                paymentMethod: 'online',
                transactionId: paymentId || `txn_${order._id}`,
                description: `Payment for Order #${order.displayId}`
            });
        } catch (e) { logger.error(e); }

        try {
            await this._whatsappService.sendOrderSuccessMessage(updatedOrder);
        } catch (error) {
            logger.error("Error sending order success WhatsApp message", error);
        }

        return updatedOrder;
    }

    private async _cancelOrderInternal(order: IOrder): Promise<void> {
        await this._orderRepository.updateOrder(order._id!.toString(), {
            orderStatus: "cancelled",
            paymentStatus: "expired"
        });

        for (const item of order.items) {
            try {
                await this._productRepository.releaseStock(item.product.toString(), item.variantName, item.quantity);
            } catch (e) { logger.error(e); }
        }
    }
}
