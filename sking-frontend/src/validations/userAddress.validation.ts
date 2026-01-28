import { z } from "zod";

export const addressSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    countryCode: z.string().min(1, "Country code is required"),
    phoneNumber: z.string()
        .length(10, "Phone number must be exactly 10 digits")
        .regex(/^\d+$/, "Phone number must contain only digits"),
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string()
        .length(6, "Postal code must be exactly 6 digits")
        .regex(/^\d+$/, "Postal code must contain only digits"),
    country: z.string().min(1, "Country is required"),
    isPrimary: z.boolean().optional(),
    type: z.enum(["Home", "Work", "Other"]).default("Home"),
});

export type AddressSchema = z.infer<typeof addressSchema>;
