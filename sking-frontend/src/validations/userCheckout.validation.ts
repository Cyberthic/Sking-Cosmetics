import { z } from "zod";

export const checkoutSchema = z.object({
    addressId: z.string().min(1, "Please select a shipping address"),
    paymentMethod: z.enum(["online"]),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
