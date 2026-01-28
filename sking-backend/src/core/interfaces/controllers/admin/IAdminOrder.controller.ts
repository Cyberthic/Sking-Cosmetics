import { Request, Response } from "express";

export interface IAdminOrderController {
    getOrders(req: Request, res: Response): Promise<Response>;
    getOrderById(req: Request, res: Response): Promise<Response>;
    updateOrderStatus(req: Request, res: Response): Promise<Response>;
}
