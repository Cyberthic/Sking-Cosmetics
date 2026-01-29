import axiosInstance from "@/lib/axios";

export const userCouponApiService = {
    getMyCoupons: async () => {
        try {
            const response = await axiosInstance.get("/api/users/coupons");
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error.message;
        }
    },

    applyCoupon: async (code: string, cartTotal: number, cartItems: any[]) => {
        try {
            const response = await axiosInstance.post("/api/users/coupons/apply", { code, cartTotal, cartItems });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error.message;
        }
    }
};
