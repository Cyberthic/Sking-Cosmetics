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

export interface DemographicData {
    country: string;
    orderCount: number;
    percentage: number;
    code?: string;
}

export interface StateDemographic {
    state: string;
    orderCount: number;
    percentage: number;
    code?: string;
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
    demographics: DemographicData[];
    stateDemographics: StateDemographic[];
}

export const adminDashboardApiService = {
    async getDashboardStats(
        customerPeriod: DashboardPeriod = 'weekly',
        orderPeriod: DashboardPeriod = 'weekly',
        range?: { startDate: string; endDate: string }
    ): Promise<DashboardStats> {
        let url = `/api/admin/dashboard/stats?customerPeriod=${customerPeriod}&orderPeriod=${orderPeriod}`;
        if (range) {
            url += `&startDate=${range.startDate}&endDate=${range.endDate}`;
        }
        const response = await axiosInstance.get(url);
        return response.data.data;
    },

    async getSummaryStats(
        customerPeriod: DashboardPeriod = 'weekly',
        orderPeriod: DashboardPeriod = 'weekly'
    ): Promise<Pick<DashboardStats, 'customerStats' | 'orderStats'>> {
        const response = await axiosInstance.get(`/api/admin/dashboard/summary?customerPeriod=${customerPeriod}&orderPeriod=${orderPeriod}`);
        return response.data.data;
    },

    async getSalesChart(startDate?: string, endDate?: string): Promise<SalesDataPoint[]> {
        let url = `/api/admin/dashboard/sales-chart`;
        if (startDate && endDate) {
            url += `?startDate=${startDate}&endDate=${endDate}`;
        }
        const response = await axiosInstance.get(url);
        return response.data.data;
    },

    async getCustomerPerformance(startDate?: string, endDate?: string): Promise<PerformanceDataPoint[]> {
        let url = `/api/admin/dashboard/customer-performance`;
        if (startDate && endDate) {
            url += `?startDate=${startDate}&endDate=${endDate}`;
        }
        const response = await axiosInstance.get(url);
        return response.data.data;
    },

    async getRecentOrders(): Promise<RecentOrder[]> {
        const response = await axiosInstance.get(`/api/admin/dashboard/recent-orders`);
        return response.data.data;
    },

    async getDemographics(): Promise<{ demographics: DemographicData[], stateDemographics: StateDemographic[] }> {
        const response = await axiosInstance.get(`/api/admin/dashboard/demographics`);
        return response.data.data;
    },

    async getMonthlyTarget(): Promise<MonthlyTarget> {
        const response = await axiosInstance.get(`/api/admin/dashboard/monthly-target`);
        return response.data.data;
    },
    updateMonthlyTarget: async (target: number): Promise<void> => {
        await axiosInstance.put(`/api/admin/dashboard/target`, { target });
    },
};
