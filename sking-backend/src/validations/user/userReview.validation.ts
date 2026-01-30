import { z } from "zod";

export const createReviewSchema = z.object({
    body: z.object({
        productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
        orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid order ID"),
        rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
        comment: z.string().trim().min(10, "Comment must be at least 10 characters long"),
        images: z.array(z.string()).optional()
    })
});
