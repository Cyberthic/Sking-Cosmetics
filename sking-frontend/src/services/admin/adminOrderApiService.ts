import axiosInstance from '../../lib/axios';

export const adminOrderService = {
    getOrders: async (params: { page?: number; limit?: number; search?: string; status?: string; sort?: string; orderType?: string }) => {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.search) query.append('search', params.search);
        if (params.status) query.append('status', params.status);
        if (params.orderType) query.append('orderType', params.orderType);
        if (params.sort) query.append('sort', params.sort);

        const response = await axiosInstance.get(`/api/admin/orders?${query.toString()}`);
        return response.data;
    },

    getOrderById: async (id: string) => {
        const response = await axiosInstance.get(`/api/admin/orders/${id}`);
        return response.data;
    },

    updateOrderStatus: async (id: string, status: string, isCritical?: boolean, message?: string) => {
        const response = await axiosInstance.patch(`/api/admin/orders/${id}/status`, { status, isCritical, message });
        return response.data;
    },

    confirmManualPayment: async (id: string, data: { upiTransactionId?: string; paymentScreenshot?: string }) => {
        const response = await axiosInstance.post(`/api/admin/orders/${id}/confirm-payment`, data);
        return response.data;
    }
};
