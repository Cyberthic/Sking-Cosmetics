import { IOrder } from "../../../../models/order.model";

export interface IAdminOrderRepository {
    findAll(limit: number, skip: number, search?: string, status?: string, sort?: string, orderType?: string): Promise<{ orders: IOrder[]; total: number }>;
    findById(id: string): Promise<IOrder | null>;
    updateStatus(id: string, status: string, isCritical?: boolean, message?: string): Promise<IOrder | null>;
    confirmManualPayment(id: string, data: { upiTransactionId?: string, paymentScreenshot?: string, verifiedBy: string }): Promise<IOrder | null>;
    countByStatus(status: string): Promise<number>;
}
