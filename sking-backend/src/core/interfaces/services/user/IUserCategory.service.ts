import { ICategory } from "../../../../models/category.model";

export interface IUserCategoryService {
    getCategories(): Promise<ICategory[]>;
}
