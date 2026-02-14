import { injectable } from "inversify";
import { UserModel } from "../../models/user.model";
import OrderModel from "../../models/order.model";
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

    async getMonthlySales(year: number): Promise<{ month: number; totalSales: number }[]> {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

        const sales = await OrderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    paymentStatus: "completed"
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalSales: { $sum: "$finalAmount" }
                }
            },
            {
                $project: {
                    month: "$_id",
                    totalSales: 1,
                    _id: 0
                }
            },
            {
                $sort: { month: 1 }
            }
        ]);

        return sales;
    }
}
