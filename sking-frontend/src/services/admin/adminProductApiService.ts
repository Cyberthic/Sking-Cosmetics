import axiosInstance from '../../lib/axios';

const API_URL = '/admin/products';

interface Variant {
    name: string;
    stock: number;
}

interface ProductData {
    name: string;
    description?: string;
    category: string;
    price: number;
    offer?: number;
    images: string[];
    variants: Variant[];
    isActive?: boolean;
}

export const adminProductService = {
    getProducts: async (page: number = 1, limit: number = 10, search: string = '', categoryId: string = '') => {
        const response = await axiosInstance.get(`${API_URL}?page=${page}&limit=${limit}&search=${search}&category=${categoryId}`);
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

    deleteProduct: async (id: string) => {
        const response = await axiosInstance.delete(`${API_URL}/${id}`);
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
