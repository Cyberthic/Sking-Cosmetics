import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserHomeService } from "../../core/interfaces/services/user/IUserHome.service";
import { StatusCode } from "../../enums/statusCode.enums";

@injectable()
export class UserHomeController {
    constructor(
        @inject(TYPES.IUserHomeService) private _homeService: IUserHomeService
    ) { }

    async getHomeData(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this._homeService.getHomePageData();
            res.status(StatusCode.OK).json({
                success: true,
                ...data
            });
        } catch (error) {
            next(error);
        }
    }
}
