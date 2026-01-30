import { Request, Response, NextFunction } from "express";

export interface IAdminReviewController {
    getAllReviews(req: Request, res: Response, next: NextFunction): Promise<void>;
    getReviewById(req: Request, res: Response, next: NextFunction): Promise<void>;
    blockReview(req: Request, res: Response, next: NextFunction): Promise<void>;
    unblockReview(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteReview(req: Request, res: Response, next: NextFunction): Promise<void>;
    getReviewsByProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    getReviewsByUser(req: Request, res: Response, next: NextFunction): Promise<void>;
    togglePin(req: Request, res: Response, next: NextFunction): Promise<void>;
    createReview(req: Request, res: Response, next: NextFunction): Promise<void>;
}
