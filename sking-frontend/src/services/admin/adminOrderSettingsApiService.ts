import axiosInstance from "../../lib/axios";

export interface OrderSettings {
    isOnlinePaymentEnabled: boolean;
    isWhatsappOrderingEnabled: boolean;
    whatsappNumber: string;
}

export const adminOrderSettingsService = {
    async getSettings() {
        const response = await axiosInstance.get("/api/admin/order-settings");
        return response.data;
    },

    async updateSettings(data: Partial<OrderSettings>) {
        const response = await axiosInstance.put("/api/admin/order-settings", data);
        return response.data;
    }
};

export const userOrderSettingsService = {
    async getSettings() {
        const response = await axiosInstance.get("/api/users/order-settings");
        return response.data;
    }
};
