import { z } from "zod";
import { Types } from "mongoose";

const variantSchema = z.object({
    size: z.string().min(1, "Variant size is required"),
    stock: z.number().int().min(0, "Stock cannot be negative"),
    price: z.number().positive("Variant price must be positive"),
});

const ingredientSchema = z.object({
    name: z.string().min(1, "Ingredient name is required"),
    description: z.string().min(1, "Ingredient description is required"),
});

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
        description: z.string().min(20, "Description must be at least 20 characters"),
        category: z.string().refine((val) => Types.ObjectId.isValid(val), "Invalid category ID"),
        price: z.number().positive("Price must be positive"),
        offerPercentage: z.number().min(0).max(99).optional().default(0),
        images: z.array(z.string().url()).min(4, "At least 4 images are required"),
        variants: z.array(variantSchema).min(1, "At least one variant is required"),
        ingredients: z.array(ingredientSchema).optional().default([]),
        howToUse: z.array(z.string().min(3, "Instruction step must be valid")).optional().default([]),
        isActive: z.boolean().optional().default(true),
    }),
});

export const updateProductSchema = z.object({
    body: z.object({
        name: z.string().min(3).optional(),
        shortDescription: z.string().min(10).optional(),
        description: z.string().min(20).optional(),
        category: z.string().refine((val) => Types.ObjectId.isValid(val), "Invalid category ID").optional(),
        price: z.number().positive().optional(),
        offerPercentage: z.number().min(0).max(99).optional(),
        images: z.array(z.string().url()).min(4).optional(),
        variants: z.array(variantSchema).min(1).optional(),
        ingredients: z.array(ingredientSchema).optional(),
        howToUse: z.array(z.string().min(3)).optional(),
        isActive: z.boolean().optional(),
    }),
});
