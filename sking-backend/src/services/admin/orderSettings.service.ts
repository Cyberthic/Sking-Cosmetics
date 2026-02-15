import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IOrderSettingsService } from "../../core/interfaces/services/admin/IOrderSettings.service";
import { IOrderSettingsRepository } from "../../core/interfaces/repositories/admin/IOrderSettings.repository";
import { OrderSettingsResponseDto, UpdateOrderSettingsDto } from "../../core/dtos/admin/orderSettings.dto";

@injectable()
export class OrderSettingsService implements IOrderSettingsService {
    constructor(
        @inject(TYPES.IOrderSettingsRepository) private _repository: IOrderSettingsRepository
    ) { }

    async getSettings(): Promise<OrderSettingsResponseDto> {
        let settings = await this._repository.getSettings();
        if (!settings) {
            // Return default values if not found
            return {
                isOnlinePaymentEnabled: true,
                isWhatsappOrderingEnabled: true,
                whatsappNumber: "+918848886919"
            };
        }
        return {
            isOnlinePaymentEnabled: settings.isOnlinePaymentEnabled,
            isWhatsappOrderingEnabled: settings.isWhatsappOrderingEnabled,
            whatsappNumber: settings.whatsappNumber
        };
    }

    async updateSettings(data: UpdateOrderSettingsDto): Promise<OrderSettingsResponseDto> {
        const settings = await this._repository.updateSettings(data);
        return {
            isOnlinePaymentEnabled: settings.isOnlinePaymentEnabled,
            isWhatsappOrderingEnabled: settings.isWhatsappOrderingEnabled,
            whatsappNumber: settings.whatsappNumber
        };
    }
}
