import { Request, Response } from "express";

export interface IUserCheckoutController {
    placeOrder(req: Request, res: Response): Promise<void>;
    getDeliverySettings(req: Request, res: Response): Promise<void>;
}
