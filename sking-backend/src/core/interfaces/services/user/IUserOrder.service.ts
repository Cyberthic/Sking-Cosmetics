import { IOrder } from "../../../../models/order.model";

export interface IUserOrderService {
    getUserOrders(userId: string): Promise<IOrder[]>;
    getOrderDetail(orderId: string, userId: string): Promise<IOrder>;
    verifyPayment(userId: string, data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }): Promise<IOrder>;
    retryPayment(orderId: string, userId: string): Promise<IOrder>;
    cancelOrder(orderId: string, userId: string): Promise<void>;
    handleWebhook(payload: any, signature: string): Promise<void>;
}
