import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminOrderController } from "../../core/interfaces/controllers/admin/IAdminOrder.controller";
import { IAdminOrderService } from "../../core/interfaces/services/admin/IAdminOrder.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";

@injectable()
export class AdminOrderController implements IAdminOrderController {
    constructor(
        @inject(TYPES.IAdminOrderService) private _orderService: IAdminOrderService
    ) { }

    getOrders = async (req: Request, res: Response): Promise<Response> => {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const page = parseInt(req.query.page as string) || 1;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const sort = req.query.sort as string;

            const result = await this._orderService.getOrders(limit, page, search, status, sort);
            return res.status(StatusCode.OK).json({
                success: true,
                ...result
            });
        } catch (error: any) {
            logger.error("Error fetching orders:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    };

    getOrderById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const order = await this._orderService.getOrderById(id);
            return res.status(StatusCode.OK).json({
                success: true,
                order
            });
        } catch (error: any) {
            logger.error("Error fetching order by ID:", error);
            const status = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                success: false,
                message: error.message
            });
        }
    };

    updateOrderStatus = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const { status, isCritical } = req.body;

            if (!status) {
                return res.status(StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Status is required"
                });
            }

            const order = await this._orderService.updateOrderStatus(id, status, isCritical);
            return res.status(StatusCode.OK).json({
                success: true,
                message: "Order status updated successfully",
                order
            });
        } catch (error: any) {
            logger.error("Error updating order status:", error);
            const status = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                success: false,
                message: error.message
            });
        }
    };
}
