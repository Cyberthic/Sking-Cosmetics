
import { injectable, inject } from "inversify";
import { TYPES } from "../../core/types";
import { IAdminDeliveryService } from "../../core/interfaces/services/admin/IAdminDelivery.service";
import { IAdminDeliveryRepository } from "../../core/interfaces/repositories/admin/IAdminDelivery.repository";
import { IDeliverySettings } from "../../models/deliverySettings.model";

@injectable()
export class AdminDeliveryService implements IAdminDeliveryService {
    constructor(
        @inject(TYPES.IAdminDeliveryRepository) private _deliveryRepository: IAdminDeliveryRepository
    ) { }

    async getDeliverySettings(): Promise<IDeliverySettings> {
        return await this._deliveryRepository.getSettings();
    }

    async updateDeliverySettings(deliveryCharge: number, freeShippingThreshold: number): Promise<IDeliverySettings> {
        return await this._deliveryRepository.updateSettings(deliveryCharge, freeShippingThreshold);
    }
}
