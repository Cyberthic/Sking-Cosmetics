import { IOrder } from "../../../../models/order.model";

export interface IAdminOrderService {
    getOrders(limit: number, page: number, search?: string, status?: string, sort?: string): Promise<{ orders: IOrder[]; total: number; totalPages: number }>;
    getOrderById(id: string): Promise<IOrder | null>;
    updateOrderStatus(id: string, status: string): Promise<IOrder | null>;
}
