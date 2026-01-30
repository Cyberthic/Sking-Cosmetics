import { FilterReviewDto } from "../../../dtos/admin/adminReview.dto";
import { IReview } from "../../../../models/review.model";

export interface IAdminReviewRepository {
    findAll(filters: FilterReviewDto): Promise<{ reviews: IReview[], total: number }>;
    findById(id: string): Promise<IReview | null>;
    update(id: string, data: Partial<IReview>): Promise<IReview | null>;
    delete(id: string): Promise<boolean>;
    create(data: Partial<IReview>): Promise<IReview>;
    findByProductId(productId: string, filters: FilterReviewDto): Promise<{ reviews: IReview[], total: number }>;
    findByUserId(userId: string, filters: FilterReviewDto): Promise<{ reviews: IReview[], total: number }>;
}
