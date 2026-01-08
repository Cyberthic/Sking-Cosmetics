import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserHomeService } from "../../core/interfaces/services/user/IUserHome.service";
import { IUserProductRepository } from "../../core/interfaces/repositories/user/IUserProduct.repository";
import { IProduct } from "../../models/product.model";

@injectable()
export class UserHomeService implements IUserHomeService {
    constructor(
        @inject(TYPES.IUserProductRepository) private _productRepository: IUserProductRepository
    ) { }

    async getHomePageData(): Promise<{ newArrivals: IProduct[]; featured: IProduct[] }> {
        // For now, New Arrivals are just latest active products
        const newArrivals = await this._productRepository.findNewArrivals(8);

        // Featured could be same for now, or random, or specific logic. 
        // Let's reuse newArrivals or modify logic if we add 'isFeatured' flag later.
        const featured = await this._productRepository.findActive({}, { createdAt: -1 }, 0, 4);

        return {
            newArrivals,
            featured
        };
    }
}
