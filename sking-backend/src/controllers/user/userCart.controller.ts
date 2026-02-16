import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { ICartService } from "../../core/interfaces/services/user/ICart.service";
import { StatusCode } from "../../enums/statusCode.enums";
import { AuthRequest } from "../../middlewares/auth.middleware";

@injectable()
export class UserCartController {
    constructor(
        @inject(TYPES.ICartService) private _cartService: ICartService
    ) { }

    async getCart(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const cart = await this._cartService.getCart(userId);
            res.status(StatusCode.OK).json({ success: true, cart });
        } catch (error) {
            next(error);
        }
    }

    async addToCart(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            let { productId, variantName, quantity } = req.body;

            console.log("addToCart Request Body:", req.body);

            // Ensure quantity is a number
            quantity = Number(quantity);
            if (isNaN(quantity) || quantity < 1) quantity = 1;

            const cart = await this._cartService.addToCart(userId, productId, variantName, quantity);
            res.status(StatusCode.OK).json({ success: true, cart });
        } catch (error) {
            console.error("addToCart Error:", error);
            next(error);
        }
    }

    async removeFromCart(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const { productId, variantName } = req.body;
            const cart = await this._cartService.removeFromCart(userId, productId, variantName);
            res.status(StatusCode.OK).json({ success: true, cart });
        } catch (error) {
            next(error);
        }
    }

    async updateQuantity(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const { productId, variantName, quantity } = req.body;
            const cart = await this._cartService.updateQuantity(userId, productId, variantName, quantity);
            res.status(StatusCode.OK).json({ success: true, cart });
        } catch (error) {
            next(error);
        }
    }

    async mergeCart(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user.id;
            const { items } = req.body;
            const cart = await this._cartService.mergeCart(userId, items);
            res.status(StatusCode.OK).json({ success: true, cart });
        } catch (error) {
            next(error);
        }
    }
}
