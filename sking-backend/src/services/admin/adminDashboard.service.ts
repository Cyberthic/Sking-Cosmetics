import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminDashboardService } from "../../core/interfaces/services/admin/IAdminDashboard.service";
import { IAdminDashboardRepository } from "../../core/interfaces/repositories/admin/IAdminDashboard.repository";
import { AdminDashboardStatsDto } from "../../core/dtos/admin/adminDashboard.dto";

@injectable()
export class AdminDashboardService implements IAdminDashboardService {
    constructor(
        @inject(TYPES.IAdminDashboardRepository) private _adminDashboardRepository: IAdminDashboardRepository
    ) { }

    async getDashboardStats(): Promise<AdminDashboardStatsDto> {
        const totalCustomers = await this._adminDashboardRepository.getCustomerCount();

        // Calculate growth compared to previous week
        const now = new Date();
        const startOfCurrentWeek = new Date(now);
        startOfCurrentWeek.setDate(now.getDate() - now.getDay());
        startOfCurrentWeek.setHours(0, 0, 0, 0);

        const startOfPreviousWeek = new Date(startOfCurrentWeek);
        startOfPreviousWeek.setDate(startOfPreviousWeek.getDate() - 7);

        const endOfPreviousWeek = new Date(startOfCurrentWeek);
        endOfPreviousWeek.setMilliseconds(-1);

        const currentWeekCustomers = await this._adminDashboardRepository.getCustomerCount(startOfCurrentWeek, now);
        const previousWeekCustomers = await this._adminDashboardRepository.getCustomerCount(startOfPreviousWeek, endOfPreviousWeek);

        let growthPercentage = 0;
        if (previousWeekCustomers > 0) {
            growthPercentage = ((currentWeekCustomers - previousWeekCustomers) / previousWeekCustomers) * 100;
        } else if (currentWeekCustomers > 0) {
            growthPercentage = 100;
        }

        return {
            customerStats: {
                totalCustomers,
                growthPercentage: parseFloat(growthPercentage.toFixed(2)),
                isGrowthPositive: growthPercentage >= 0
            }
        };
    }
}
