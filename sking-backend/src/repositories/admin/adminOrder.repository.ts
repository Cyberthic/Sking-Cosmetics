import { injectable } from "inversify";
import Order, { IOrder } from "../../models/order.model";
import { IAdminOrderRepository } from "../../core/interfaces/repositories/admin/IAdminOrder.repository";

@injectable()
export class AdminOrderRepository implements IAdminOrderRepository {
    async findAll(limit: number, skip: number, search?: string, status?: string, sort?: string): Promise<{ orders: IOrder[]; total: number }> {
        const filter: any = {};

        if (search) {
            // Search by order ID or user name/email if populated, 
            // but usually searching by order ID suffix or partial ID is common in admin
            filter.$or = [
                { _id: search.match(/^[0-9a-fA-F]{24}$/) ? search : undefined },
                { "shippingAddress.name": { $regex: search, $options: "i" } },
                { "shippingAddress.email": { $regex: search, $options: "i" } }
            ].filter(query => query._id !== undefined || query["shippingAddress.name"] !== undefined);
        }

        if (status && status !== 'all') {
            filter.orderStatus = status;
        }

        const sortCriteria: any = { createdAt: sort === 'asc' ? 1 : -1 };

        const orders = await Order.find(filter)
            .populate("user", "name email phoneNumber")
            .populate("items.product")
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(filter);
        return { orders, total };
    }

    async findById(id: string): Promise<IOrder | null> {
        return await Order.findById(id)
            .populate("user", "name email phoneNumber")
            .populate("items.product");
    }

    async updateStatus(id: string, status: string, isCritical?: boolean, message?: string): Promise<IOrder | null> {
        const historyMessage = message || (isCritical
            ? `Order status CRITICALLY modified to ${status} by Admin`
            : `Order marked as ${status} by Admin`);

        return await Order.findByIdAndUpdate(
            id,
            {
                $set: {
                    orderStatus: status,
                    ...(status === 'cancelled' ? { paymentStatus: 'cancelled' } : {})
                },
                $push: {
                    statusHistory: {
                        status,
                        timestamp: new Date(),
                        message: historyMessage,
                        isCritical: !!isCritical
                    }
                }
            },
            { new: true }
        ).populate("user", "name email phoneNumber").populate("items.product");
    }

    async confirmManualPayment(id: string, data: { upiTransactionId?: string, paymentScreenshot?: string, verifiedBy: string }): Promise<IOrder | null> {
        return await Order.findByIdAndUpdate(
            id,
            {
                $set: {
                    paymentStatus: "completed",
                    orderStatus: "processing",
                    manualPaymentDetails: {
                        ...data,
                        verifiedAt: new Date()
                    }
                },
                $push: {
                    statusHistory: {
                        status: "processing",
                        timestamp: new Date(),
                        message: `Manual payment confirmed by Admin (${data.verifiedBy}). Trans ID: ${data.upiTransactionId || 'N/A'}`
                    }
                }
            },
            { new: true }
        ).populate("user", "name email phoneNumber").populate("items.product");
    }

    async countByStatus(status: string): Promise<number> {
        return await Order.countDocuments({ orderStatus: status });
    }
}
