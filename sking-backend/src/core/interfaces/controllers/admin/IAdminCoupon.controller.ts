import { Request, Response } from "express";

export interface IAdminCouponController {
    createCoupon(req: Request, res: Response): Promise<Response>;
    getCoupons(req: Request, res: Response): Promise<Response>;
    getCouponById(req: Request, res: Response): Promise<Response>;
    updateCoupon(req: Request, res: Response): Promise<Response>;
    deleteCoupon(req: Request, res: Response): Promise<Response>;
    getCouponOrders(req: Request, res: Response): Promise<Response>;
    getCouponStats(req: Request, res: Response): Promise<Response>;
}
