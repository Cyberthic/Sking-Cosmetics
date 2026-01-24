import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserCategoryService } from "../../core/interfaces/services/user/IUserCategory.service";
import { IUserCategoryRepository } from "../../core/interfaces/repositories/user/IUserCategory.repository";
import { ICategory } from "../../models/category.model";

@injectable()
export class UserCategoryService implements IUserCategoryService {
    constructor(
        @inject(TYPES.IUserCategoryRepository) private _repo: IUserCategoryRepository
    ) { }

    async getCategories(): Promise<ICategory[]> {
        return await this._repo.findAllActive();
    }
}
