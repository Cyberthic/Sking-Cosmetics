import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { IOrderSettingsController } from "../../core/interfaces/controllers/admin/IOrderSettings.controller";
import { IOrderSettingsService } from "../../core/interfaces/services/admin/IOrderSettings.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";

@injectable()
export class OrderSettingsController implements IOrderSettingsController {
    constructor(
        @inject(TYPES.IOrderSettingsService) private _service: IOrderSettingsService
    ) { }

    getSettings = async (req: Request, res: Response): Promise<void> => {
        try {
            const settings = await this._service.getSettings();
            res.status(StatusCode.OK).json({ success: true, data: settings });
        } catch (error: any) {
            logger.error("Get Order Settings Error", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: "Failed to fetch order settings" });
        }
    }

    updateSettings = async (req: Request, res: Response): Promise<void> => {
        try {
            const settings = await this._service.updateSettings(req.body);
            res.status(StatusCode.OK).json({ success: true, data: settings, message: "Order settings updated successfully" });
        } catch (error: any) {
            logger.error("Update Order Settings Error", error);
            res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: "Failed to update order settings" });
        }
    }
}
