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

export interface AdminDashboardStatsDto {
    customerStats: CustomerStatsDto;
    orderStats: OrderStatsDto;
}
