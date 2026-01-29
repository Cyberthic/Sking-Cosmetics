import { injectable } from "inversify";
import { IProduct, ProductModel } from "../../models/product.model";
import { IAdminProductRepository } from "../../core/interfaces/repositories/admin/IAdminProduct.repository";

@injectable()
export class AdminProductRepository implements IAdminProductRepository {
    async create(data: Partial<IProduct>): Promise<IProduct> {
        return await ProductModel.create(data);
    }

    async findAll(limit: number, skip: number, search?: string, categoryId?: string, sortBy?: string): Promise<{ products: IProduct[]; total: number }> {
        const filter: any = {};
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }
        if (categoryId) {
            filter.category = categoryId;
        }

        let sort: any = { createdAt: -1 };
        if (sortBy) {
            switch (sortBy) {
                case 'price-asc': sort = { price: 1 }; break;
                case 'price-desc': sort = { price: -1 }; break;
                case 'name-asc': sort = { name: 1 }; break;
                case 'name-desc': sort = { name: -1 }; break;
                case 'sold-desc': sort = { soldCount: -1 }; break;
                case 'oldest': sort = { createdAt: 1 }; break;
                case 'newest': sort = { createdAt: -1 }; break;
            }
        }

        const products = await ProductModel.find(filter)
            .populate("category")
            .sort(sort)
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

    async findByCategory(categoryId: string): Promise<IProduct[]> {
        return await ProductModel.find({ category: categoryId }).populate("category");
    }

    async findBySlug(slug: string): Promise<IProduct | null> {
        return await ProductModel.findOne({ slug }).populate("category");
    }
}
