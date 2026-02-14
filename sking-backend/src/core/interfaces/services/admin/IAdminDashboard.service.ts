import { AdminDashboardStatsDto } from "../../../dtos/admin/adminDashboard.dto";

export type DashboardPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface IAdminDashboardService {
    getDashboardStats(customerPeriod: DashboardPeriod, orderPeriod: DashboardPeriod): Promise<AdminDashboardStatsDto>;
    updateMonthlyTarget(target: number): Promise<void>;
}
