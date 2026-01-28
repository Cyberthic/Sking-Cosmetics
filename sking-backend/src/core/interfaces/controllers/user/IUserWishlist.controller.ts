import { Request, Response, NextFunction } from "express";

export interface IUserWishlistController {
    getWishlist(req: Request, res: Response, next: NextFunction): Promise<void>;
    toggleWishlist(req: Request, res: Response, next: NextFunction): Promise<void>;
}
