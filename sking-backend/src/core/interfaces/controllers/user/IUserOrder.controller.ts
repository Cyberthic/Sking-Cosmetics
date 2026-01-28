import { Request, Response } from "express";

export interface IUserOrderController {
    getUserOrders(req: Request, res: Response): Promise<void>;
    getOrderDetail(req: Request, res: Response): Promise<void>;
    verifyPayment(req: Request, res: Response): Promise<void>;
    retryPayment(req: Request, res: Response): Promise<void>;
    handleWebhook(req: Request, res: Response): Promise<void>;
}
