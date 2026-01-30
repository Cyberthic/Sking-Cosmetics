import { injectable } from "inversify";
import Review, { IReview } from "../../models/review.model";
import Order from "../../models/order.model";
import { ProductModel } from "../../models/product.model";
import { IUserReviewRepository } from "../../core/interfaces/repositories/user/IUserReview.repository";
import { IReviewPaginationDTO } from "../../core/dtos/user/userReview.dto";
import mongoose from "mongoose";

@injectable()
export class UserReviewRepository implements IUserReviewRepository {
    async create(data: Partial<IReview>): Promise<IReview> {
        const review = new Review(data);
        return await review.save();
    }

    async findByProduct(productId: string, page: number, limit: number, sort: string): Promise<IReviewPaginationDTO> {
        const skip = (page - 1) * limit;
        let sortQuery: any = {};

        if (sort === "oldest") sortQuery = { isPinned: -1, createdAt: 1 };
        else if (sort === "rating_high") sortQuery = { isPinned: -1, rating: -1 };
        else if (sort === "rating_low") sortQuery = { isPinned: -1, rating: 1 };
        else sortQuery = { isPinned: -1, createdAt: -1 };

        const reviews = await Review.find({
            product: new mongoose.Types.ObjectId(productId),
            isBlocked: { $ne: true }
        })
            .populate("user", "name profileImage")
            .sort(sortQuery)
            .skip(skip)
            .limit(limit);

        const totalReviews = await Review.countDocuments({
            product: new mongoose.Types.ObjectId(productId),
            isBlocked: { $ne: true }
        });

        // Calculate stats
        const stats = await Review.aggregate([
            {
                $match: {
                    product: new mongoose.Types.ObjectId(productId),
                    isBlocked: { $ne: true }
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    ratingBreakdown: {
                        $push: "$rating"
                    }
                }
            }
        ]);

        const ratingBreakdown: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let averageRating = 0;

        if (stats.length > 0) {
            averageRating = parseFloat(stats[0].averageRating.toFixed(1));
            stats[0].ratingBreakdown.forEach((r: number) => {
                ratingBreakdown[r] = (ratingBreakdown[r] || 0) + 1;
            });
        }

        return {
            reviews: reviews.map(r => ({
                id: r._id.toString(),
                user: r.user ? {
                    id: (r.user as any)._id.toString(),
                    name: (r.user as any).name,
                    profileImage: (r.user as any).profileImage
                } : {
                    id: 'admin',
                    name: 'Sking Cosmetics Team',
                    profileImage: '/images/logo/logo-icon.png' // Or generic admin avatar
                },
                rating: r.rating,
                comment: r.comment,
                images: r.images,
                isVerified: r.isVerified,
                isPinned: r.isPinned,
                isAdminReview: r.isAdminReview,
                createdAt: r.createdAt
            })),
            totalReviews,
            averageRating,
            ratingBreakdown,
            currentPage: page,
            totalPages: Math.ceil(totalReviews / limit)
        };
    }

    async findByUserAndProduct(userId: string, productId: string, orderId: string): Promise<IReview | null> {
        return await Review.findOne({
            user: new mongoose.Types.ObjectId(userId),
            product: new mongoose.Types.ObjectId(productId),
            order: new mongoose.Types.ObjectId(orderId)
        });
    }

    async checkIfDelivered(userId: string, productId: string, orderId: string): Promise<boolean> {
        const order = await Order.findOne({
            _id: new mongoose.Types.ObjectId(orderId),
            user: new mongoose.Types.ObjectId(userId),
            "items.product": new mongoose.Types.ObjectId(productId),
            orderStatus: "delivered"
        });
        return !!order;
    }

    async findEligibleOrder(userId: string, productId: string): Promise<string | null> {
        // 1. Find all delivered orders for this user containing this product
        const orders = await Order.find({
            user: new mongoose.Types.ObjectId(userId),
            "items.product": new mongoose.Types.ObjectId(productId),
            orderStatus: "delivered"
        }).sort({ createdAt: -1 });

        if (orders.length === 0) return null;

        // 2. For each order, check if a review already exists
        for (const order of orders) {
            const existingReview = await Review.findOne({
                user: new mongoose.Types.ObjectId(userId),
                product: new mongoose.Types.ObjectId(productId),
                order: order._id
            });
            if (!existingReview) {
                return order._id.toString();
            }
        }

        return null;
    }

    async getProductRatingStats(productId: string): Promise<{ averageRating: number; reviewsCount: number }> {
        const stats = await Review.aggregate([
            {
                $match: {
                    product: new mongoose.Types.ObjectId(productId),
                    isBlocked: { $ne: true }
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    reviewsCount: { $sum: 1 }
                }
            }
        ]);

        if (stats.length > 0) {
            return {
                averageRating: parseFloat(stats[0].averageRating.toFixed(1)),
                reviewsCount: stats[0].reviewsCount
            };
        }

        return { averageRating: 0, reviewsCount: 0 };
    }
}
