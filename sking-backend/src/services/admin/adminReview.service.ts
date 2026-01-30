import { injectable, inject } from "inversify";
import { IAdminReviewService } from "../../core/interfaces/services/admin/IAdminReview.service";
import { IAdminReviewRepository } from "../../core/interfaces/repositories/admin/IAdminReview.repository";
import { BlockReviewDto, FilterReviewDto, ReviewResponseDto } from "../../core/dtos/admin/adminReview.dto";
import { TYPES } from "../../core/types";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";

@injectable()
export class AdminReviewService implements IAdminReviewService {
    constructor(
        @inject(TYPES.IAdminReviewRepository)
        private _reviewRepository: IAdminReviewRepository
    ) { }

    async getAllReviews(filters: FilterReviewDto): Promise<ReviewResponseDto> {
        const { reviews, total } = await this._reviewRepository.findAll(filters);
        const limit = filters.limit || 10;

        return {
            success: true,
            reviews,
            total,
            page: filters.page || 1,
            totalPages: Math.ceil(total / limit)
        };
    }

    async getReviewById(id: string): Promise<any> {
        const review = await this._reviewRepository.findById(id);
        if (!review) throw new CustomError("Review not found", StatusCode.NOT_FOUND);
        return { success: true, review };
    }

    async blockReview(data: BlockReviewDto): Promise<any> {
        const { reviewId, duration, reason } = data;

        let blockedUntil: Date | undefined;
        const now = new Date();

        if (duration === 'day') {
            blockedUntil = new Date(now.setDate(now.getDate() + 1));
        } else if (duration === 'week') {
            blockedUntil = new Date(now.setDate(now.getDate() + 7));
        } else if (duration === 'month') {
            blockedUntil = new Date(now.setMonth(now.getMonth() + 1));
        } else if (duration === 'permanent') {
            blockedUntil = undefined;
        }

        const updatedReview = await this._reviewRepository.update(reviewId, {
            isBlocked: true,
            blockedUntil,
            blockReason: reason
        });

        if (!updatedReview) throw new CustomError("Review not found", StatusCode.NOT_FOUND);

        return { success: true, message: `Review blocked ${duration}`, review: updatedReview };
    }

    async unblockReview(reviewId: string): Promise<any> {
        const updatedReview = await this._reviewRepository.update(reviewId, {
            isBlocked: false,
            blockedUntil: undefined,
            blockReason: undefined
        });

        if (!updatedReview) throw new CustomError("Review not found", StatusCode.NOT_FOUND);

        return { success: true, message: "Review unblocked successfully", review: updatedReview };
    }

    async deleteReview(id: string): Promise<any> {
        const success = await this._reviewRepository.delete(id);
        if (!success) throw new CustomError("Review not found", StatusCode.NOT_FOUND);
        return { success: true, message: "Review deleted successfully" };
    }

    async getReviewsByProduct(productId: string, filters: FilterReviewDto): Promise<ReviewResponseDto> {
        const { reviews, total } = await this._reviewRepository.findByProductId(productId, filters);
        const limit = filters.limit || 10;

        return {
            success: true,
            reviews,
            total,
            page: filters.page || 1,
            totalPages: Math.ceil(total / limit)
        };
    }

    async getReviewsByUser(userId: string, filters: FilterReviewDto): Promise<ReviewResponseDto> {
        const { reviews, total } = await this._reviewRepository.findByUserId(userId, filters);
        const limit = filters.limit || 10;

        return {
            success: true,
            reviews,
            total,
            page: filters.page || 1,
            totalPages: Math.ceil(total / limit)
        };
    }

    async togglePin(reviewId: string): Promise<any> {
        const review = await this._reviewRepository.findById(reviewId);
        if (!review) throw new CustomError("Review not found", StatusCode.NOT_FOUND);

        const updatedReview = await this._reviewRepository.update(reviewId, {
            isPinned: !review.isPinned
        });

        return { success: true, message: `Review ${updatedReview?.isPinned ? 'pinned' : 'unpinned'} successfully`, review: updatedReview };
    }

    async createReview(data: any): Promise<any> {
        // Remove userId if it's empty strings to prevent CastError
        if (!data.userId || data.userId === "") {
            delete data.userId;
        }

        const review = await this._reviewRepository.create({
            ...data,
            isAdminReview: !data.userId, // True only if no user is assigned
            isVerified: true,
            user: data.userId // Pass userId if it exists
        });
        return { success: true, message: "Review created successfully", review };
    }
}
