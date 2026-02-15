import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { DashboardPeriod, IAdminDashboardService } from "../../core/interfaces/services/admin/IAdminDashboard.service";
import { IAdminDashboardRepository } from "../../core/interfaces/repositories/admin/IAdminDashboard.repository";
import { AdminDashboardStatsDto, SalesDataPointDto, PerformanceDataPointDto, RecentOrderDto } from "../../core/dtos/admin/adminDashboard.dto";

@injectable()
export class AdminDashboardService implements IAdminDashboardService {
    constructor(
        @inject(TYPES.IAdminDashboardRepository) private _adminDashboardRepository: IAdminDashboardRepository
    ) { }

    async getSummaryStats(
        customerPeriod: DashboardPeriod,
        orderPeriod: DashboardPeriod,
        startDate?: Date,
        endDate?: Date
    ): Promise<Pick<AdminDashboardStatsDto, 'customerStats' | 'orderStats'>> {
        const now = new Date();
        const safeFixed = (val: any) => {
            const num = parseFloat(val);
            return Number.isFinite(num) ? parseFloat(num.toFixed(2)) : 0;
        };

        // Helper to get ranges either from custom dates or period
        const getRanges = (period: DashboardPeriod, start?: Date, end?: Date) => {
            if (start && end) {
                const duration = end.getTime() - start.getTime();
                const currentStart = start;
                const previousEnd = new Date(start.getTime() - 1);
                const previousStart = new Date(previousEnd.getTime() - duration);
                return { currentStart, previousStart, previousEnd: new Date(end) }; // Ensure end covers the full range if needed, here we assume 'end' is inclusive or handled by caller
            }
            return this._getDateRanges(period, now);
        };

        const totalCustomers = await this._adminDashboardRepository.getCustomerCount();
        const totalOrders = await this._adminDashboardRepository.getOrderCount();

        // Customer growth
        const customerRanges = getRanges(customerPeriod, startDate, endDate);
        // Ensure endDate covers the full day if it was just a date string converted to 00:00:00
        const custEnd = startDate && endDate ? endDate : now;

        const currentPeriodCustomers = await this._adminDashboardRepository.getCustomerCount(customerRanges.currentStart, custEnd);
        const previousPeriodCustomers = await this._adminDashboardRepository.getCustomerCount(customerRanges.previousStart, customerRanges.previousEnd);

        let customerGrowth = 0;
        if (previousPeriodCustomers > 0) {
            customerGrowth = ((currentPeriodCustomers - previousPeriodCustomers) / previousPeriodCustomers) * 100;
        } else if (currentPeriodCustomers > 0) {
            customerGrowth = 100;
        }

        // Order growth
        const orderRanges = getRanges(orderPeriod, startDate, endDate);
        const orderEnd = startDate && endDate ? endDate : now;

        const currentPeriodOrders = await this._adminDashboardRepository.getOrderCount(orderRanges.currentStart, orderEnd);
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
                growthPercentage: safeFixed(customerGrowth),
                isGrowthPositive: customerGrowth >= 0
            },
            orderStats: {
                totalOrders,
                growthPercentage: safeFixed(orderGrowth),
                isGrowthPositive: orderGrowth >= 0
            }
        };
    }

    async getSalesChart(startDate?: Date, endDate?: Date): Promise<SalesDataPointDto[]> {
        const now = new Date();
        const currentYear = now.getFullYear();
        const chartStart = startDate || new Date(currentYear, 0, 1);
        const chartEnd = endDate || new Date(currentYear, 11, 31, 23, 59, 59, 999);

        const salesData = await this._adminDashboardRepository.getMonthlySales(chartStart, chartEnd);
        return salesData.map(s => ({
            month: s.label,
            sales: Number(s.totalSales || 0),
            orders: Number(s.orderCount || 0)
        }));
    }

    async getCustomerPerformance(startDate?: Date, endDate?: Date): Promise<PerformanceDataPointDto[]> {
        const now = new Date();
        const currentYear = now.getFullYear();
        const chartStart = startDate || new Date(currentYear, 0, 1);
        const chartEnd = endDate || new Date(currentYear, 11, 31, 23, 59, 59, 999);

        const performanceData = await this._adminDashboardRepository.getCustomerPerformance(chartStart, chartEnd);
        return performanceData.map(p => ({
            month: p.label,
            acquisition: Number(p.acquisition || 0),
            retention: Number(p.retention || 0)
        }));
    }

    async getRecentOrdersData(): Promise<RecentOrderDto[]> {
        const rOrders = await this._adminDashboardRepository.getRecentOrders(5);
        return rOrders.map(o => {
            let productImage = "";
            if (o.items && o.items.length > 0 && o.items[0].product && o.items[0].product.images && o.items[0].product.images.length > 0) {
                const img = o.items[0].product.images[0];
                if (img && img.trim() !== "") {
                    productImage = img;
                }
            }

            return {
                _id: o._id.toString(),
                displayId: o.displayId || o._id.toString().substring(0, 8),
                customerName: o.user?.name || "Guest",
                amount: o.finalAmount,
                status: o.orderStatus,
                date: o.createdAt.toISOString(),
                itemsCount: o.items?.length || 0,
                productImage: productImage
            };
        });
    }

    async getDemographicsData(): Promise<{ demographics: any[], stateDemographics: any[] }> {
        const demographics = await this._adminDashboardRepository.getDemographics();
        const stateDemographics = await this._adminDashboardRepository.getStateDemographics();
        return { demographics, stateDemographics };
    }

    async getMonthlyTargetData(): Promise<any> {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

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
            target: target || 0,
            revenue: revenue || 0,
            todayRevenue: todayRevenue || 0,
            progressPercentage: safeFixed(progressPercentage),
            growthFromLastMonth: safeFixed(growthFromLastMonth)
        };
    }

    async getDashboardStats(
        customerPeriod: DashboardPeriod,
        orderPeriod: DashboardPeriod,
        startDate?: Date,
        endDate?: Date
    ): Promise<AdminDashboardStatsDto> {
        // Fallback or aggregate method if needed, using the new methods
        const summary = await this.getSummaryStats(customerPeriod, orderPeriod, startDate, endDate);
        const sales = await this.getSalesChart(startDate, endDate);
        const performance = await this.getCustomerPerformance(startDate, endDate);
        const orders = await this.getRecentOrdersData();
        const demo = await this.getDemographicsData();
        const target = await this.getMonthlyTargetData();

        return {
            ...summary,
            monthlySales: sales,
            customerPerformance: performance,
            recentOrders: orders,
            monthlyTarget: target,
            ...demo
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
