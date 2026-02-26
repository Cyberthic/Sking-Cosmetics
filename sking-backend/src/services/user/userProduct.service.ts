import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserProductService } from "../../core/interfaces/services/user/IUserProduct.service";
import { IUserProductRepository } from "../../core/interfaces/repositories/user/IUserProduct.repository";
import { IProduct } from "../../models/product.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";

import { CategoryModel } from "../../models/category.model";
import { FlashSaleModel } from "../../models/flashSale.model";
import { FeaturedProductModel } from "../../models/featuredProduct.model";

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

        // Category Filter (handle single or comma-separated string)
        if (query.category) {
            const categories = typeof query.category === 'string' ? query.category.split(',') : [query.category];
            const validCategories = categories.filter(c => c.match(/^[0-9a-fA-F]{24}$/));

            if (validCategories.length > 0) {
                filter.category = validCategories.length > 1 ? { $in: validCategories } : validCategories[0];
            }
        }

        // IDs Filter
        if (query.ids) {
            const ids = typeof query.ids === 'string' ? query.ids.split(',') : [query.ids];
            const validIds = ids.filter(id => id.match(/^[0-9a-fA-F]{24}$/));
            if (validIds.length > 0) {
                filter._id = { $in: validIds };
            }
        }

        // Advanced Search (name, description, tags, brand, category name)
        if (query.search) {
            const searchRegex = { $regex: query.search as string, $options: 'i' };

            // Find categories whose name matches the search term
            const matchingCategories = await CategoryModel.find({
                name: searchRegex,
                isActive: true
            }).select('_id');
            const categoryIds = matchingCategories.map(cat => cat._id);

            filter.$or = [
                { name: searchRegex },
                { description: searchRegex },
                { shortDescription: searchRegex },
                { tags: searchRegex },
                { brand: searchRegex }
            ];

            if (categoryIds.length > 0) {
                filter.$or.push({ category: { $in: categoryIds } });
            }
        }

        // Price Filter
        if (query.minPrice || query.maxPrice) {
            filter.price = {};
            const min = parseFloat(query.minPrice);
            const max = parseFloat(query.maxPrice);
            if (!isNaN(min)) filter.price.$gte = min;
            if (!isNaN(max)) filter.price.$lte = max;
            if (Object.keys(filter.price).length === 0) delete filter.price;
        }

        // Rating Filter (Mock logic for now using reviewsCount)
        if (query.rating) {
            const rating = parseInt(query.rating);
            if (!isNaN(rating)) {
                filter.reviewsCount = { $gte: rating };
            }
        }

        // Sorting
        let sort: any = { createdAt: -1 };
        if (query.sort === 'price_asc') sort = { price: 1 };
        if (query.sort === 'price_desc') sort = { price: -1 };
        if (query.sort === 'newest') sort = { createdAt: -1 };
        if (query.sort === 'popularity') sort = { soldCount: -1 };
        if (query.sort === 'rating') sort = { reviewsCount: -1 };

        const products = await this._productRepository.findActive(filter, sort, skip, limit);
        const total = await this._productRepository.countActive(filter);

        const productsWithOffers = await this.applyOffers(products);

        return {
            products: productsWithOffers,
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

        const [productWithOffer] = await this.applyOffers([product]);
        return productWithOffer;
    }

    async applyOffers(products: any[]): Promise<any[]> {
        const flashSale = await FlashSaleModel.findOne({ isActive: true });
        const featuredProducts = await FeaturedProductModel.findOne();
        const featuredIds = featuredProducts ? featuredProducts.products.filter(Boolean).map(p => p.toString()) : [];

        return products.filter(Boolean).map(product => {
            const productObj = product.toObject ? product.toObject() : product;

            const productOffer = productObj.offerPercentage || 0;
            const categoryOffer = productObj.category?.offer || 0;

            let flashSaleOffer = 0;
            let isFlashSale = false;

            if (flashSale && flashSale.products) {
                const fsProduct = flashSale.products.find((p: any) =>
                    p.product.toString() === productObj._id.toString()
                );
                if (fsProduct) {
                    flashSaleOffer = fsProduct.offerPercentage || 0;
                    isFlashSale = true;
                }
            }

            const maxOffer = Math.max(productOffer, categoryOffer, flashSaleOffer);

            // Determine label
            let offerType = 'product';
            if (maxOffer > 0) {
                if (maxOffer === flashSaleOffer && isFlashSale) offerType = 'flash_sale';
                else if (maxOffer === categoryOffer) offerType = 'category';
            }

            // Tag Logic
            const isFeatured = featuredIds.includes(productObj._id.toString());
            const isCombo = productObj.tags?.some((t: string) => t.toLowerCase() === 'combo') ||
                productObj.category?.name?.toLowerCase() === 'combo';

            const now = new Date();
            const createdAt = new Date(productObj.createdAt);
            const isNew = (now.getTime() - createdAt.getTime()) < (24 * 60 * 60 * 1000);

            return {
                ...productObj,
                maxOffer,
                offerType,
                isFlashSale,
                isFeatured,
                isCombo,
                isNew,
                discountedPrice: Math.round(productObj.price * (1 - maxOffer / 100))
            };
        });
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
