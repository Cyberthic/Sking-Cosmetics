import axiosInstance from "@/lib/axios";

export const userHomeService = {
    getHomeData: async () => {
        const response = await axiosInstance.get("/api/users/home");
        return response.data;
    },
};
