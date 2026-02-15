
import { IDeliverySettings } from "../../../../models/deliverySettings.model";

export interface IAdminDeliveryService {
    getDeliverySettings(): Promise<IDeliverySettings>;
    updateDeliverySettings(deliveryCharge: number, freeShippingThreshold: number): Promise<IDeliverySettings>;
}
