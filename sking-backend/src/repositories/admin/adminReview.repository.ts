import { injectable } from "inversify";
import { IAdminReviewRepository } from "../../core/interfaces/repositories/admin/IAdminReview.repository";
import { FilterReviewDto } from "../../core/dtos/admin/adminReview.dto";
import Review, { IReview } from "../../models/review.model";

@injectable()
export class AdminReviewRepository implements IAdminReviewRepository {
    async findAll(filters: FilterReviewDto): Promise<{ reviews: IReview[], total: number }> {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', status, productId, userId } = filters;
        const query: any = {};

        if (status === 'blocked') {
            query.isBlocked = true;
        } else if (status === 'active') {
            query.isBlocked = false;
        }

        if (productId) {
            query.product = productId;
        }

        if (userId) {
            query.user = userId;
        }

        if (search) {
            // Search in comment or potentially populated fields if needed, 
            // but for simplicity let's stick to comment for now or use aggregate
            query.comment = { $regex: search, $options: 'i' };
        }

        const total = await Review.countDocuments(query);
        const reviews = await Review.find(query)
            .populate('user', 'username email profilePicture')
            .populate('product', 'name images slug')
            .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return { reviews, total };
    }

    async findById(id: string): Promise<IReview | null> {
        return await Review.findById(id)
            .populate('user', 'username email profilePicture')
            .populate('product', 'name images slug')
            .populate('order', 'orderId createdAt');
    }

    async update(id: string, data: Partial<IReview>): Promise<IReview | null> {
        return await Review.findByIdAndUpdate(id, data, { new: true })
            .populate('user', 'username email profilePicture')
            .populate('product', 'name images slug');
    }

    async delete(id: string): Promise<boolean> {
        const result = await Review.findByIdAndDelete(id);
        return !!result;
    }

    async findByProductId(productId: string, filters: FilterReviewDto): Promise<{ reviews: IReview[], total: number }> {
        return this.findAll({ ...filters, productId });
    }

    async findByUserId(userId: string, filters: FilterReviewDto): Promise<{ reviews: IReview[], total: number }> {
        return this.findAll({ ...filters, userId });
    }
}
