import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { IUserOrderController } from "../../core/interfaces/controllers/user/IUserOrder.controller";
import { IUserOrderService } from "../../core/interfaces/services/user/IUserOrder.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";

@injectable()
export class UserOrderController implements IUserOrderController {
    constructor(
        @inject(TYPES.IUserOrderService) private _orderService: IUserOrderService
    ) { }

    getUserOrders = async (req: Request, res: Response): Promise<void> => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const orders = await this._orderService.getUserOrders(userId);
            res.status(StatusCode.OK).json({
                success: true,
                data: orders
            });
        } catch (error: any) {
            logger.error("Get User Orders Error", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: error.message || "Failed to fetch orders" });
        }
    }

    getOrderDetail = async (req: Request, res: Response): Promise<void> => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const orderId = req.params.orderId;
            const order = await this._orderService.getOrderDetail(orderId, userId);
            res.status(StatusCode.OK).json({
                success: true,
                data: order
            });
        } catch (error: any) {
            logger.error("Get Order Detail Error", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: error.message || "Failed to fetch order detail" });
        }
    }

    verifyPayment = async (req: Request, res: Response): Promise<void> => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const order = await this._orderService.verifyPayment(userId, req.body);
            res.status(StatusCode.OK).json({
                success: true,
                data: order,
                message: "Payment verified successfully"
            });
        } catch (error: any) {
            logger.error("Verify Payment Error", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: error.message || "Payment verification failed" });
        }
    }

    retryPayment = async (req: Request, res: Response): Promise<void> => {
        try {
            // @ts-ignore
            const userId = req.user.id;
            const orderId = req.params.orderId;
            const order = await this._orderService.retryPayment(orderId, userId);
            res.status(StatusCode.OK).json({
                success: true,
                data: order,
                message: "Retry payment initiated"
            });
        } catch (error: any) {
            logger.error("Retry Payment Error", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({ success: false, error: error.message || "Retry payment failed" });
        }
    }

    handleWebhook = async (req: Request, res: Response): Promise<void> => {
        try {
            const signature = req.headers["x-razorpay-signature"] as string;
            await this._orderService.handleWebhook(req.body, signature);
            res.status(StatusCode.OK).send("ok");
        } catch (error: any) {
            logger.error("Webhook Error", error);
            res.status(StatusCode.OK).send("error but acknowledged");
        }
    }
}
