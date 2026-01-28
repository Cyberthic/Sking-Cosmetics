import axiosInstance from "@/lib/axios";

export const userOrderService = {
    async getUserOrders() {
        const response = await axiosInstance.get("/api/users/orders");
        return response.data;
    },
    async getOrderDetail(orderId: string) {
        const response = await axiosInstance.get(`/api/users/orders/${orderId}`);
        return response.data;
    },
    async verifyPayment(payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
        const response = await axiosInstance.post("/api/users/orders/verify-payment", payload);
        return response.data;
    }
};
