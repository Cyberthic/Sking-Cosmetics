import { z } from "zod";
import { Types } from "mongoose";

const variantSchema = z.object({
    name: z.string().min(1, "Variant name is required"),
    stock: z.number().int().min(0, "Stock cannot be negative"),
});

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        description: z.string().optional(),
        category: z.string().refine((val) => Types.ObjectId.isValid(val), "Invalid category ID"),
        price: z.number().positive("Price must be positive"),
        offer: z.number().min(0).max(99).optional().default(0),
        images: z.array(z.string().url()).min(4, "At least 4 images are required"),
        variants: z.array(variantSchema).min(1, "At least one variant is required"),
        isActive: z.boolean().optional().default(true),
    }),
});

export const updateProductSchema = z.object({
    body: z.object({
        name: z.string().min(3).optional(),
        description: z.string().optional(),
        category: z.string().refine((val) => Types.ObjectId.isValid(val), "Invalid category ID").optional(),
        price: z.number().positive().optional(),
        offer: z.number().min(0).max(99).optional(),
        images: z.array(z.string().url()).min(4).optional(),
        variants: z.array(variantSchema).min(1).optional(),
        isActive: z.boolean().optional(),
    }),
});
