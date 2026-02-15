import { IOrder } from "../../../../models/order.model";

export interface IAdminOrderService {
    getOrders(limit: number, page: number, search?: string, status?: string, sort?: string, orderType?: string): Promise<{ orders: IOrder[]; total: number; totalPages: number }>;
    getOrderById(id: string): Promise<IOrder | null>;
    updateOrderStatus(id: string, status: string, isCritical?: boolean, message?: string): Promise<IOrder | null>;
    confirmManualPayment(id: string, data: { upiTransactionId?: string, paymentScreenshot?: string, adminName: string }): Promise<IOrder | null>;
}
