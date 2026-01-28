import { PlaceOrderDto } from "../../../dtos/user/userCheckout.dto";
import { IOrder } from "../../../../models/order.model";

export interface IUserCheckoutRepository {
    createOrder(orderData: any): Promise<IOrder>;
}
