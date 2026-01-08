import { IBaseRepository } from "../IBase.repository";
import { IWishlist } from "../../../../models/wishlist.model";

export interface IWishlistRepository extends IBaseRepository<IWishlist> {
    findByUserId(userId: string): Promise<IWishlist | null>;
}
