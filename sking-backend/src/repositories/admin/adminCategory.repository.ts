import { injectable } from "inversify";
import { ICategory, CategoryModel } from "../../models/category.model";
import { IAdminCategoryRepository } from "../../core/interfaces/repositories/admin/IAdminCategory.repository";

@injectable()
export class AdminCategoryRepository implements IAdminCategoryRepository {
    async create(data: Partial<ICategory>): Promise<ICategory> {
        return await CategoryModel.create(data);
    }

    async findAll(limit: number, skip: number, search?: string): Promise<{ categories: ICategory[]; total: number }> {
        const filter: any = {};
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        const categories = await CategoryModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await CategoryModel.countDocuments(filter);
        return { categories, total };
    }

    async findById(id: string): Promise<ICategory | null> {
        return await CategoryModel.findById(id);
    }

    async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
        return await CategoryModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<ICategory | null> {
        return await CategoryModel.findByIdAndDelete(id);
    }
}
