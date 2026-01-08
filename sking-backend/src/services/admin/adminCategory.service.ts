import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminCategoryService } from "../../core/interfaces/services/admin/IAdminCategory.service";
import { IAdminCategoryRepository } from "../../core/interfaces/repositories/admin/IAdminCategory.repository";
import { ICategory } from "../../models/category.model";
import { CreateCategoryDto, UpdateCategoryDto } from "../../dtos/category.dto";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";

@injectable()
export class AdminCategoryService implements IAdminCategoryService {
    constructor(
        @inject(TYPES.IAdminCategoryRepository) private _repo: IAdminCategoryRepository
    ) { }

    async createCategory(data: CreateCategoryDto): Promise<ICategory> {
        return await this._repo.create(data);
    }

    async getCategories(limit: number, page: number, search?: string): Promise<{ categories: ICategory[]; total: number; totalPages: number }> {
        const skip = (page - 1) * limit;
        const { categories, total } = await this._repo.findAll(limit, skip, search);
        const totalPages = Math.ceil(total / limit);
        return { categories, total, totalPages };
    }

    async getCategoryById(id: string): Promise<ICategory | null> {
        const category = await this._repo.findById(id);
        if (!category) throw new CustomError("Category not found", StatusCode.NOT_FOUND);
        return category;
    }

    async updateCategory(id: string, data: UpdateCategoryDto): Promise<ICategory | null> {
        const category = await this._repo.update(id, data);
        if (!category) throw new CustomError("Category not found", StatusCode.NOT_FOUND);
        return category;
    }

    async deleteCategory(id: string): Promise<ICategory | null> {
        const category = await this._repo.delete(id);
        if (!category) throw new CustomError("Category not found", StatusCode.NOT_FOUND);
        return category;
    }
}
