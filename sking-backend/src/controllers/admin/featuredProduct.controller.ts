import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { IFeaturedProductController } from "../../core/interfaces/controllers/admin/IFeaturedProduct.controller";
import { IFeaturedProductService } from "../../core/interfaces/services/admin/IFeaturedProduct.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";

@injectable()
export class FeaturedProductController implements IFeaturedProductController {
    constructor(
        @inject(TYPES.IFeaturedProductService) private _service: IFeaturedProductService
    ) { }

    getFeaturedProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this._service.getFeaturedProduct();
            res.status(StatusCode.OK).json({ success: true, data });
        } catch (error: any) {
            logger.error("Get Featured Product Error", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: "Failed to fetch featured products" });
        }
    }

    updateFeaturedProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this._service.updateFeaturedProduct(req.body);
            res.status(StatusCode.OK).json({ success: true, data, message: "Featured products updated successfully" });
        } catch (error: any) {
            logger.error("Update Featured Product Error", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: "Failed to update featured products" });
        }
    }
}
