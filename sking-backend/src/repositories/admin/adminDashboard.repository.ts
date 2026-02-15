import { injectable } from "inversify";
import { UserModel } from "../../models/user.model";
import OrderModel from "../../models/order.model";
import DashboardConfigModel from "../../models/dashboardConfig.model";
import { IAdminDashboardRepository } from "../../core/interfaces/repositories/admin/IAdminDashboard.repository";

@injectable()
export class AdminDashboardRepository implements IAdminDashboardRepository {
    async getCustomerCount(startDate?: Date, endDate?: Date): Promise<number> {
        const filter: any = { isAdmin: { $ne: true } };

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = startDate;
            if (endDate) filter.createdAt.$lte = endDate;
        }

        return await UserModel.countDocuments(filter);
    }

    async getOrderCount(startDate?: Date, endDate?: Date): Promise<number> {
        const filter: any = {};

        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = startDate;
            if (endDate) filter.createdAt.$lte = endDate;
        }

        return await OrderModel.countDocuments(filter);
    }

    async getMonthlySales(startDate: Date, endDate: Date): Promise<{ label: string; totalSales: number; orderCount: number }[]> {
        const diffInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const useDayGroup = diffInDays <= 31;

        const sales = await OrderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: useDayGroup
                        ? { $dateToString: { format: "%d %b", date: "$createdAt" } }
                        : { $dateToString: { format: "%b %Y", date: "$createdAt" } },
                    sales: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "completed"] }, "$finalAmount", 0]
                        }
                    },
                    count: { $sum: 1 },
                    firstDate: { $min: "$createdAt" } // For sorting
                }
            },
            {
                $project: {
                    _id: 0,
                    label: "$_id",
                    totalSales: { $ifNull: ["$sales", 0] },
                    orderCount: { $ifNull: ["$count", 0] },
                    firstDate: 1
                }
            },
            {
                $sort: { firstDate: 1 }
            }
        ]);

        return sales;
    }

    async getMonthlyRevenue(startDate: Date, endDate: Date): Promise<number> {
        const result = await OrderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    paymentStatus: "completed"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$finalAmount" }
                }
            }
        ]);

        return result.length > 0 ? (result[0].totalRevenue || 0) : 0;
    }

    async getMonthlyTarget(month: number, year: number): Promise<number> {
        const config = await DashboardConfigModel.findOne({ month, year });
        return config ? (config.monthlyTarget || 0) : 0;
    }

    async updateMonthlyTarget(month: number, year: number, target: number): Promise<void> {
        await DashboardConfigModel.findOneAndUpdate(
            { month, year },
            { monthlyTarget: target },
            { upsert: true, new: true }
        );
    }

    async getCustomerPerformance(startDate: Date, endDate: Date): Promise<{ label: string; acquisition: number; retention: number }[]> {
        const diffInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const useDayGroup = diffInDays <= 31;

        const performance = await OrderModel.aggregate([
            {
                $match: {
                    paymentStatus: "completed"
                }
            },
            {
                $sort: { createdAt: 1 }
            },
            {
                $group: {
                    _id: "$user",
                    orders: {
                        $push: {
                            date: "$createdAt",
                            _id: "$_id"
                        }
                    }
                }
            },
            {
                $unwind: {
                    path: "$orders",
                    includeArrayIndex: "orderIndex"
                }
            },
            {
                $match: {
                    "orders.date": { $gte: startDate, $lte: endDate }
                }
            },
            {
                $project: {
                    label: useDayGroup
                        ? { $dateToString: { format: "%d %b", date: "$orders.date" } }
                        : { $dateToString: { format: "%b %Y", date: "$orders.date" } },
                    date: "$orders.date",
                    isFirstOrder: { $eq: ["$orderIndex", 0] }
                }
            },
            {
                $group: {
                    _id: "$label",
                    acquisition: {
                        $sum: { $cond: ["$isFirstOrder", 1, 0] }
                    },
                    retention: {
                        $sum: { $cond: ["$isFirstOrder", 0, 1] }
                    },
                    firstDate: { $min: "$date" }
                }
            },
            {
                $project: {
                    _id: 0,
                    label: "$_id",
                    acquisition: 1,
                    retention: 1,
                    firstDate: 1
                }
            },
            {
                $sort: { firstDate: 1 }
            }
        ]);

        return performance;
    }
}
