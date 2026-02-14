import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { IAdminDashboardController } from "../../core/interfaces/controllers/admin/IAdminDashboard.controller";
import { IAdminDashboardService } from "../../core/interfaces/services/admin/IAdminDashboard.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";

@injectable()
export class AdminDashboardController implements IAdminDashboardController {
    constructor(
        @inject(TYPES.IAdminDashboardService) private _adminDashboardService: IAdminDashboardService
    ) { }

    getDashboardStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const stats = await this._adminDashboardService.getDashboardStats();
            res.status(StatusCode.OK).json({
                success: true,
                data: stats
            });
        } catch (error) {
            logger.error("Error getting dashboard stats:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            res.status(statusCode).json({
                success: false,
                error: (error as Error).message
            });
        }
    };
}
