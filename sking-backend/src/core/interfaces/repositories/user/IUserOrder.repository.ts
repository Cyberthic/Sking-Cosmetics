import { IOrder } from "../../../../models/order.model";

export interface IUserOrderRepository {
    findByUserId(userId: string): Promise<IOrder[]>;
    findByIdAndUserId(orderId: string, userId: string): Promise<IOrder | null>;
    findByGatewayOrderId(gatewayOrderId: string): Promise<IOrder | null>;
    updateOrder(orderId: string, updateData: any): Promise<IOrder | null>;
}
