import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { IUserReviewController } from "../../core/interfaces/controllers/user/IUserReview.controller";
import { IUserReviewService } from "../../core/interfaces/services/user/IUserReview.service";
import { TYPES } from "../../core/types";

@injectable()
export class UserReviewController implements IUserReviewController {
    constructor(
        @inject(TYPES.IUserReviewService) private _reviewService: IUserReviewService
    ) { }

    async createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user.id;
            await this._reviewService.createReview(userId, req.body);
            res.status(201).json({
                success: true,
                message: "Review submitted successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    async getProductReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { productId } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 4;
            const sort = (req.query.sort as string) || "newest";

            const result = await this._reviewService.getProductReviews(productId, page, limit, sort);
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    async checkCanReview(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = (req as any).user.id;
            const { productId, orderId } = req.query;
            const result = await this._reviewService.getCanUserReview(userId, productId as string, orderId as string);
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
