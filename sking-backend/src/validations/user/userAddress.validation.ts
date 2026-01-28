import { z } from "zod";

export const addAddressSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        postalCode: z.string().length(6, "Postal code must be exactly 6 digits").regex(/^\d+$/, "Postal code must contain only digits"),
        country: z.string().min(1, "Country is required"),
        isPrimary: z.boolean().optional(),
        type: z.string().default("Home"),
    }),
});

export const updateAddressSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Address ID is required"),
    }),
    body: z.object({
        name: z.string().optional(),
        email: z.string().email("Invalid email address").optional(),
        phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").optional(),
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().length(6, "Postal code must be exactly 6 digits").regex(/^\d+$/, "Postal code must contain only digits").optional(),
        country: z.string().optional(),
        isPrimary: z.boolean().optional(),
        type: z.string().optional(),
    }),
});

export const addressIdSchema = z.object({
    params: z.object({
        id: z.string().min(1, "Address ID is required"),
    }),
});
