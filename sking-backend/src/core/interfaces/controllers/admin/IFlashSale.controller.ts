import { Request, Response } from "express";

export interface IFlashSaleController {
    getFlashSale(req: Request, res: Response): Promise<void>;
    updateFlashSale(req: Request, res: Response): Promise<void>;
}
