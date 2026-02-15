import { OrderSettingsResponseDto, UpdateOrderSettingsDto } from "../../../dtos/admin/orderSettings.dto";

export interface IOrderSettingsService {
    getSettings(): Promise<OrderSettingsResponseDto>;
    updateSettings(data: UpdateOrderSettingsDto): Promise<OrderSettingsResponseDto>;
}
