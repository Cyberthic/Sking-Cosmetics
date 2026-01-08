import axiosInstance from "@/lib/axios";

export const userCartService = {
    getCart: async () => {
        const response = await axiosInstance.get("/api/users/cart");
        return response.data;
    },
    addToCart: async (productId: string, variantName: string | undefined, quantity: number) => {
        const response = await axiosInstance.post("/api/users/cart/add", { productId, variantName, quantity });
        return response.data;
    },
    removeFromCart: async (productId: string, variantName?: string) => {
        const response = await axiosInstance.delete("/api/users/cart/remove", { data: { productId, variantName } });
        return response.data;
    },
    updateQuantity: async (productId: string, variantName: string | undefined, quantity: number) => {
        const response = await axiosInstance.put("/api/users/cart/update", { productId, variantName, quantity });
        return response.data;
    }
};
