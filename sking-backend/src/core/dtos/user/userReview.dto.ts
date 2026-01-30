export interface ICreateReviewDTO {
    productId: string;
    orderId: string;
    rating: number;
    comment: string;
    images?: string[];
}

export interface IReviewResponseDTO {
    id: string;
    user: {
        id: string;
        name: string;
        profileImage?: string;
    };
    rating: number;
    comment: string;
    images?: string[];
    isVerified: boolean;
    createdAt: Date;
}

export interface IReviewPaginationDTO {
    reviews: IReviewResponseDTO[];
    totalReviews: number;
    averageRating: number;
    ratingBreakdown: {
        [key: number]: number;
    };
    currentPage: number;
    totalPages: number;
}
