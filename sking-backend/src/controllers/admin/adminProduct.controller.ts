import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { IAdminProductController } from "../../core/interfaces/controllers/admin/IAdminProduct.controller";
import { IAdminProductService } from "../../core/interfaces/services/admin/IAdminProduct.service";
import { StatusCode } from "../../enums/statusCode.enums";
import logger from "../../utils/logger";
import { CustomError } from "../../utils/customError";
import { createProductSchema, updateProductSchema } from "../../validations/admin/adminProduct.validation";

@injectable()
export class AdminProductController implements IAdminProductController {
    constructor(
        @inject(TYPES.IAdminProductService) private _service: IAdminProductService
    ) { }

    createProduct = async (req: Request, res: Response): Promise<Response> => {
        try {
            const validated = await createProductSchema.parseAsync(req);
            const product = await this._service.createProduct(validated.body);
            return res.status(StatusCode.CREATED).json({ success: true, product });
        } catch (error: any) {
            logger.error("Error creating product:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.BAD_REQUEST;
            return res.status(statusCode).json({ success: false, error: error.message || error.errors });
        }
    }

    getProducts = async (req: Request, res: Response): Promise<Response> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;
            const categoryId = req.query.category as string;

            const result = await this._service.getProducts(limit, page, search, categoryId);
            return res.status(StatusCode.OK).json({ success: true, ...result });
        } catch (error: any) {
            logger.error("Error fetching products:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
        }
    }

    getProductById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const product = await this._service.getProductById(id);
            return res.status(StatusCode.OK).json({ success: true, product });
        } catch (error: any) {
            logger.error("Error fetching product:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.NOT_FOUND;
            return res.status(statusCode).json({ success: false, error: error.message });
        }
    }

    updateProduct = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            const validated = await updateProductSchema.parseAsync(req);
            const product = await this._service.updateProduct(id, validated.body);
            return res.status(StatusCode.OK).json({ success: true, product });
        } catch (error: any) {
            logger.error("Error updating product:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.BAD_REQUEST;
            return res.status(statusCode).json({ success: false, error: error.message || error.errors });
        }
    }

    deleteProduct = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { id } = req.params;
            await this._service.deleteProduct(id);
            return res.status(StatusCode.OK).json({ success: true, message: "Product deleted successfully" });
        } catch (error: any) {
            logger.error("Error deleting product:", error);
            const statusCode = error instanceof CustomError ? error.statusCode : StatusCode.NOT_FOUND;
            return res.status(statusCode).json({ success: false, error: error.message });
        }
    }

    uploadImage = async (req: Request, res: Response): Promise<Response> => {
        try {
            const file = req.file;
            if (!file) {
                return res.status(StatusCode.BAD_REQUEST).json({ success: false, error: "No image file provided" });
            }
            const imageUrl = await this._service.uploadProductImage(file);
            return res.status(StatusCode.OK).json({ success: true, imageUrl });
        } catch (error: any) {
            logger.error("Error uploading image:", error);
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
        }
    }
}
