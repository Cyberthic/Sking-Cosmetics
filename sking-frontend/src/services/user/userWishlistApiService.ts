import axiosInstance from "@/lib/axios";

export const userWishlistService = {
    getWishlist: async () => {
        const response = await axiosInstance.get("/api/users/wishlist");
        return response.data;
    },
    toggleWishlist: async (productId: string) => {
        const response = await axiosInstance.post("/api/users/wishlist/toggle", { productId });
        return response.data;
    }
};
