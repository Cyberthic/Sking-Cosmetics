import { Request, Response, NextFunction } from "express";

export interface IUserCouponController {
    getMyCoupons(req: Request, res: Response, next: NextFunction): Promise<void>;
    applyCoupon(req: Request, res: Response, next: NextFunction): Promise<void>;
}
