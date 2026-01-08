import { z } from "zod";
import { Types } from "mongoose";

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(3, "Name must be at least 3 characters").max(50),
        description: z.string().optional(),
        offer: z.number().min(0).max(99).optional().default(0),
        isActive: z.boolean().optional().default(true),
    }),
});

export const updateCategorySchema = z.object({
    body: z.object({
        name: z.string().min(3).max(50).optional(),
        description: z.string().optional(),
        offer: z.number().min(0).max(99).optional(),
        isActive: z.boolean().optional(),
    }),
});

export const addCategoryOfferSchema = z.object({
    body: z.object({
        offer: z.number().min(1).max(99)
    })
})
