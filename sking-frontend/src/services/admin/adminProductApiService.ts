import axiosInstance from '../../lib/axios';

const API_URL = '/api/admin/products';

interface Variant {
    size: string;
    stock: number;
    price: number;
}

interface Ingredient {
    name: string;
    description: string;
}

interface ProductData {
    name: string;
    shortDescription: string;
    description: string;
    category: string;
    price: number;
    offerPercentage?: number;
    images: string[];
    variants: Variant[];
    ingredients?: Ingredient[];
    howToUse?: string[];
    isActive?: boolean;
}

export const adminProductService = {
    getProducts: async (page: number = 1, limit: number = 10, search: string = '', categoryId: string = '', sortBy: string = '') => {
        const response = await axiosInstance.get(`${API_URL}?page=${page}&limit=${limit}&search=${search}&category=${categoryId}&sortBy=${sortBy}`);
        return response.data;
    },

    getProductOrders: async (id: string, page: number = 1, limit: number = 10) => {
        const response = await axiosInstance.get(`${API_URL}/${id}/orders?page=${page}&limit=${limit}`);
        return response.data;
    },

    getProductStats: async (id: string) => {
        const response = await axiosInstance.get(`${API_URL}/${id}/stats`);
        return response.data;
    },

    getProductById: async (id: string) => {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    },

    createProduct: async (data: ProductData) => {
        const response = await axiosInstance.post(API_URL, data);
        return response.data;
    },

    updateProduct: async (id: string, data: Partial<ProductData>) => {
        const response = await axiosInstance.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    toggleProductStatus: async (id: string) => {
        const response = await axiosInstance.patch(`${API_URL}/${id}/toggle-status`);
        return response.data;
    },

    uploadProductImage: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await axiosInstance.post(`${API_URL}/upload-image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};
