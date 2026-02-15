import axiosInstance from "../../lib/axios";

const API_URL = "/api/admin/featured-products";

export const adminFeaturedApiService = {
    getFeaturedProducts: async () => {
        const response = await axiosInstance.get(API_URL);
        return response.data;
    },
    updateFeaturedProducts: async (data: any) => {
        const response = await axiosInstance.put(API_URL, data);
        return response.data;
    },
};
