import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IUserOrderService } from "../../core/interfaces/services/user/IUserOrder.service";
import { IUserOrderRepository } from "../../core/interfaces/repositories/user/IUserOrder.repository";
import { IOrder } from "../../models/order.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";
import crypto from "crypto";
import logger from "../../utils/logger";

@injectable()
export class UserOrderService implements IUserOrderService {
    constructor(
        @inject(TYPES.IUserOrderRepository) private _orderRepository: IUserOrderRepository
    ) { }

    async getUserOrders(userId: string): Promise<IOrder[]> {
        return await this._orderRepository.findByUserId(userId);
    }

    async getOrderDetail(orderId: string, userId: string): Promise<IOrder> {
        const order = await this._orderRepository.findByIdAndUserId(orderId, userId);
        if (!order) {
            throw new CustomError("Order not found", StatusCode.NOT_FOUND);
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
            return (await this._orderRepository.updateOrder(order._id!.toString(), {
                paymentStatus: "completed",
                orderStatus: "processing",
                paymentDetails: {
                    ...order.paymentDetails,
                    gatewayPaymentId: razorpay_payment_id,
                    gatewaySignature: razorpay_signature,
                    paidAt: new Date()
                }
            })) as IOrder;
        } else {
            await this._orderRepository.updateOrder(order._id!.toString(), {
                paymentStatus: "failed"
            });
            throw new CustomError("Payment verification failed", StatusCode.BAD_REQUEST);
        }
    }
}
