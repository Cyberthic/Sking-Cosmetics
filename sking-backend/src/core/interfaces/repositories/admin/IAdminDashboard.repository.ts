export interface IAdminDashboardRepository {
    getCustomerCount(startDate?: Date, endDate?: Date): Promise<number>;
    getOrderCount(startDate?: Date, endDate?: Date): Promise<number>;
    getMonthlySales(year: number): Promise<{ month: number; totalSales: number; orderCount: number }[]>;
    getMonthlyRevenue(startDate: Date, endDate: Date): Promise<number>;
    getMonthlyTarget(month: number, year: number): Promise<number>;
    updateMonthlyTarget(month: number, year: number, target: number): Promise<void>;
}
