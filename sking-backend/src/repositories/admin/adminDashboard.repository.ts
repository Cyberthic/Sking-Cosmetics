import { injectable } from "inversify";
import { UserModel } from "../../models/user.model";
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
}
