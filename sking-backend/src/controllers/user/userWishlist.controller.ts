import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IWishlistService } from "../../core/interfaces/services/user/IWishlist.service";
import { StatusCode } from "../../enums/statusCode.enums";
import { AuthRequest } from "../../middlewares/auth.middleware";

import { IUserWishlistController } from "../../core/interfaces/controllers/user/IUserWishlist.controller";

@injectable()
export class UserWishlistController implements IUserWishlistController {
    constructor(
        @inject(TYPES.IWishlistService) private _wishlistService: IWishlistService
    ) { }

    async getWishlist(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const wishlist = await this._wishlistService.getWishlist(userId);
            res.status(StatusCode.OK).json({ success: true, wishlist });
        } catch (error) {
            next(error);
        }
    }

    async toggleWishlist(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const { productId } = req.body;
            const wishlist = await this._wishlistService.toggleWishlist(userId, productId);
            res.status(StatusCode.OK).json({ success: true, wishlist });
        } catch (error) {
            next(error);
        }
    }

    async mergeWishlist(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const { productIds } = req.body;
            const wishlist = await this._wishlistService.mergeWishlist(userId, productIds);
            res.status(StatusCode.OK).json({ success: true, wishlist });
        } catch (error) {
            next(error);
        }
    }
}
