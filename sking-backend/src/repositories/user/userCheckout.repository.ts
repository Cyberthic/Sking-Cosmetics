import { injectable } from "inversify";
import Order, { IOrder } from "../../models/order.model";
import { IUserCheckoutRepository } from "../../core/interfaces/repositories/user/IUserCheckout.repository";

@injectable()
export class UserCheckoutRepository implements IUserCheckoutRepository {
    async createOrder(orderData: any): Promise<IOrder> {
        return await Order.create(orderData);
    }
}
