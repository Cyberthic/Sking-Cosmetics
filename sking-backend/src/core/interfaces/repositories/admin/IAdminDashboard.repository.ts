export interface IAdminDashboardRepository {
    getCustomerCount(startDate?: Date, endDate?: Date): Promise<number>;
    getOrderCount(startDate?: Date, endDate?: Date): Promise<number>;
    getMonthlySales(year: number): Promise<{ month: number; totalSales: number }[]>;
}
