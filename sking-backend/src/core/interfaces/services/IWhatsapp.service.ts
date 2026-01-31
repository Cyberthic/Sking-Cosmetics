import { IOrder } from "../../../models/order.model";

export interface IWhatsappService {
    sendOrderSuccessMessage(order: IOrder): Promise<void>;
    sendOrderFailureMessage(order: IOrder): Promise<void>;
    sendOrderStatusUpdateMessage(order: IOrder): Promise<void>;
}
