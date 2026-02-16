import axiosInstance from "@/lib/axios";

export const userProductService = {
    getProducts: async (params?: any) => {
        const response = await axiosInstance.get("/api/users/products", { params });
        return response.data;
    },
    getProductById: async (id: string) => {
        const response = await axiosInstance.get(`/api/users/products/${id}`);
        return response.data;
    },
    getProductsByIds: async (ids: string[]) => {
        const response = await axiosInstance.get("/api/users/products", { params: { ids: ids.join(',') } });
        return response.data;
    },
};
