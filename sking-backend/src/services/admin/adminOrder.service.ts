import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminOrderService } from "../../core/interfaces/services/admin/IAdminOrder.service";
import { IAdminOrderRepository } from "../../core/interfaces/repositories/admin/IAdminOrder.repository";
import { IOrder } from "../../models/order.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";
import { IWhatsappService } from "../../core/interfaces/services/IWhatsapp.service";
import logger from "../../utils/logger";

import { IUserProductRepository } from "../../core/interfaces/repositories/user/IUserProduct.repository";

import { IEmailService } from "../../core/interfaces/services/IEmail.service";

@injectable()
export class AdminOrderService implements IAdminOrderService {
    constructor(
        @inject(TYPES.IAdminOrderRepository) private _orderRepository: IAdminOrderRepository,
        @inject(TYPES.IUserProductRepository) private _productRepository: IUserProductRepository,
        @inject(TYPES.IWhatsappService) private _whatsappService: IWhatsappService,
        @inject(TYPES.IEmailService) private _emailService: IEmailService
    ) { }


    async getOrders(limit: number, page: number, search?: string, status?: string, sort?: string, orderType?: string): Promise<{ orders: IOrder[]; total: number; totalPages: number }> {
        const skip = (page - 1) * limit;
        const { orders, total } = await this._orderRepository.findAll(limit, skip, search, status, sort, orderType);

        // Lazy cancellation check
        const checkedOrders = await Promise.all(orders.map(order => this._checkAndCancelIfExpired(order)));

        return {
            orders: checkedOrders,
            total,
            totalPages: Math.ceil(total / limit)
        };
    }

    async getOrderById(id: string): Promise<IOrder | null> {
        const order = await this._orderRepository.findById(id);
        if (!order) {
            throw new CustomError("Order not found", StatusCode.NOT_FOUND);
        }
        return await this._checkAndCancelIfExpired(order);
    }

    private async _checkAndCancelIfExpired(order: IOrder): Promise<IOrder> {
        if (order.orderStatus === 'payment_pending' && order.paymentExpiresAt && new Date() > new Date(order.paymentExpiresAt)) {
            logger.info(`Lazy cancelling expired order: ${order._id}`);
            const updated = await this._orderRepository.updateStatus(
                order._id!.toString(),
                'cancelled',
                false,
                "Order cancelled automatically due to payment timeout (48h for WhatsApp / 15m for Online)."
            );

            if (updated) {
                for (const item of (updated as any).items) {
                    try {
                        await this._productRepository.releaseStock(item.product.toString(), item.variantName, item.quantity);
                    } catch (e) { logger.error(e); }
                }
            }
            return updated || order;
        }
        return order;
    }


    async updateOrderStatus(id: string, status: string, isCritical?: boolean, message?: string): Promise<IOrder | null> {
        const existingOrder = await this._orderRepository.findById(id);
        if (!existingOrder) {
            throw new CustomError("Order not found", StatusCode.NOT_FOUND);
        }

        // Prevent changing status of terminal states (delivered/cancelled) unless critical
        if ((existingOrder.orderStatus === "delivered" || existingOrder.orderStatus === "cancelled") && !isCritical) {
            throw new CustomError(`Cannot change status of a ${existingOrder.orderStatus} order. Use critical mode to override.`, StatusCode.BAD_REQUEST);
        }

        const order = await this._orderRepository.updateStatus(id, status, isCritical, message);
        if (!order) {
            throw new CustomError("Order not found", StatusCode.NOT_FOUND);
        }

        // Release stock if cancelled
        if (status === 'cancelled') {
            for (const item of (order as any).items) {
                try {
                    await this._productRepository.releaseStock(item.product.toString(), item.variantName, item.quantity);
                } catch (e) { logger.error(e); }
            }
        }

        // Send WhatsApp notification for status update
        if (order.whatsappOptIn) {
            try {
                await this._whatsappService.sendOrderStatusUpdateMessage(order);
            } catch (error) {
                logger.error(`Error sending order status update WhatsApp message for order ${id}`, error);
            }
        }

        // Send Email Status Update
        try {
            const emailToSend = order.shippingAddress?.email;
            if (emailToSend) {
                await this._emailService.sendOrderStatusUpdateEmail(emailToSend, order, status);
            }
        } catch (error) {
            logger.error(`Error sending order status update email for order ${id}`, error);
        }

        return order;
    }

    async confirmManualPayment(id: string, data: { upiTransactionId?: string, paymentScreenshot?: string, adminName: string }): Promise<IOrder | null> {
        const existingOrder = await this._orderRepository.findById(id);
        if (!existingOrder) {
            throw new CustomError("Order not found", StatusCode.NOT_FOUND);
        }

        if (existingOrder.paymentMethod !== "whatsapp") {
            throw new CustomError("Payment confirmation is only required for WhatsApp orders.", StatusCode.BAD_REQUEST);
        }

        if (existingOrder.paymentStatus === "completed") {
            throw new CustomError("Payment is already completed.", StatusCode.BAD_REQUEST);
        }

        const order = await this._orderRepository.confirmManualPayment(id, {
            upiTransactionId: data.upiTransactionId,
            paymentScreenshot: data.paymentScreenshot,
            verifiedBy: data.adminName
        });

        if (!order) {
            throw new CustomError("Order not found", StatusCode.NOT_FOUND);
        }

        // Send WhatsApp notification for status update (moves to processing)
        if (order.whatsappOptIn) {
            try {
                await this._whatsappService.sendOrderStatusUpdateMessage(order);
            } catch (error) {
                logger.error(`Error sending order status update WhatsApp message for order ${id}`, error);
            }
        }

        // Send Confirmation Email
        try {
            const emailToSend = order.shippingAddress?.email;
            if (emailToSend) {
                await this._emailService.sendOrderConfirmationEmail(emailToSend, order);
            }
        } catch (error) {
            logger.error(`Error sending order confirmation email for order ${id}`, error);
        }

        return order;
    }
}
