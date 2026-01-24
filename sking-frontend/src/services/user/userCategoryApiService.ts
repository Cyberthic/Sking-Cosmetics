import axiosInstance from "@/lib/axios";

export const userCategoryService = {
    getCategories: async () => {
        const response = await axiosInstance.get("/api/users/categories");
        return response.data;
    }
};
