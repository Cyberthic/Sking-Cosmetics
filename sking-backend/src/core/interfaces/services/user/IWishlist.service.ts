import { IWishlist } from "../../../../models/wishlist.model";

export interface IWishlistService {
    getWishlist(userId: string): Promise<IWishlist>;
    toggleWishlist(userId: string, productId: string): Promise<IWishlist>;
    mergeWishlist(userId: string, productIds: string[]): Promise<IWishlist>;
}
