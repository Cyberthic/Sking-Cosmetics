import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { IUserCheckoutController } from "../../core/interfaces/controllers/user/IUserCheckout.controller";
import { IUserCheckoutService } from "../../core/interfaces/services/user/IUserCheckout.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";

@injectable()
export class UserCheckoutController implements IUserCheckoutController {
    constructor(
        @inject(TYPES.IUserCheckoutService) private _checkoutService: IUserCheckoutService
    ) { }

    placeOrder = async (req: Request, res: Response): Promise<void> => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const order = await this._checkoutService.placeOrder(userId, req.body);
            res.status(StatusCode.CREATED).json({
                success: true,
                data: order,
                message: "Order placed successfully"
            });
        } catch (error: any) {
            logger.error("Place Order Error", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: error.message || "Failed to place order" });
        }
    }
}
