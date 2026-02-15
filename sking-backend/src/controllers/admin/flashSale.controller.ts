import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { IFlashSaleController } from "../../core/interfaces/controllers/admin/IFlashSale.controller";
import { IFlashSaleService } from "../../core/interfaces/services/admin/IFlashSale.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";

@injectable()
export class FlashSaleController implements IFlashSaleController {
    constructor(
        @inject(TYPES.IFlashSaleService) private _service: IFlashSaleService
    ) { }

    getFlashSale = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this._service.getFlashSale(true);
            res.status(StatusCode.OK).json({ success: true, data });
        } catch (error: any) {
            logger.error("Get Flash Sale Error", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: "Failed to fetch flash sale settings" });
        }
    }

    updateFlashSale = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = await this._service.updateFlashSale(req.body);
            res.status(StatusCode.OK).json({ success: true, data, message: "Flash sale settings updated successfully" });
        } catch (error: any) {
            logger.error("Update Flash Sale Error", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: "Failed to update flash sale settings" });
        }
    }
}
