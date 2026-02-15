import axiosInstance from "../../lib/axios";

const API_URL = "/api/admin/flash-sale";

export const adminFlashSaleApiService = {
    getFlashSale: async () => {
        const response = await axiosInstance.get(API_URL);
        return response.data;
    },
    updateFlashSale: async (data: any) => {
        const response = await axiosInstance.put(API_URL, data);
        return response.data;
    },
};
