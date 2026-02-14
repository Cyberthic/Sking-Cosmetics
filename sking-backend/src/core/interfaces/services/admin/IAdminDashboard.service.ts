import { AdminDashboardStatsDto } from "../../../dtos/admin/adminDashboard.dto";

export type DashboardPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface IAdminDashboardService {
    getDashboardStats(period: DashboardPeriod): Promise<AdminDashboardStatsDto>;
}
