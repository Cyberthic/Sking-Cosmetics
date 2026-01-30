import { inject, injectable } from "inversify";
import { IUserReviewService } from "../../core/interfaces/services/user/IUserReview.service";
import { IUserReviewRepository } from "../../core/interfaces/repositories/user/IUserReview.repository";
import { IUserProductRepository } from "../../core/interfaces/repositories/user/IUserProduct.repository";
import { TYPES } from "../../core/types";
import { ICreateReviewDTO, IReviewPaginationDTO } from "../../core/dtos/user/userReview.dto";
import { CustomError } from "../../utils/customError";
import { ProductModel } from "../../models/product.model";

@injectable()
export class UserReviewService implements IUserReviewService {
    constructor(
        @inject(TYPES.IUserReviewRepository) private _reviewRepository: IUserReviewRepository,
        @inject(TYPES.IUserProductRepository) private _productRepository: IUserProductRepository
    ) { }

    private async resolveProductId(productIdOrSlug: string): Promise<string> {
        if (productIdOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
            return productIdOrSlug;
        }
        const product = await this._productRepository.findBySlugActive(productIdOrSlug);
        if (!product) {
            throw new CustomError("Product not found", 404);
        }
        return (product as any)._id.toString();
    }

    async createReview(userId: string, data: ICreateReviewDTO): Promise<void> {
        // 1. Check if product delivered
        const isDelivered = await this._reviewRepository.checkIfDelivered(userId, data.productId, data.orderId);
        if (!isDelivered) {
            throw new CustomError("You can only review products that have been delivered to you.", 400);
        }

        // 2. Check if already reviewed for this order
        const existingReview = await this._reviewRepository.findByUserAndProduct(userId, data.productId, data.orderId);
        if (existingReview) {
            throw new CustomError("You have already reviewed this product for this order.", 400);
        }

        // 3. Create review
        await this._reviewRepository.create({
            user: userId as any,
            product: data.productId as any,
            order: data.orderId as any,
            rating: data.rating,
            comment: data.comment,
            images: data.images,
            isVerified: true
        });

        // 4. Update product rating stats (Review count is enough for now, but we could update average rating too in Product model if needed)
        const stats = await this._reviewRepository.getProductRatingStats(data.productId);
        await ProductModel.findByIdAndUpdate(data.productId, {
            reviewsCount: stats.reviewsCount
        });
    }

    async getProductReviews(productIdOrSlug: string, page: number, limit: number, sort: string): Promise<IReviewPaginationDTO> {
        const productId = await this.resolveProductId(productIdOrSlug);
        return await this._reviewRepository.findByProduct(productId, page, limit, sort);
    }

    async getCanUserReview(userId: string, productIdOrSlug: string, orderId?: string): Promise<{ canReview: boolean; orderId?: string }> {
        const productId = await this.resolveProductId(productIdOrSlug);

        if (orderId) {
            const isDelivered = await this._reviewRepository.checkIfDelivered(userId, productId, orderId);
            if (!isDelivered) return { canReview: false };

            const existingReview = await this._reviewRepository.findByUserAndProduct(userId, productId, orderId);
            return { canReview: !existingReview, orderId: !existingReview ? orderId : undefined };
        } else {
            const eligibleOrderId = await this._reviewRepository.findEligibleOrder(userId, productId);
            return {
                canReview: !!eligibleOrderId,
                orderId: eligibleOrderId || undefined
            };
        }
    }
}
