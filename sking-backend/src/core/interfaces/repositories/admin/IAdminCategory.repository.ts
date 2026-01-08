import { ICategory } from "../../../../models/category.model";
import { IProduct } from "../../../../models/product.model";

export interface IAdminCategoryRepository {
    create(data: Partial<ICategory>): Promise<ICategory>;
    findAll(limit: number, skip: number, search?: string): Promise<{ categories: ICategory[]; total: number }>;
    findById(id: string): Promise<ICategory | null>;
    update(id: string, data: Partial<ICategory>): Promise<ICategory | null>;
    delete(id: string): Promise<ICategory | null>;
}
