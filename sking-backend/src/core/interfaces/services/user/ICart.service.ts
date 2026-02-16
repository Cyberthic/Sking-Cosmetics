import { ICart } from "../../../../models/cart.model";

export interface ICartService {
    getCart(userId: string): Promise<ICart>;
    addToCart(userId: string, productId: string, variantName: string | undefined, quantity: number): Promise<ICart>;
    removeFromCart(userId: string, productId: string, variantName?: string): Promise<ICart>;
    updateQuantity(userId: string, productId: string, variantName: string | undefined, quantity: number): Promise<ICart>;
    mergeCart(userId: string, guestItems: any[]): Promise<ICart>;
}
