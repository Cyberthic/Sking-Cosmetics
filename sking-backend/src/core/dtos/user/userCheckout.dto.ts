export interface PlaceOrderDto {
    addressId: string;
    paymentMethod: "online";
    couponCode?: string;
    whatsappOptIn?: boolean;
}
