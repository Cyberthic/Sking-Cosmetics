import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { IWishlistRepository } from "../../core/interfaces/repositories/user/IWishlist.repository";
import { IWishlist, WishlistModel } from "../../models/wishlist.model";

@injectable()
export class WishlistRepository extends BaseRepository<IWishlist> implements IWishlistRepository {
    constructor() {
        super(WishlistModel);
    }

    async findByUserId(userId: string): Promise<IWishlist | null> {
        return this._model.findOne({ user: userId }).populate('products').exec();
    }
}
