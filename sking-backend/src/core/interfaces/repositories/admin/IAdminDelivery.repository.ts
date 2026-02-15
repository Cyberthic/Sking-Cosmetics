
import { IDeliverySettings } from "../../../../models/deliverySettings.model";

export interface IAdminDeliveryRepository {
    getSettings(): Promise<IDeliverySettings>;
    updateSettings(deliveryCharge: number, freeShippingThreshold: number): Promise<IDeliverySettings>;
}
