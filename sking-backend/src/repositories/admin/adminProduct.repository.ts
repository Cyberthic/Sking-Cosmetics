import { injectable } from "inversify";
import { IProduct, ProductModel } from "../../models/product.model";
import { IAdminProductRepository } from "../../core/interfaces/repositories/admin/IAdminProduct.repository";

@injectable()
export class AdminProductRepository implements IAdminProductRepository {
    async create(data: Partial<IProduct>): Promise<IProduct> {
        return await ProductModel.create(data);
    }

    async findAll(limit: number, skip: number, search?: string, categoryId?: string): Promise<{ products: IProduct[]; total: number }> {
        const filter: any = {};
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }
        if (categoryId) {
            filter.category = categoryId;
        }

        const products = await ProductModel.find(filter)
            .populate("category")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ProductModel.countDocuments(filter);
        return { products, total };
    }

    async findById(id: string): Promise<IProduct | null> {
        return await ProductModel.findById(id).populate("category");
    }

    async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
        return await ProductModel.findByIdAndUpdate(id, data, { new: true }).populate("category");
    }

    async delete(id: string): Promise<IProduct | null> {
        return await ProductModel.findByIdAndDelete(id);
    }

    async findByCategory(categoryId: string): Promise<IProduct[]> {
        return await ProductModel.find({ category: categoryId }).populate("category");
    }

    async findBySlug(slug: string): Promise<IProduct | null> {
        return await ProductModel.findOne({ slug }).populate("category");
    }
}
