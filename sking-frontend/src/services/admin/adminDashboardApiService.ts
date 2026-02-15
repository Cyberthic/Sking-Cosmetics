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

export interface PerformanceDataPoint {
    month: string;
    acquisition: number;
    retention: number;
}

export interface RecentOrder {
    _id: string;
    displayId: string;
    customerName: string;
    amount: number;
    status: string;
    date: string;
    itemsCount: number;
    productImage: string;
}

export interface MonthlyTarget {
    target: number;
    revenue: number;
    todayRevenue: number;
    progressPercentage: number;
    growthFromLastMonth: number;
}

export interface DashboardStats {
    customerStats: CustomerStats;
    orderStats: OrderStats;
    monthlySales: SalesDataPoint[];
    monthlyTarget: MonthlyTarget;
    customerPerformance: PerformanceDataPoint[];
    recentOrders: RecentOrder[];
}

export const adminDashboardApiService = {
    getDashboardStats: async (
        customerPeriod: DashboardPeriod = 'weekly',
        orderPeriod: DashboardPeriod = 'weekly',
        range?: { startDate: string; endDate: string }
    ): Promise<DashboardStats> => {
        let url = `/api/admin/dashboard/stats?customerPeriod=${customerPeriod}&orderPeriod=${orderPeriod}`;
        if (range) {
            url += `&startDate=${range.startDate}&endDate=${range.endDate}`;
        }
        const response = await axiosInstance.get(url);
        return response.data.data;
    },
    updateMonthlyTarget: async (target: number): Promise<void> => {
        await axiosInstance.put(`/api/admin/dashboard/target`, { target });
    },
};
