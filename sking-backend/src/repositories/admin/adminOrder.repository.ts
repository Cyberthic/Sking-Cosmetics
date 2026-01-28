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
            .populate("user", "name email")
            .populate("items.product")
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(filter);
        return { orders, total };
    }

    async findById(id: string): Promise<IOrder | null> {
        return await Order.findById(id)
            .populate("user", "name email")
            .populate("items.product");
    }

    async updateStatus(id: string, status: string): Promise<IOrder | null> {
        return await Order.findByIdAndUpdate(
            id,
            { orderStatus: status },
            { new: true }
        ).populate("user", "name email").populate("items.product");
    }

    async countByStatus(status: string): Promise<number> {
        return await Order.countDocuments({ orderStatus: status });
    }
}
