import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { IAdminReviewController } from "../../core/interfaces/controllers/admin/IAdminReview.controller";
import { IAdminReviewService } from "../../core/interfaces/services/admin/IAdminReview.service";
import { TYPES } from "../../core/types";
import { FilterReviewDto } from "../../core/dtos/admin/adminReview.dto";

@injectable()
export class AdminReviewController implements IAdminReviewController {
    constructor(
        @inject(TYPES.IAdminReviewService)
        private _reviewService: IAdminReviewService
    ) { }

    async getAllReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filters: FilterReviewDto = {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                search: req.query.search as string,
                sortBy: req.query.sortBy as string,
                sortOrder: req.query.sortOrder as 'asc' | 'desc',
                status: req.query.status as 'active' | 'blocked' | 'all'
            };
            const result = await this._reviewService.getAllReviews(filters);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getReviewById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this._reviewService.getReviewById(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async blockReview(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this._reviewService.blockReview(req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async unblockReview(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this._reviewService.unblockReview(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteReview(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this._reviewService.deleteReview(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getReviewsByProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filters: FilterReviewDto = {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                search: req.query.search as string,
                status: req.query.status as 'active' | 'blocked' | 'all',
                sortBy: (req.query.sortBy as string) || 'createdAt',
                sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
            };
            const result = await this._reviewService.getReviewsByProduct(req.params.productId, filters);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getReviewsByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filters: FilterReviewDto = {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                search: req.query.search as string,
                status: req.query.status as 'active' | 'blocked' | 'all',
                sortBy: (req.query.sortBy as string) || 'createdAt',
                sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
            };
            const result = await this._reviewService.getReviewsByUser(req.params.userId, filters);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async togglePin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this._reviewService.togglePin(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this._reviewService.createReview(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }
}
