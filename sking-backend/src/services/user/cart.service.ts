import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { ICartService } from "../../core/interfaces/services/user/ICart.service";
import { ICartRepository } from "../../core/interfaces/repositories/user/ICart.repository";
import { IAdminProductRepository } from "../../core/interfaces/repositories/admin/IAdminProduct.repository";
import { IUserAuthRepository } from "../../core/interfaces/repositories/user/IUserAuth.repository";
import { ICart } from "../../models/cart.model";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enums";
import { Types } from "mongoose";

@injectable()
export class CartService implements ICartService {
    constructor(
        @inject(TYPES.ICartRepository) private _cartRepository: ICartRepository,
        @inject(TYPES.IAdminProductRepository) private _productRepository: IAdminProductRepository,
        @inject(TYPES.IUserAuthRepository) private _userRepository: IUserAuthRepository
    ) { }

    async getCart(userId: string): Promise<ICart> {
        let cart = await this._cartRepository.findByUserId(userId);
        if (!cart) {
            cart = await this._cartRepository.create({ user: new Types.ObjectId(userId), items: [] });
        }
        return cart;
    }

    async addToCart(userId: string, productId: string, variantName: string | undefined, quantity: number): Promise<ICart> {
        let cart = await this.getCart(userId);
        const product = await this._productRepository.findById(productId);
        if (!product) {
            throw new CustomError("Product not found", StatusCode.NOT_FOUND);
        }

        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new CustomError("User not found", StatusCode.NOT_FOUND);
        }

        const cartLimit = user.cartLimit || 5;
        const currentTotalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);

        console.log(`[CartService] Adding Item: Limit=${cartLimit}, CurrentQty=${currentTotalQuantity}, AddQty=${quantity}`);

        // Check overall limit
        if (currentTotalQuantity + quantity > cartLimit) {
            throw new CustomError(`Cart capacity exceeded. You can only have ${cartLimit} items in your cart.`, StatusCode.BAD_REQUEST);
        }

        let price = product.price;
        let targetVariant;

        if (variantName) {
            targetVariant = product.variants.find(v => v.size === variantName);
            if (!targetVariant) {
                // Try finding by 'name' for backward compatibility or if frontend sends name
                targetVariant = product.variants.find(v => (v as any).name === variantName);
            }
            if (!targetVariant) throw new CustomError(`Variant '${variantName}' not found`, StatusCode.BAD_REQUEST);
        } else {
            // Default to first variant
            if (product.variants && product.variants.length > 0) {
                targetVariant = product.variants[0];
                variantName = targetVariant.size;
            } else {
                throw new CustomError("Product has no variants available", StatusCode.BAD_REQUEST);
            }
        }

        if (targetVariant) {
            price = targetVariant.price;
            if (targetVariant.stock < quantity) {
                throw new CustomError(`Insufficient stock for ${targetVariant.size}. Available: ${targetVariant.stock}`, StatusCode.BAD_REQUEST);
            }
        }

        // Offer calculation
        if (product.offerPercentage > 0) {
            price = price - (price * (product.offerPercentage / 100));
        }

        const existingItemIndex = cart.items.findIndex(item =>
            item.product.toString() === productId && item.variantName === variantName
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({
                product: new Types.ObjectId(productId),
                variantName,
                quantity,
                price
            });
        }

        return await cart.save();
    }

    async removeFromCart(userId: string, productId: string, variantName?: string): Promise<ICart> {
        const cart = await this._cartRepository.findByUserId(userId);
        if (!cart) throw new CustomError("Cart not found", StatusCode.NOT_FOUND);

        cart.items = cart.items.filter(item =>
            !(item.product.toString() === productId && item.variantName === variantName)
        );

        return await cart.save();
    }

    async updateQuantity(userId: string, productId: string, variantName: string | undefined, quantity: number): Promise<ICart> {
        const cart = await this.getCart(userId);
        const user = await this._userRepository.findById(userId);
        const cartLimit = user?.cartLimit || 5;

        // Calculate potential new total (excluding current item's old qty)
        const otherItemsTotal = cart.items.reduce((acc, item) => {
            if (item.product.toString() === productId && item.variantName === variantName) return acc;
            return acc + item.quantity;
        }, 0);

        if (otherItemsTotal + quantity > cartLimit) {
            throw new CustomError(`Cart capacity exceeded. Limit is ${cartLimit}.`, StatusCode.BAD_REQUEST);
        }

        const itemIndex = cart.items.findIndex(item =>
            item.product.toString() === productId && item.variantName === variantName
        );

        if (itemIndex > -1) {
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                // Check stock (simplified)
                cart.items[itemIndex].quantity = quantity;
            }
        }

        return await cart.save();
    }
}
