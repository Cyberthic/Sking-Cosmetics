export interface IAdminDashboardRepository {
    getCustomerCount(startDate?: Date, endDate?: Date): Promise<number>;
}
