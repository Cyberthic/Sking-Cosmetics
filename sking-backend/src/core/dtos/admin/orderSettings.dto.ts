export interface UpdateOrderSettingsDto {
    isOnlinePaymentEnabled?: boolean;
    isWhatsappOrderingEnabled?: boolean;
    whatsappNumber?: string;
}

export interface OrderSettingsResponseDto {
    isOnlinePaymentEnabled: boolean;
    isWhatsappOrderingEnabled: boolean;
    whatsappNumber: string;
}
