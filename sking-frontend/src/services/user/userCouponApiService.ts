import axiosInstance from "@/lib/axios";

export const userCouponApiService = {
    getMyCoupons: async () => {
        try {
            const response = await axiosInstance.get("/api/users/coupons");
            return response.data;
        } catch (error: any) {
            throw error.response?.data || error.message;
        }
    }
};
