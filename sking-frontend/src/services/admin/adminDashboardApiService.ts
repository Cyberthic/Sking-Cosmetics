import axiosInstance from "@/lib/axios";

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
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await axiosInstance.get("/api/admin/dashboard/stats");
        return response.data.data;
    },
};
