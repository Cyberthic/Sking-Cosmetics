
import { Request, Response } from "express";

export interface IAdminDeliveryController {
    getDeliverySettings(req: Request, res: Response): Promise<Response>;
    updateDeliverySettings(req: Request, res: Response): Promise<Response>;
}
