import { injectable } from "inversify";
import { IOrderSettingsRepository } from "../../core/interfaces/repositories/admin/IOrderSettings.repository";
import OrderSettings, { IOrderSettings } from "../../models/orderSettings.model";
import { UpdateOrderSettingsDto } from "../../core/dtos/admin/orderSettings.dto";

@injectable()
export class OrderSettingsRepository implements IOrderSettingsRepository {
    async getSettings(): Promise<IOrderSettings | null> {
        return await OrderSettings.findOne();
    }

    async updateSettings(data: UpdateOrderSettingsDto): Promise<IOrderSettings> {
        let settings = await OrderSettings.findOne();
        if (!settings) {
            settings = new OrderSettings(data);
        } else {
            Object.assign(settings, data);
        }
        return await settings.save();
    }
}
