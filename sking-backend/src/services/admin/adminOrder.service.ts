import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminOrderService } from "../../core/interfaces/services/admin/IAdminOrder.service";
import { IAdminOrderRepository } from "../../core/interfaces/repositories/admin/IAdminOrder.repository";
import { IOrder } from "../../models/order.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";

@injectable()
export class AdminOrderService implements IAdminOrderService {
    constructor(
        @inject(TYPES.IAdminOrderRepository) private _orderRepository: IAdminOrderRepository
    ) { }

    async getOrders(limit: number, page: number, search?: string, status?: string, sort?: string): Promise<{ orders: IOrder[]; total: number; totalPages: number }> {
        const skip = (page - 1) * limit;
        const { orders, total } = await this._orderRepository.findAll(limit, skip, search, status, sort);

        return {
            orders,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }

    async getOrderById(id: string): Promise<IOrder | null> {
        const order = await this._orderRepository.findById(id);
        if (!order) {
            throw new CustomError("Order not found", StatusCode.NOT_FOUND);
        }
        return order;
    }

    async updateOrderStatus(id: string, status: string): Promise<IOrder | null> {
        // You might want to add validation for state transitions here
        const order = await this._orderRepository.updateStatus(id, status);
        if (!order) {
            throw new CustomError("Order not found", StatusCode.NOT_FOUND);
        }
        return order;
    }
}
