import { ICategory } from "../../../../models/category.model";
import { CreateCategoryDto, UpdateCategoryDto } from "../../../dtos/admin/adminCategory.dto";


export interface IAdminCategoryService {
    createCategory(data: CreateCategoryDto): Promise<ICategory>;
    getCategories(limit: number, page: number, search?: string): Promise<{ categories: ICategory[]; total: number; totalPages: number }>;
    getCategoryById(id: string): Promise<ICategory | null>;
    updateCategory(id: string, data: UpdateCategoryDto): Promise<ICategory | null>;
    deleteCategory(id: string): Promise<ICategory | null>;
}
