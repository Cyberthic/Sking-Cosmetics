export interface PlaceOrderDto {
    addressId: string;
    paymentMethod: "online" | "whatsapp";
    couponCode?: string;
    whatsappOptIn?: boolean;
}
