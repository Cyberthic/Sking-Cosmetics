import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserHomeService } from "../../core/interfaces/services/user/IUserHome.service";
import { IUserProductRepository } from "../../core/interfaces/repositories/user/IUserProduct.repository";
import { IUserProductService } from "../../core/interfaces/services/user/IUserProduct.service";
import { IProduct } from "../../models/product.model";

@injectable()
export class UserHomeService implements IUserHomeService {
    constructor(
        @inject(TYPES.IUserProductRepository) private _productRepository: IUserProductRepository,
        @inject(TYPES.IUserProductService) private _productService: IUserProductService,
        @inject(TYPES.IFlashSaleService) private _flashSaleService: any,
        @inject(TYPES.IFeaturedProductService) private _featuredProductService: any
    ) { }

    async getHomePageData(): Promise<any> {
        // Fetch new arrivals (8 items)
        const newArrivals = await this._productRepository.findNewArrivals(8);

        // Fetch official Flash Sale data
        let flashSale = await this._flashSaleService.getFlashSale();
        // Fallback or secondary logic removed as per user request to hide entirely when inactive.

        // Fetch official Featured Products data
        const featuredData = await this._featuredProductService.getFeaturedProduct();
        let featured = featuredData ? featuredData.products : [];

        // Fallback for Featured: If no featured products, use latest products
        if (!featured || featured.length === 0) {
            featured = newArrivals.slice(0, 5);
        }

        // Apply offers and tags
        const newArrivalsWithOffers = await this._productService.applyOffers(newArrivals);
        const featuredWithOffers = await this._productService.applyOffers(featured);

        // Flash sale logic: If active but empty, show new arrivals as fallback
        let isFallback = false;
        if (flashSale) {
            if (!flashSale.isActive) {
                flashSale = null;
            } else if (!flashSale.products || flashSale.products.length === 0) {
                // Populate with new arrivals but no extra offer
                flashSale.products = newArrivalsWithOffers.slice(0, 5).map(p => ({
                    ...p,
                    flashSalePercentage: 0
                }));
                isFallback = true;
            }
        }

        return {
            newArrivals: newArrivalsWithOffers,
            featured: featuredWithOffers,
            flashSale: flashSale ? { ...flashSale, isFallback } : null
        };
    }
}
