import { IOrder } from "../../../../models/order.model";

export interface IAdminOrderRepository {
    findAll(limit: number, skip: number, search?: string, status?: string, sort?: string): Promise<{ orders: IOrder[]; total: number }>;
    findById(id: string): Promise<IOrder | null>;
    updateStatus(id: string, status: string): Promise<IOrder | null>;
    countByStatus(status: string): Promise<number>;
}
