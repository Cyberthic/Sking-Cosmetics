import { IOrder } from "../../../../models/order.model";

export interface IUserOrderRepository {
    findByUserId(userId: string): Promise<IOrder[]>;
    findByUserIdPaginated(userId: string, page: number, limit: number): Promise<{ orders: IOrder[], total: number }>;
    findByIdAndUserId(orderId: string, userId: string): Promise<IOrder | null>;
    findByDisplayId(displayId: string): Promise<IOrder | null>;
    findByDisplayIdAndUserId(displayId: string, userId: string): Promise<IOrder | null>;
    findByGatewayOrderId(gatewayOrderId: string): Promise<IOrder | null>;
    updateOrderByDisplayId(displayId: string, updateData: any): Promise<IOrder | null>;
    updateOrder(orderId: string, updateData: any): Promise<IOrder | null>;
    findByProductIdPaginated(productId: string, page: number, limit: number): Promise<{ orders: IOrder[], total: number }>;
    findTopCustomersByProductId(productId: string, limit: number): Promise<any[]>;
    findStatsByProductId(productId: string): Promise<{ totalOrders: number, totalRevenue: number, totalUnitsSold: number }>;
    findByCouponIdPaginated(couponId: string, page: number, limit: number): Promise<{ orders: IOrder[], total: number }>;
    findStatsByCouponId(couponId: string): Promise<{ totalUsage: number, totalDiscount: number, totalRevenue: number }>;
}
