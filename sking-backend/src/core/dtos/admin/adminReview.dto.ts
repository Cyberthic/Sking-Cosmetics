export interface FilterReviewDto {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: 'active' | 'blocked' | 'all';
    productId?: string;
    userId?: string;
}

export interface BlockReviewDto {
    reviewId: string;
    duration?: 'day' | 'week' | 'month' | 'permanent';
    reason?: string;
}

export interface ReviewResponseDto {
    success: boolean;
    reviews: any[];
    total: number;
    page: number;
    totalPages: number;
}
