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

        const cartLimit = 10; // Maximum unique products in cart
        const productLimit = 10; // Maximum quantity per product

        let price = product.price;
        let targetVariant;

        if (variantName) {
            targetVariant = product.variants.find(v => v.size === variantName);
            if (!targetVariant) {
                targetVariant = product.variants.find(v => (v as any).name === variantName);
            }
            if (!targetVariant) throw new CustomError(`Variant '${variantName}' not found`, StatusCode.BAD_REQUEST);
        } else {
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

        if (product.offerPercentage > 0) {
            price = price - (price * (product.offerPercentage / 100));
        }

        const existingItemIndex = cart.items.findIndex(item => {
            const itemProdId = (item.product as any)._id ? (item.product as any)._id.toString() : item.product.toString();
            return itemProdId === productId && item.variantName === variantName;
        });

        if (existingItemIndex > -1) {
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            if (newQuantity > productLimit) {
                throw new CustomError(`maximum 10 per product`, StatusCode.BAD_REQUEST);
            }
            cart.items[existingItemIndex].quantity = newQuantity;
            cart.items[existingItemIndex].price = price; // Update price in case it changed
        } else {
            if (cart.items.length >= cartLimit) {
                throw new CustomError(`maximum 10 products in cart`, StatusCode.BAD_REQUEST);
            }
            if (quantity > productLimit) {
                throw new CustomError(`maximum 10 per product`, StatusCode.BAD_REQUEST);
            }
            cart.items.push({
                product: new Types.ObjectId(productId) as any,
                variantName,
                quantity,
                price
            });
        }

        await cart.save();
        return this.getCart(userId); // Return re-populated cart
    }

    async removeFromCart(userId: string, productId: string, variantName?: string): Promise<ICart> {
        const cart = await this._cartRepository.findByUserId(userId);
        if (!cart) throw new CustomError("Cart not found", StatusCode.NOT_FOUND);

        cart.items = cart.items.filter(item => {
            const itemProdId = (item.product as any)._id ? (item.product as any)._id.toString() : item.product.toString();
            return !(itemProdId === productId && item.variantName === variantName);
        });

        await cart.save();
        return this.getCart(userId);
    }

    async updateQuantity(userId: string, productId: string, variantName: string | undefined, quantity: number): Promise<ICart> {
        const cart = await this.getCart(userId);
        const productLimit = 10;

        if (quantity > productLimit) {
            throw new CustomError(`maximum 10 per product`, StatusCode.BAD_REQUEST);
        }

        const itemIndex = cart.items.findIndex(item => {
            const itemProdId = (item.product as any)._id ? (item.product as any)._id.toString() : item.product.toString();
            return itemProdId === productId && item.variantName === variantName;
        });

        if (itemIndex > -1) {
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                const product = await this._productRepository.findById(productId);
                if (product) {
                    const variant = product.variants.find(v => v.size === variantName);
                    if (variant && variant.stock < quantity) {
                        throw new CustomError(`Insufficient stock. Available: ${variant.stock}`, StatusCode.BAD_REQUEST);
                    }
                }
                cart.items[itemIndex].quantity = quantity;
            }
        }

        await cart.save();
        return this.getCart(userId);
    }
}
