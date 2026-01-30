import { Request, Response, NextFunction } from "express";

export interface IUserReviewController {
    createReview(req: Request, res: Response, next: NextFunction): Promise<void>;
    getProductReviews(req: Request, res: Response, next: NextFunction): Promise<void>;
    checkCanReview(req: Request, res: Response, next: NextFunction): Promise<void>;
}
