import axiosInstance from "@/lib/axios";

export type DashboardPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface CustomerStats {
    totalCustomers: number;
    growthPercentage: number;
    isGrowthPositive: boolean;
}

export interface OrderStats {
    totalOrders: number;
    growthPercentage: number;
    isGrowthPositive: boolean;
}

export interface SalesDataPoint {
    month: string;
    sales: number;
    orders: number;
}

export interface DashboardStats {
    customerStats: CustomerStats;
    orderStats: OrderStats;
    monthlySales: SalesDataPoint[];
}

export const adminDashboardApiService = {
    getDashboardStats: async (customerPeriod: DashboardPeriod = 'weekly', orderPeriod: DashboardPeriod = 'weekly'): Promise<DashboardStats> => {
        const response = await axiosInstance.get(`/api/admin/dashboard/stats?customerPeriod=${customerPeriod}&orderPeriod=${orderPeriod}`);
        return response.data.data;
    },
};
