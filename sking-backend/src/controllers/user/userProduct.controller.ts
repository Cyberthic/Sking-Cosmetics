import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserProductService } from "../../core/interfaces/services/user/IUserProduct.service";
import { StatusCode } from "../../enums/statusCode.enums";

@injectable()
export class UserProductController {
    constructor(
        @inject(TYPES.IUserProductService) private _productService: IUserProductService
    ) { }

    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this._productService.getProducts(req.query);
            res.status(StatusCode.OK).json({
                success: true,
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await this._productService.getProductById(req.params.id);
            const related = await this._productService.getRelatedProducts(req.params.id, 4);

            res.status(StatusCode.OK).json({
                success: true,
                product,
                related
            });
        } catch (error) {
            next(error);
        }
    }
}
