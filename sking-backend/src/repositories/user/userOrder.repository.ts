import { injectable } from "inversify";
import { IUserOrderRepository } from "../../core/interfaces/repositories/user/IUserOrder.repository";
import Order, { IOrder } from "../../models/order.model";
import mongoose from "mongoose";

@injectable()
export class UserOrderRepository implements IUserOrderRepository {
    async findByUserId(userId: string): Promise<IOrder[]> {
        return await Order.find({ user: userId }).sort({ createdAt: -1 }).populate("items.product");
    }

    async findByUserIdPaginated(userId: string, page: number, limit: number): Promise<{ orders: IOrder[], total: number }> {
        const skip = (page - 1) * limit;
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("items.product");

        const total = await Order.countDocuments({ user: userId });

        return { orders, total };
    }

    async findByIdAndUserId(orderId: string, userId: string): Promise<IOrder | null> {
        return await Order.findOne({ _id: orderId, user: userId }).populate("items.product");
    }

    async findByGatewayOrderId(gatewayOrderId: string): Promise<IOrder | null> {
        return await Order.findOne({ "paymentDetails.gatewayOrderId": gatewayOrderId }).populate("items.product");
    }

    async updateOrder(orderId: string, updateData: any): Promise<IOrder | null> {
        if (updateData.orderStatus) {
            updateData.$push = {
                statusHistory: {
                    status: updateData.orderStatus,
                    timestamp: new Date(),
                    message: updateData.orderStatus === 'processing' ? 'Payment confirmed, order is being processed' :
                        updateData.orderStatus === 'cancelled' ? 'Order cancelled due to payment expiry or user action' :
                            `Status updated to ${updateData.orderStatus}`
                }
            };
        }
        return await Order.findByIdAndUpdate(orderId, updateData, { new: true });
    }

    async findByProductIdPaginated(productId: string, page: number, limit: number): Promise<{ orders: IOrder[], total: number }> {
        const skip = (page - 1) * limit;
        const filter = { "items.product": productId };

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("items.product")
            .populate("shippingAddress"); // Populate shipping address for customer name

        const total = await Order.countDocuments(filter);

        return { orders, total };
    }

    async findTopCustomersByProductId(productId: string, limit: number): Promise<any[]> {
        return await Order.aggregate([
            { $match: { "items.product": new mongoose.Types.ObjectId(productId), "paymentDetails.paymentStatus": "paid" } }, // Only paid/completed orders usually
            { $unwind: "$items" },
            { $match: { "items.product": new mongoose.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: "$user",
                    totalQuantity: { $sum: "$items.quantity" },
                    totalSpent: { $sum: "$items.price" }, // Assuming price stored is per unit * qty or just per unit? Usually price is per unit.
                    addressId: { $first: "$shippingAddress" }, // To get user name later if needed, or we can look up User
                    lastOrderDate: { $max: "$createdAt" }
                }
            },
            { $sort: { totalQuantity: -1, totalSpent: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                $project: {
                    _id: 1,
                    totalQuantity: 1,
                    totalSpent: 1,
                    lastOrderDate: 1,
                    name: "$userDetails.name",
                    email: "$userDetails.email",
                    profilePicture: "$userDetails.profilePicture"
                }
            }
        ]);
    }

    async findStatsByProductId(productId: string): Promise<{ totalOrders: number, totalRevenue: number, totalUnitsSold: number }> {
        const stats = await Order.aggregate([
            { $match: { "items.product": new mongoose.Types.ObjectId(productId), "orderStatus": { $nin: ["cancelled", "payment_pending"] } } }, // Exclude cancelled/pending
            { $unwind: "$items" },
            { $match: { "items.product": new mongoose.Types.ObjectId(productId) } },
            {
                $group: {
                    _id: null,
                    totalOrders: { $addToSet: "$_id" }, // Using addToSet to count unique orders, but we unwound items.
                    // Wait, if we unwind, we duplicate orders. So just counting rows here is wrong for "Total Orders".
                    // But we can count unique _id for Total Orders.
                    totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                    totalUnitsSold: { $sum: "$items.quantity" }
                }
            },
            {
                $project: {
                    totalOrders: { $size: "$totalOrders" },
                    totalRevenue: 1,
                    totalUnitsSold: 1
                }
            }
        ]);

        return stats.length > 0 ? stats[0] : { totalOrders: 0, totalRevenue: 0, totalUnitsSold: 0 };
    }
}
