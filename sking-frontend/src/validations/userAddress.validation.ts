import { z } from "zod";

export const addressSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
    isPrimary: z.boolean().optional(),
    type: z.enum(["Home", "Work", "Other"]).default("Home"),
});

export type AddressSchema = z.infer<typeof addressSchema>;
