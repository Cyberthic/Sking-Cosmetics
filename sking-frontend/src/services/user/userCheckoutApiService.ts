import axiosInstance from "../../lib/axios";

export interface CheckoutPayload {
    addressId: string;
    paymentMethod: "online";
}

export const userCheckoutService = {
    async placeOrder(payload: CheckoutPayload) {
        const response = await axiosInstance.post("/api/users/checkout/place-order", payload);
        return response.data;
    }
};
