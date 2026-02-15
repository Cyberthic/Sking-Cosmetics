export interface CustomerStatsDto {
    totalCustomers: number;
    growthPercentage: number;
    isGrowthPositive: boolean;
}

export interface OrderStatsDto {
    totalOrders: number;
    growthPercentage: number;
    isGrowthPositive: boolean;
}

export interface SalesDataPointDto {
    month: string;
    sales: number;
    orders: number;
}

export interface PerformanceDataPointDto {
    month: string;
    acquisition: number; // New customers/orders
    retention: number;   // Returning customers/orders
}

export interface MonthlyTargetDto {
    target: number;
    revenue: number;
    todayRevenue: number;
    progressPercentage: number;
    growthFromLastMonth: number;
}

export interface AdminDashboardStatsDto {
    customerStats: CustomerStatsDto;
    orderStats: OrderStatsDto;
    monthlySales: SalesDataPointDto[];
    monthlyTarget: MonthlyTargetDto;
    customerPerformance: PerformanceDataPointDto[];
}
