import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminCouponController } from "../../core/interfaces/controllers/admin/IAdminCoupon.controller";
import { IAdminCouponService } from "../../core/interfaces/services/admin/IAdminCoupon.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";

@injectable()
export class AdminCouponController implements IAdminCouponController {
    constructor(
        @inject(TYPES.IAdminCouponService) private _couponService: IAdminCouponService
    ) { }

    createCoupon = async (req: Request, res: Response): Promise<Response> => {
        try {
            const coupon = await this._couponService.createCoupon(req.body);
            return res.status(StatusCode.CREATED).json({
                success: true,
                message: "Coupon created successfully",
                coupon
            });
        } catch (error: any) {
            logger.error("Error creating coupon:", error);
            const status = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                success: false,
                message: error.message
            });
        }
    };

    getCoupons = async (req: Request, res: Response): Promise<Response> => {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const page = parseInt(req.query.page as string) || 1;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const sort = req.query.sort as string;

            const result = await this._couponService.getCoupons(limit, page, search, status, sort);
            return res.status(StatusCode.OK).json({
                success: true,
                ...result
            });
        } catch (error: any) {
            logger.error("Error fetching coupons:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    };

    getCouponById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const coupon = await this._couponService.getCouponById(id);
            return res.status(StatusCode.OK).json({
                success: true,
                coupon
            });
        } catch (error: any) {
            logger.error("Error fetching coupon by ID:", error);
            const status = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                success: false,
                message: error.message
            });
        }
    };

    updateCoupon = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const coupon = await this._couponService.updateCoupon(id, req.body);
            return res.status(StatusCode.OK).json({
                success: true,
                message: "Coupon updated successfully",
                coupon
            });
        } catch (error: any) {
            logger.error("Error updating coupon:", error);
            const status = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                success: false,
                message: error.message
            });
        }
    };

    deleteCoupon = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            await this._couponService.deleteCoupon(id);
            return res.status(StatusCode.OK).json({
                success: true,
                message: "Coupon deleted successfully"
            });
        } catch (error: any) {
            logger.error("Error deleting coupon:", error);
            const status = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                success: false,
                message: error.message
            });
        }
    };

    getCouponOrders = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const limit = parseInt(req.query.limit as string) || 10;
            const page = parseInt(req.query.page as string) || 1;
            const result = await this._couponService.getCouponOrders(id, page, limit);
            return res.status(StatusCode.OK).json({
                success: true,
                ...result
            });
        } catch (error: any) {
            logger.error("Error fetching coupon orders:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    };

    getCouponStats = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const stats = await this._couponService.getCouponStats(id);
            return res.status(StatusCode.OK).json({
                success: true,
                stats
            });
        } catch (error: any) {
            logger.error("Error fetching coupon stats:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    };
}
