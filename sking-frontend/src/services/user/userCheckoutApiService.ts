import axiosInstance from "../../lib/axios";

export interface CheckoutPayload {
    addressId: string;
    paymentMethod: "online" | "whatsapp";
    couponCode?: string;
    whatsappOptIn?: boolean;
}

export const userCheckoutService = {
    async placeOrder(payload: CheckoutPayload) {
        const response = await axiosInstance.post("/api/users/checkout/place-order", payload);
        return response.data;
    },

    async getDeliverySettings() {
        const response = await axiosInstance.get("/api/users/checkout/settings");
        return response.data;
    }
};
