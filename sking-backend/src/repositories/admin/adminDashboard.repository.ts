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

    async getMonthlySales(year: number): Promise<{ month: number; totalSales: number; orderCount: number }[]> {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

        const sales = await OrderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    sales: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "completed"] }, "$finalAmount", 0]
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    totalSales: { $ifNull: ["$sales", 0] },
                    orderCount: { $ifNull: ["$count", 0] }
                }
            },
            {
                $sort: { month: 1 }
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
}
