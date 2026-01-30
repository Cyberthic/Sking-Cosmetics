import { ICreateReviewDTO, IReviewPaginationDTO } from "../../../dtos/user/userReview.dto";

export interface IUserReviewService {
    createReview(userId: string, data: ICreateReviewDTO): Promise<void>;
    getProductReviews(productId: string, page: number, limit: number, sort: string): Promise<IReviewPaginationDTO>;
    getCanUserReview(userId: string, productId: string, orderId?: string): Promise<{ canReview: boolean; orderId?: string }>;
}
