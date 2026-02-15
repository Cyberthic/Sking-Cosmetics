
import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminDeliveryController } from "../../core/interfaces/controllers/admin/IAdminDelivery.controller";
import { IAdminDeliveryService } from "../../core/interfaces/services/admin/IAdminDelivery.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";

@injectable()
export class AdminDeliveryController implements IAdminDeliveryController {
    constructor(
        @inject(TYPES.IAdminDeliveryService) private _deliveryService: IAdminDeliveryService
    ) { }

    getDeliverySettings = async (req: Request, res: Response): Promise<Response> => {
        try {
            const settings = await this._deliveryService.getDeliverySettings();
            return res.status(StatusCode.OK).json({
                success: true,
                settings
            });
        } catch (error: any) {
            logger.error("Error fetching delivery settings:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    };

    updateDeliverySettings = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { deliveryCharge, freeShippingThreshold } = req.body;

            if (deliveryCharge === undefined || freeShippingThreshold === undefined) {
                return res.status(StatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Delivery charge and free shipping threshold are required"
                });
            }

            const settings = await this._deliveryService.updateDeliverySettings(Number(deliveryCharge), Number(freeShippingThreshold));
            return res.status(StatusCode.OK).json({
                success: true,
                message: "Delivery settings updated successfully",
                settings
            });
        } catch (error: any) {
            logger.error("Error updating delivery settings:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    };
}
