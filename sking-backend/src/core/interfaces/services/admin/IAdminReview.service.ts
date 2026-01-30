import { BlockReviewDto, FilterReviewDto, ReviewResponseDto } from "../../../dtos/admin/adminReview.dto";

export interface IAdminReviewService {
    getAllReviews(filters: FilterReviewDto): Promise<ReviewResponseDto>;
    getReviewById(id: string): Promise<any>;
    blockReview(data: BlockReviewDto): Promise<any>;
    unblockReview(reviewId: string): Promise<any>;
    deleteReview(id: string): Promise<any>;
    getReviewsByProduct(productId: string, filters: FilterReviewDto): Promise<ReviewResponseDto>;
    getReviewsByUser(userId: string, filters: FilterReviewDto): Promise<ReviewResponseDto>;
}
