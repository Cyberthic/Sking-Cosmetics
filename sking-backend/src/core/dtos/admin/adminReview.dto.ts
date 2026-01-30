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

export interface CreateAdminReviewDto {
    productId: string;
    userId?: string; // If null, maybe use admin's or a system user
    rating: number;
    comment: string;
    images?: string[];
    isPinned?: boolean;
}
