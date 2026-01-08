import { IBaseRepository } from "../IBase.repository";
import { ICart } from "../../../../models/cart.model";

export interface ICartRepository extends IBaseRepository<ICart> {
    findByUserId(userId: string): Promise<ICart | null>;
}
