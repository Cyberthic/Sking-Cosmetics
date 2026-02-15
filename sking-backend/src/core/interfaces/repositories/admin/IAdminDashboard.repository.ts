import { RecentOrderDto } from "../../../dtos/admin/adminDashboard.dto";

export interface IAdminDashboardRepository {
    getCustomerCount(startDate?: Date, endDate?: Date): Promise<number>;
    getOrderCount(startDate?: Date, endDate?: Date): Promise<number>;
    getMonthlySales(startDate: Date, endDate: Date): Promise<{ label: string, totalSales: number, orderCount: number }[]>;
    getMonthlyRevenue(startDate: Date, endDate: Date): Promise<number>;
    getMonthlyTarget(month: number, year: number): Promise<number>;
    updateMonthlyTarget(month: number, year: number, target: number): Promise<void>;
    getCustomerPerformance(startDate: Date, endDate: Date): Promise<{ label: string, acquisition: number, retention: number }[]>;
    getRecentOrders(count: number): Promise<any[]>;
    getDemographics(): Promise<{ country: string, orderCount: number, percentage: number, code?: string }[]>;
    getStateDemographics(): Promise<{ state: string, orderCount: number, percentage: number, code?: string }[]>;
}
