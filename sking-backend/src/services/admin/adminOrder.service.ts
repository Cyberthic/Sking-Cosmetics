import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminOrderService } from "../../core/interfaces/services/admin/IAdminOrder.service";
import { IAdminOrderRepository } from "../../core/interfaces/repositories/admin/IAdminOrder.repository";
import { IOrder } from "../../models/order.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";
import { IWhatsappService } from "../../core/interfaces/services/IWhatsapp.service";
import logger from "../../utils/logger";

@injectable()
export class AdminOrderService implements IAdminOrderService {
    constructor(
        @inject(TYPES.IAdminOrderRepository) private _orderRepository: IAdminOrderRepository,
        @inject(TYPES.IWhatsappService) private _whatsappService: IWhatsappService
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

    async updateOrderStatus(id: string, status: string, isCritical?: boolean): Promise<IOrder | null> {
        const existingOrder = await this._orderRepository.findById(id);
        if (!existingOrder) {
            throw new CustomError("Order not found", StatusCode.NOT_FOUND);
        }

        // Prevent changing status of terminal states (delivered/cancelled) unless critical
        if ((existingOrder.orderStatus === "delivered" || existingOrder.orderStatus === "cancelled") && !isCritical) {
            throw new CustomError(`Cannot change status of a ${existingOrder.orderStatus} order. Use critical mode to override.`, StatusCode.BAD_REQUEST);
        }

        const order = await this._orderRepository.updateStatus(id, status, isCritical);
        if (!order) {
            throw new CustomError("Order not found", StatusCode.NOT_FOUND);
        }

        // Send WhatsApp notification for status update
        try {
            await this._whatsappService.sendOrderStatusUpdateMessage(order);
        } catch (error) {
            logger.error(`Error sending order status update WhatsApp message for order ${id}`, error);
        }

        return order;
    }
}
