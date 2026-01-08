import axiosInstance from '../../lib/axios';

const API_URL = '/admin/categories'; // Matches backend mounting

interface CategoryData {
    name: string;
    description?: string;
    offer?: number;
    isActive?: boolean;
}

export const adminCategoryService = {
    getCategories: async (page: number = 1, limit: number = 10, search: string = '') => {
        const response = await axiosInstance.get(`${API_URL}?page=${page}&limit=${limit}&search=${search}`);
        return response.data;
    },

    getCategoryById: async (id: string) => {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    },

    createCategory: async (data: CategoryData) => {
        const response = await axiosInstance.post(API_URL, data);
        return response.data;
    },

    updateCategory: async (id: string, data: Partial<CategoryData>) => {
        const response = await axiosInstance.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    deleteCategory: async (id: string) => {
        const response = await axiosInstance.delete(`${API_URL}/${id}`);
        return response.data;
    },
};
