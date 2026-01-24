import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IUserCategoryService } from "../../core/interfaces/services/user/IUserCategory.service";
import { StatusCode } from "../../enums/statusCode.enums";

@injectable()
export class UserCategoryController {
    constructor(
        @inject(TYPES.IUserCategoryService) private _service: IUserCategoryService
    ) { }

    async getCategories(req: Request, res: Response) {
        try {
            const categories = await this._service.getCategories();
            return res.status(StatusCode.OK).json({ success: true, categories });
        } catch (error: any) {
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
        }
    }
}
