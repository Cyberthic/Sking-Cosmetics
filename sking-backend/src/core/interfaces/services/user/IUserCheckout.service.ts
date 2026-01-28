import { PlaceOrderDto } from "../../../dtos/user/userCheckout.dto";
import { IOrder } from "../../../../models/order.model";

export interface IUserCheckoutService {
    placeOrder(userId: string, data: PlaceOrderDto): Promise<IOrder>;
}
