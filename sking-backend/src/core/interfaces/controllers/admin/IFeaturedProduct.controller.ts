import { Request, Response } from "express";

export interface IFeaturedProductController {
    getFeaturedProduct(req: Request, res: Response): Promise<void>;
    updateFeaturedProduct(req: Request, res: Response): Promise<void>;
}
