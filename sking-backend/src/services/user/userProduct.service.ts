import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserProductService } from "../../core/interfaces/services/user/IUserProduct.service";
import { IUserProductRepository } from "../../core/interfaces/repositories/user/IUserProduct.repository";
import { IProduct } from "../../models/product.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";

@injectable()
export class UserProductService implements IUserProductService {
    constructor(
        @inject(TYPES.IUserProductRepository) private _productRepository: IUserProductRepository
    ) { }

    async getProducts(query: any): Promise<{ products: IProduct[]; total: number; page: number; pages: number }> {
        const page = parseInt(query.page as string) || 1;
        const limit = parseInt(query.limit as string) || 12;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (query.category) {
            filter.category = query.category;
        }
        if (query.search) {
            filter.name = { $regex: query.search, $options: 'i' };
        }

        // Sorting
        let sort: any = { createdAt: -1 }; // Default new arrivals
        if (query.sort === 'price_asc') sort = { price: 1 };
        if (query.sort === 'price_desc') sort = { price: -1 };

        const products = await this._productRepository.findActive(filter, sort, skip, limit);
        const total = await this._productRepository.countActive(filter);

        return {
            products,
            total,
            page,
            pages: Math.ceil(total / limit)
        };
    }

    async getProductById(idOrSlug: string): Promise<IProduct> {
        let product;

        if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
            product = await this._productRepository.findByIdActive(idOrSlug);
        }

        if (!product) {
            product = await this._productRepository.findBySlugActive(idOrSlug);
        }

        if (!product) {
            throw new CustomError("Product not found", StatusCode.NOT_FOUND);
        }
        return product;
    }

    async getRelatedProducts(id: string, limit: number): Promise<IProduct[]> {
        const product = await this._productRepository.findByIdActive(id);
        if (!product) return [];

        // Simple related logic: same category, excluding self
        return this._productRepository.findActive(
            { category: product.category, _id: { $ne: id } },
            { createdAt: -1 },
            0,
            limit
        );
    }
}
