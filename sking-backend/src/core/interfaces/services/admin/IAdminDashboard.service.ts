import { AdminDashboardStatsDto } from "../../../dtos/admin/adminDashboard.dto";

export type DashboardPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface IAdminDashboardService {
    getDashboardStats(
        customerPeriod: DashboardPeriod,
        orderPeriod: DashboardPeriod,
        startDate?: Date,
        endDate?: Date
    ): Promise<AdminDashboardStatsDto>;
    updateMonthlyTarget(target: number): Promise<void>;

    getSummaryStats(
        customerPeriod: DashboardPeriod,
        orderPeriod: DashboardPeriod,
        startDate?: Date,
        endDate?: Date
    ): Promise<Pick<AdminDashboardStatsDto, 'customerStats' | 'orderStats'>>;

    getSalesChart(startDate?: Date, endDate?: Date): Promise<any[]>;

    getCustomerPerformance(startDate?: Date, endDate?: Date): Promise<any[]>;

    getRecentOrdersData(): Promise<any[]>;

    getDemographicsData(): Promise<{ demographics: any[], stateDemographics: any[] }>;

    getMonthlyTargetData(): Promise<any>;
}
