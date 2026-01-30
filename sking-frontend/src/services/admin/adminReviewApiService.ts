import axiosInstance from "@/lib/axios";

export const adminReviewService = {
    getAllReviews: async (params: any) => {
        const response = await axiosInstance.get("/api/admin/reviews", { params });
        return response.data;
    },

    getReviewById: async (id: string) => {
        const response = await axiosInstance.get(`/api/admin/reviews/${id}`);
        return response.data;
    },

    blockReview: async (data: { reviewId: string; duration?: string; reason?: string }) => {
        const response = await axiosInstance.post("/api/admin/reviews/block", data);
        return response.data;
    },

    unblockReview: async (id: string) => {
        const response = await axiosInstance.patch(`/api/admin/reviews/unblock/${id}`);
        return response.data;
    },

    deleteReview: async (id: string) => {
        const response = await axiosInstance.delete(`/api/admin/reviews/${id}`);
        return response.data;
    },

    getReviewsByProduct: async (productId: string, params: any) => {
        const response = await axiosInstance.get(`/api/admin/reviews/product/${productId}`, { params });
        return response.data;
    },

    getReviewsByUser: async (userId: string, params: any) => {
        const response = await axiosInstance.get(`/api/admin/reviews/user/${userId}`, { params });
        return response.data;
    },

    togglePin: async (id: string) => {
        const response = await axiosInstance.patch(`/api/admin/reviews/${id}/pin`);
        return response.data;
    },

    createReview: async (data: any) => {
        const response = await axiosInstance.post("/api/admin/reviews", data);
        return response.data;
    }
};
