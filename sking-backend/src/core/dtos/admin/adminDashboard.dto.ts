export interface CustomerStatsDto {
    totalCustomers: number;
    growthPercentage: number;
    isGrowthPositive: boolean;
}

export interface AdminDashboardStatsDto {
    customerStats: CustomerStatsDto;
    // We can add more stats here later like orderStats, salesStats etc.
}
