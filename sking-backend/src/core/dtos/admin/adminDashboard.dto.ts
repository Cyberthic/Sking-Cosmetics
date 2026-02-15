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

export interface RecentOrderDto {
    _id: string;
    displayId: string;
    customerName: string;
    amount: number;
    status: string;
    date: string;
    itemsCount: number;
    productImage: string;
}

export interface DemographicDataDto {
    country: string;
    orderCount: number;
    percentage: number;
    code?: string; // ISO code for map
}

export interface StateDemographicDto {
    state: string;
    orderCount: number;
    percentage: number;
    code?: string; // JVectorMap code for states
}

export interface AdminDashboardStatsDto {
    customerStats: CustomerStatsDto;
    orderStats: OrderStatsDto;
    monthlySales: SalesDataPointDto[];
    monthlyTarget: MonthlyTargetDto;
    customerPerformance: PerformanceDataPointDto[];
    recentOrders: RecentOrderDto[];
    demographics: DemographicDataDto[];
    stateDemographics: StateDemographicDto[];
}
