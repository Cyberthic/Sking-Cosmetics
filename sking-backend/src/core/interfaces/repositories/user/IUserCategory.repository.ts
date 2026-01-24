import { ICategory } from "../../../../models/category.model";

export interface IUserCategoryRepository {
    findAllActive(): Promise<ICategory[]>;
}
