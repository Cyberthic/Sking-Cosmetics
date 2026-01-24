import { injectable } from "inversify";
import { IUserCategoryRepository } from "../../core/interfaces/repositories/user/IUserCategory.repository";
import { ICategory, CategoryModel } from "../../models/category.model";

@injectable()
export class UserCategoryRepository implements IUserCategoryRepository {
    async findAllActive(): Promise<ICategory[]> {
        return await CategoryModel.find({ isActive: true });
    }
}
