import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserHomeService } from "../../core/interfaces/services/user/IUserHome.service";
import { IUserProductRepository } from "../../core/interfaces/repositories/user/IUserProduct.repository";
import { IProduct } from "../../models/product.model";

@injectable()
export class UserHomeService implements IUserHomeService {
    constructor(
        @inject(TYPES.IUserProductRepository) private _productRepository: IUserProductRepository,
        @inject(TYPES.IFlashSaleService) private _flashSaleService: any,
        @inject(TYPES.IFeaturedProductService) private _featuredProductService: any
    ) { }

    async getHomePageData(): Promise<any> {
        // Fetch new arrivals (8 items)
        const newArrivals = await this._productRepository.findNewArrivals(8);

        // Fetch official Flash Sale data
        let flashSale = await this._flashSaleService.getFlashSale();

        // Fallback for Flash Sale: If no flash sale, use latest 5 products with auto-generated discounts
        if (!flashSale || !flashSale.products || flashSale.products.length === 0) {
            const latestForFlash = await this._productRepository.findActive({}, { createdAt: -1 }, 0, 5);

            // Format fallback products to look like flash sale
            const products = latestForFlash.map((product: any) => {
                let offerPercentage = product.offerPercentage;
                if (!offerPercentage || offerPercentage === 0) {
                    const hash = product._id.toString().split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                    offerPercentage = 5 + (hash % 36); // 5 to 40
                }
                return {
                    ...product.toObject(),
                    flashSalePercentage: offerPercentage
                };
            });

            // Default 24 hour rebooting timer for fallback
            const duration = 24 * 60 * 60 * 1000;
            const now = new Date();
            const startOfTheDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
            const timePassed = now.getTime() - startOfTheDay;
            const cycles = Math.floor(timePassed / duration);
            const currentEndTime = new Date(startOfTheDay + (cycles + 1) * duration);

            flashSale = {
                products,
                currentEndTime,
                isActive: true,
                isFallback: true
            };
        }

        // Fetch official Featured Products data
        const featuredData = await this._featuredProductService.getFeaturedProduct();
        let featured = featuredData ? featuredData.products : [];

        // Fallback for Featured: If no featured products, use latest products
        if (!featured || featured.length === 0) {
            featured = newArrivals.slice(0, 5);
        }

        return {
            newArrivals,
            featured,
            flashSale
        };
    }
}
