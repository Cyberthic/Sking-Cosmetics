import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { IAdminCategoryController } from "../../core/interfaces/controllers/admin/IAdminCategory.controller";
import { IAdminCategoryService } from "../../core/interfaces/services/admin/IAdminCategory.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";
import { createCategorySchema, updateCategorySchema } from "../../validations/admin/adminCategory.validation";
import { SuccessMessages, ErrorMessages } from "../../enums/messages.enum";

@injectable()
export class AdminCategoryController implements IAdminCategoryController {
    constructor(
        @inject(TYPES.IAdminCategoryService) private _service: IAdminCategoryService
    ) { }

    createCategory = async (req: Request, res: Response): Promise<Response> => {
        try {
            const validated = await createCategorySchema.parseAsync(req);
            const category = await this._service.createCategory(validated.body);
            return res.status(StatusCode.CREATED).json({ success: true, category });
        } catch (error: any) {
            logger.error("Error creating category:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.BAD_REQUEST;
            return res.status(statusCode).json({ success: false, error: error.message || error.errors });
        }
    }

    getCategories = async (req: Request, res: Response): Promise<Response> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;

            const result = await this._service.getCategories(limit, page, search);
            return res.status(StatusCode.OK).json({ success: true, ...result });
        } catch (error: any) {
            logger.error("Error fetching categories:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
        }
    }

    getCategoryById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const category = await this._service.getCategoryById(id);
            return res.status(StatusCode.OK).json({ success: true, category });
        } catch (error: any) {
            logger.error("Error fetching category:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.NOT_FOUND;
            return res.status(statusCode).json({ success: false, error: error.message });
        }
    }

    updateCategory = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const validated = await updateCategorySchema.parseAsync(req);
            const category = await this._service.updateCategory(id, validated.body);
            return res.status(StatusCode.OK).json({ success: true, category });
        } catch (error: any) {
            logger.error("Error updating category:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.BAD_REQUEST;
            return res.status(statusCode).json({ success: false, error: error.message || error.errors });
        }
    }

    deleteCategory = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            await this._service.deleteCategory(id);
            return res.status(StatusCode.OK).json({ success: true, message: "Category deleted successfully" });
        } catch (error: any) {
            logger.error("Error deleting category:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.NOT_FOUND;
            return res.status(statusCode).json({ success: false, error: error.message });
        }
    }
}
