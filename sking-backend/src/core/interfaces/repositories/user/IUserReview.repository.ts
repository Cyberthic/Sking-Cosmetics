import { IReview } from "../../../../models/review.model";
import { IReviewPaginationDTO } from "../../../dtos/user/userReview.dto";

export interface IUserReviewRepository {
    create(data: Partial<IReview>): Promise<IReview>;
    findByProduct(productId: string, page: number, limit: number, sort: string): Promise<IReviewPaginationDTO>;
    findByUserAndProduct(userId: string, productId: string, orderId: string): Promise<IReview | null>;
    checkIfDelivered(userId: string, productId: string, orderId: string): Promise<boolean>;
    findEligibleOrder(userId: string, productId: string): Promise<string | null>;
    getProductRatingStats(productId: string): Promise<{ averageRating: number; reviewsCount: number }>;
}
