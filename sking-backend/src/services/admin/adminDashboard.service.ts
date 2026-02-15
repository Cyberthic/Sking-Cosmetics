import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { DashboardPeriod, IAdminDashboardService } from "../../core/interfaces/services/admin/IAdminDashboard.service";
import { IAdminDashboardRepository } from "../../core/interfaces/repositories/admin/IAdminDashboard.repository";
import { AdminDashboardStatsDto, SalesDataPointDto, PerformanceDataPointDto } from "../../core/dtos/admin/adminDashboard.dto";

@injectable()
export class AdminDashboardService implements IAdminDashboardService {
    constructor(
        @inject(TYPES.IAdminDashboardRepository) private _adminDashboardRepository: IAdminDashboardRepository
    ) { }

    async getDashboardStats(
        customerPeriod: DashboardPeriod,
        orderPeriod: DashboardPeriod,
        startDate?: Date,
        endDate?: Date
    ): Promise<AdminDashboardStatsDto> {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        // Default range is current year if not provided
        const chartStart = startDate || new Date(currentYear, 0, 1);
        const chartEnd = endDate || new Date(currentYear, 11, 31, 23, 59, 59, 999);

        const totalCustomers = await this._adminDashboardRepository.getCustomerCount();
        const totalOrders = await this._adminDashboardRepository.getOrderCount();

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

        // Monthly Sales (using the provided or default range)
        const salesData = await this._adminDashboardRepository.getMonthlySales(chartStart, chartEnd);
        const monthlySales: SalesDataPointDto[] = salesData.map(s => ({
            month: s.label,
            sales: Number(s.totalSales || 0),
            orders: Number(s.orderCount || 0)
        }));

        // Customer Performance (using the provided or default range)
        const performanceData = await this._adminDashboardRepository.getCustomerPerformance(chartStart, chartEnd);
        const customerPerformance: PerformanceDataPointDto[] = performanceData.map(p => ({
            month: p.label,
            acquisition: Number(p.acquisition || 0),
            retention: Number(p.retention || 0)
        }));

        // Monthly Target
        const target = await this._adminDashboardRepository.getMonthlyTarget(currentMonth, currentYear);

        const startOfMonth = new Date(currentYear, now.getMonth(), 1);
        const endOfMonth = new Date(currentYear, now.getMonth() + 1, 0, 23, 59, 59, 999);
        const revenue = await this._adminDashboardRepository.getMonthlyRevenue(startOfMonth, endOfMonth);

        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const todayRevenue = await this._adminDashboardRepository.getMonthlyRevenue(startOfToday, endOfToday);

        const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth();
        const lastMonthYear = now.getMonth() === 0 ? currentYear - 1 : currentYear;
        const startOfLastMonth = new Date(lastMonthYear, lastMonth - 1, 1);
        const endOfLastMonth = new Date(lastMonthYear, lastMonth, 0, 23, 59, 59, 999);
        const lastMonthRevenue = await this._adminDashboardRepository.getMonthlyRevenue(startOfLastMonth, endOfLastMonth);

        let growthFromLastMonth = 0;
        if (lastMonthRevenue > 0) {
            growthFromLastMonth = ((revenue - lastMonthRevenue) / lastMonthRevenue) * 100;
        } else if (revenue > 0) {
            growthFromLastMonth = 100;
        }

        const progressPercentage = target > 0 ? (revenue / target) * 100 : 0;

        const safeFixed = (val: any) => {
            const num = parseFloat(val);
            return Number.isFinite(num) ? parseFloat(num.toFixed(2)) : 0;
        };

        return {
            customerStats: {
                totalCustomers,
                growthPercentage: safeFixed(customerGrowth),
                isGrowthPositive: customerGrowth >= 0
            },
            orderStats: {
                totalOrders,
                growthPercentage: safeFixed(orderGrowth),
                isGrowthPositive: orderGrowth >= 0
            },
            monthlySales,
            monthlyTarget: {
                target: target || 0,
                revenue: revenue || 0,
                todayRevenue: todayRevenue || 0,
                progressPercentage: safeFixed(progressPercentage),
                growthFromLastMonth: safeFixed(growthFromLastMonth)
            },
            customerPerformance
        };
    }

    async updateMonthlyTarget(target: number): Promise<void> {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        await this._adminDashboardRepository.updateMonthlyTarget(currentMonth, currentYear, target);
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
