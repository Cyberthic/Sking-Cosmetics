import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminTransactionController } from "../../core/interfaces/controllers/admin/IAdminTransaction.controller";
import { IAdminTransactionService } from "../../core/interfaces/services/admin/IAdminTransaction.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";

@injectable()
export class AdminTransactionController implements IAdminTransactionController {
    constructor(
        @inject(TYPES.IAdminTransactionService) private _service: IAdminTransactionService
    ) { }

    getTransactions = async (req: Request, res: Response): Promise<Response> => {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const page = parseInt(req.query.page as string) || 1;
            const search = req.query.search as string;
            const status = req.query.status as string;
            const type = req.query.type as string;
            const sort = req.query.sort as string;

            const result = await this._service.getTransactions(limit, page, search, status, type, sort);
            return res.status(StatusCode.OK).json({
                success: true,
                ...result
            });
        } catch (error: any) {
            logger.error("Error fetching transactions:", error);
            const status = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                success: false,
                message: error.message
            });
        }
    };

    getTransactionById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const transaction = await this._service.getTransactionById(id);
            return res.status(StatusCode.OK).json({
                success: true,
                transaction
            });
        } catch (error: any) {
            logger.error("Error fetching transaction by ID:", error);
            const status = error instanceof CustomError ? error.statusCode : StatusCode.INTERNAL_SERVER_ERROR;
            return res.status(status).json({
                success: false,
                message: error.message
            });
        }
    };
}
