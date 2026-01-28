import axiosInstance from '../../lib/axios';
import { AddressSchema } from '../../validations/userAddress.validation';

const API_URL = '/api/users/address';

export interface Address extends AddressSchema {
    _id: string;
    createdAt?: string;
    updatedAt?: string;
}

export const userAddressService = {
    getAllAddresses: async () => {
        const response = await axiosInstance.get(`${API_URL}`);
        return response.data;
    },

    getAddress: async (id: string) => {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    },

    addAddress: async (data: AddressSchema) => {
        const response = await axiosInstance.post(`${API_URL}`, data);
        return response.data;
    },

    updateAddress: async (id: string, data: Partial<AddressSchema>) => {
        const response = await axiosInstance.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    deleteAddress: async (id: string) => {
        const response = await axiosInstance.delete(`${API_URL}/${id}`);
        return response.data;
    },

    setPrimaryAddress: async (id: string) => {
        const response = await axiosInstance.patch(`${API_URL}/${id}/primary`);
        return response.data;
    }
};
