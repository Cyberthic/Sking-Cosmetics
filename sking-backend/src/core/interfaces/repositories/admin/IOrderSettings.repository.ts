import { IOrderSettings } from "../../../../models/orderSettings.model";
import { UpdateOrderSettingsDto } from "../../../dtos/admin/orderSettings.dto";

export interface IOrderSettingsRepository {
    getSettings(): Promise<IOrderSettings | null>;
    updateSettings(data: UpdateOrderSettingsDto): Promise<IOrderSettings>;
}
