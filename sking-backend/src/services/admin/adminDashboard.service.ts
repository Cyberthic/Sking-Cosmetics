import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { DashboardPeriod, IAdminDashboardService } from "../../core/interfaces/services/admin/IAdminDashboard.service";
import { IAdminDashboardRepository } from "../../core/interfaces/repositories/admin/IAdminDashboard.repository";
import { AdminDashboardStatsDto } from "../../core/dtos/admin/adminDashboard.dto";

@injectable()
export class AdminDashboardService implements IAdminDashboardService {
    constructor(
        @inject(TYPES.IAdminDashboardRepository) private _adminDashboardRepository: IAdminDashboardRepository
    ) { }

    async getDashboardStats(customerPeriod: DashboardPeriod, orderPeriod: DashboardPeriod): Promise<AdminDashboardStatsDto> {
        const totalCustomers = await this._adminDashboardRepository.getCustomerCount();
        const totalOrders = await this._adminDashboardRepository.getOrderCount();

        const now = new Date();

        // Customer growth
        const customerRanges = this._getDateRanges(customerPeriod, now);
        const currentPeriodCustomers = await this._adminDashboardRepository.getCustomerCount(customerRanges.currentStart, now);
        const previousPeriodCustomers = await this._adminDashboardRepository.getCustomerCount(customerRanges.previousStart, customerRanges.previousEnd);

        let customerGrowth = 0;
        if (previousPeriodCustomers > 0) {
            customerGrowth = ((currentPeriodCustomers - previousPeriodCustomers) / previousPeriodCustomers) * 100;
        } else if (currentPeriodCustomers > 0) {
            customerGrowth = 100;
        }

        // Order growth
        const orderRanges = this._getDateRanges(orderPeriod, now);
        const currentPeriodOrders = await this._adminDashboardRepository.getOrderCount(orderRanges.currentStart, now);
        const previousPeriodOrders = await this._adminDashboardRepository.getOrderCount(orderRanges.previousStart, orderRanges.previousEnd);

        let orderGrowth = 0;
        if (previousPeriodOrders > 0) {
            orderGrowth = ((currentPeriodOrders - previousPeriodOrders) / previousPeriodOrders) * 100;
        } else if (currentPeriodOrders > 0) {
            orderGrowth = 100;
        }

        return {
            customerStats: {
                totalCustomers,
                growthPercentage: parseFloat(customerGrowth.toFixed(2)),
                isGrowthPositive: customerGrowth >= 0
            },
            orderStats: {
                totalOrders,
                growthPercentage: parseFloat(orderGrowth.toFixed(2)),
                isGrowthPositive: orderGrowth >= 0
            }
        };
    }

    private _getDateRanges(period: DashboardPeriod, now: Date) {
        let currentStart = new Date(now);
        let previousStart = new Date(now);
        let previousEnd = new Date(now);

        switch (period) {
            case 'weekly':
                currentStart.setDate(now.getDate() - now.getDay());
                currentStart.setHours(0, 0, 0, 0);
                previousStart = new Date(currentStart);
                previousStart.setDate(previousStart.getDate() - 7);
                previousEnd = new Date(currentStart);
                previousEnd.setMilliseconds(-1);
                break;
            case 'monthly':
                currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
                previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                previousEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
                break;
            case 'quarterly':
                const currentQuarter = Math.floor(now.getMonth() / 3);
                currentStart = new Date(now.getFullYear(), currentQuarter * 3, 1);
                previousStart = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1);
                previousEnd = new Date(now.getFullYear(), currentQuarter * 3, 0, 23, 59, 59, 999);
                break;
            case 'yearly':
                currentStart = new Date(now.getFullYear(), 0, 1);
                previousStart = new Date(now.getFullYear() - 1, 0, 1);
                previousEnd = new Date(now.getFullYear(), 0, 0, 23, 59, 59, 999);
                break;
        }

        return { currentStart, previousStart, previousEnd };
    }
}
