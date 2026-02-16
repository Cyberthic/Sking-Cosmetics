import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IWishlistService } from "../../core/interfaces/services/user/IWishlist.service";
import { IWishlistRepository } from "../../core/interfaces/repositories/user/IWishlist.repository";
import { IAdminProductRepository } from "../../core/interfaces/repositories/admin/IAdminProduct.repository";
import { IWishlist } from "../../models/wishlist.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";
import { Types } from "mongoose";

@injectable()
export class WishlistService implements IWishlistService {
    constructor(
        @inject(TYPES.IWishlistRepository) private _wishlistRepository: IWishlistRepository,
        @inject(TYPES.IAdminProductRepository) private _productRepository: IAdminProductRepository
    ) { }

    async getWishlist(userId: string): Promise<IWishlist> {
        let wishlist = await this._wishlistRepository.findByUserId(userId);
        if (!wishlist) {
            wishlist = await this._wishlistRepository.create({ user: new Types.ObjectId(userId), products: [] });
        }
        return wishlist;
    }

    async toggleWishlist(userId: string, productId: string): Promise<IWishlist> {
        let wishlist = await this.getWishlist(userId);
        const product = await this._productRepository.findById(productId);

        if (!product) {
            throw new CustomError("Product not found", StatusCode.NOT_FOUND);
        }

        // Handle case where items might be populated or not
        const productIndex = wishlist.products.findIndex(p => {
            const id = (p as any)._id ? (p as any)._id.toString() : p.toString();
            return id === productId;
        });

        if (productIndex > -1) {
            wishlist.products.splice(productIndex, 1);
        } else {
            // Remove any potential duplicates that might have slipped in
            wishlist.products = wishlist.products.filter(p => {
                const id = (p as any)._id ? (p as any)._id.toString() : p.toString();
                return id !== productId;
            }) as any;
            wishlist.products.push(new Types.ObjectId(productId) as any);
        }

        await wishlist.save();

        // Return populated wishlist
        return (await this._wishlistRepository.findByUserId(userId))!;
    }

    async mergeWishlist(userId: string, productIds: string[]): Promise<IWishlist> {
        let wishlist = await this.getWishlist(userId);

        for (const productId of productIds) {
            const productExists = wishlist.products.some(p => {
                const id = (p as any)._id ? (p as any)._id.toString() : p.toString();
                return id === productId;
            });

            if (!productExists) {
                const product = await this._productRepository.findById(productId);
                if (product) {
                    wishlist.products.push(new Types.ObjectId(productId) as any);
                }
            }
        }

        await wishlist.save();
        return (await this._wishlistRepository.findByUserId(userId))!;
    }
}
