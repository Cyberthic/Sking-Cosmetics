import axiosInstance from '../../lib/axios';

export const adminTransactionService = {
    getTransactions: async (params: { page?: number; limit?: number; search?: string; status?: string; type?: string; sort?: string }) => {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.search) query.append('search', params.search);
        if (params.status) query.append('status', params.status);
        if (params.type) query.append('type', params.type);
        if (params.sort) query.append('sort', params.sort);

        const response = await axiosInstance.get(`/api/admin/transactions?${query.toString()}`);
        return response.data;
    },

    getTransactionById: async (id: string) => {
        const response = await axiosInstance.get(`/api/admin/transactions/${id}`);
        return response.data;
    }
};
