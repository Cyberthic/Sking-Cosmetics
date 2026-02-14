import axiosInstance from "@/lib/axios";

export type DashboardPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface CustomerStats {
    totalCustomers: number;
    growthPercentage: number;
    isGrowthPositive: boolean;
}

export interface DashboardStats {
    customerStats: CustomerStats;
    // future stats
}

export const adminDashboardApiService = {
    getDashboardStats: async (period: DashboardPeriod = 'weekly'): Promise<DashboardStats> => {
        const response = await axiosInstance.get(`/api/admin/dashboard/stats?period=${period}`);
        return response.data.data;
    },
};
