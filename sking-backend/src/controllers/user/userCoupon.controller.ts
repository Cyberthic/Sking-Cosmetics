import { Request, Response, NextFunction } from "express";
import { IUserCouponController } from "../../core/interfaces/controllers/user/IUserCoupon.controller";
import { IUserCouponService } from "../../core/interfaces/services/user/IUserCoupon.service";
import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { StatusCode } from "../../enums/statusCode.enums";

@injectable()
export class UserCouponController implements IUserCouponController {
    constructor(@inject(TYPES.IUserCouponService) private userCouponService: IUserCouponService) { }

    getMyCoupons = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const coupons = await this.userCouponService.getMyCoupons(userId);

            res.status(StatusCode.OK).json({
                success: true,
                data: coupons
            });
        } catch (error) {
            next(error);
        }
    };

    applyCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const { code, cartTotal, cartItems } = req.body;

            if (!code || !cartTotal) {
                // @ts-ignore
                res.status(StatusCode.BAD_REQUEST).json({ success: false, message: "Missing required fields" });
                return;
            }

            const result = await this.userCouponService.applyCoupon(userId, code, cartTotal, cartItems || []);

            res.status(StatusCode.OK).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    };
}
