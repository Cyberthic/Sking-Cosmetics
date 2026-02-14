import { AdminDashboardStatsDto } from "../../../dtos/admin/adminDashboard.dto";

export interface IAdminDashboardService {
    getDashboardStats(): Promise<AdminDashboardStatsDto>;
}
