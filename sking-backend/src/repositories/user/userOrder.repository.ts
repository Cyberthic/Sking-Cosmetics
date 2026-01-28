import { injectable } from "inversify";
import { IUserOrderRepository } from "../../core/interfaces/repositories/user/IUserOrder.repository";
import Order, { IOrder } from "../../models/order.model";

@injectable()
export class UserOrderRepository implements IUserOrderRepository {
    async findByUserId(userId: string): Promise<IOrder[]> {
        return await Order.find({ user: userId }).sort({ createdAt: -1 }).populate("items.product");
    }

    async findByIdAndUserId(orderId: string, userId: string): Promise<IOrder | null> {
        return await Order.findOne({ _id: orderId, user: userId }).populate("items.product");
    }

    async findByGatewayOrderId(gatewayOrderId: string): Promise<IOrder | null> {
        return await Order.findOne({ "paymentDetails.gatewayOrderId": gatewayOrderId }).populate("items.product");
    }

    async updateOrder(orderId: string, updateData: any): Promise<IOrder | null> {
        if (updateData.orderStatus) {
            updateData.$push = {
                statusHistory: {
                    status: updateData.orderStatus,
                    timestamp: new Date(),
                    message: updateData.orderStatus === 'processing' ? 'Payment confirmed, order is being processed' :
                        updateData.orderStatus === 'cancelled' ? 'Order cancelled due to payment expiry or user action' :
                            `Status updated to ${updateData.orderStatus}`
                }
            };
        }
        return await Order.findByIdAndUpdate(orderId, updateData, { new: true });
    }
}
