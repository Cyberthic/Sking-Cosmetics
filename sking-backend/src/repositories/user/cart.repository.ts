import { injectable } from "inversify";
import { BaseRepository } from "../base.repository";
import { ICartRepository } from "../../core/interfaces/repositories/user/ICart.repository";
import { ICart, CartModel } from "../../models/cart.model";

@injectable()
export class CartRepository extends BaseRepository<ICart> implements ICartRepository {
    constructor() {
        super(CartModel);
    }

    async findByUserId(userId: string): Promise<ICart | null> {
        return this._model.findOne({ user: userId }).populate('items.product').exec();
    }
}
