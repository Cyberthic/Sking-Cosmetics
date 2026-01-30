import axiosInstance from "@/lib/axios";

export interface ICreateReviewData {
    productId: string;
    orderId: string;
    rating: number;
    comment: string;
    images?: string[];
}

export const userReviewApiService = {
    getProductReviews: async (productId: string, page: number = 1, limit: number = 4, sort: string = 'newest') => {
        const response = await axiosInstance.get(`/api/users/reviews/product/${productId}?page=${page}&limit=${limit}&sort=${sort}`);
        return response.data;
    },

    checkCanReview: async (productId: string, orderId?: string) => {
        const url = `/api/users/reviews/check-can-review?productId=${productId}${orderId ? `&orderId=${orderId}` : ''}`;
        const response = await axiosInstance.get(url);
        return response.data;
    },

    createReview: async (data: ICreateReviewData) => {
        const response = await axiosInstance.post('/api/users/reviews', data);
        return response.data;
    }
};
