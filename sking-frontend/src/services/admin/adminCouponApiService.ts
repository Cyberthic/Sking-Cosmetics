import axiosInstance from '../../lib/axios';

export const adminCouponService = {
    create: async (data: any) => {
        const response = await axiosInstance.post('/api/admin/coupons', data);
        return response.data;
    },

    getCoupons: async (params: { page?: number; limit?: number; search?: string; status?: string; sort?: string }) => {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.search) query.append('search', params.search);
        if (params.status) query.append('status', params.status);
        if (params.sort) query.append('sort', params.sort);

        const response = await axiosInstance.get(`/api/admin/coupons?${query.toString()}`);
        return response.data;
    },

    getCouponById: async (id: string) => {
        const response = await axiosInstance.get(`/api/admin/coupons/${id}`);
        return response.data;
    },

    update: async (id: string, data: any) => {
        const response = await axiosInstance.put(`/api/admin/coupons/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await axiosInstance.delete(`/api/admin/coupons/${id}`);
        return response.data;
    },

    getCouponOrders: async (id: string, page: number = 1, limit: number = 10) => {
        const response = await axiosInstance.get(`/api/admin/coupons/${id}/orders?page=${page}&limit=${limit}`);
        return response.data;
    },

    getCouponStats: async (id: string) => {
        const response = await axiosInstance.get(`/api/admin/coupons/${id}/stats`);
        return response.data;
    }
};
