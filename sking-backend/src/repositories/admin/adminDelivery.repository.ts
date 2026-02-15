
import { injectable } from "inversify";
import DeliverySettings, { IDeliverySettings } from "../../models/deliverySettings.model";
import { IAdminDeliveryRepository } from "../../core/interfaces/repositories/admin/IAdminDelivery.repository";

@injectable()
export class AdminDeliveryRepository implements IAdminDeliveryRepository {
    async getSettings(): Promise<IDeliverySettings> {
        let settings = await DeliverySettings.findOne();
        if (!settings) {
            settings = await DeliverySettings.create({
                deliveryCharge: 49,
                freeShippingThreshold: 1000
            });
        }
        return settings;
    }

    async updateSettings(deliveryCharge: number, freeShippingThreshold: number): Promise<IDeliverySettings> {
        const settings = await DeliverySettings.findOneAndUpdate(
            {},
            { deliveryCharge, freeShippingThreshold },
            { new: true, upsert: true }
        );
        return settings;
    }
}
