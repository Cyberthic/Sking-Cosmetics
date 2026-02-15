
import axiosInstance from '../../lib/axios';

export const adminDeliveryService = {
    getDeliverySettings: async () => {
        const response = await axiosInstance.get('/api/admin/delivery-settings');
        return response.data;
    },

    updateDeliverySettings: async (deliveryCharge: number, freeShippingThreshold: number) => {
        const response = await axiosInstance.put('/api/admin/delivery-settings', { deliveryCharge, freeShippingThreshold });
        return response.data;
    }
};
