import { z } from "zod";

export const createCouponSchema = z.object({
    code: z
        .string()
        .min(3, "Code must be at least 3 characters")
        .regex(/^[A-Z0-9]+$/, "Code must be uppercase alphanumeric"),
    description: z.string().min(1, "Description is required"),
    discountType: z.enum(["percentage", "fixed"], {
        errorMap: () => ({ message: "Invalid discount type" }),
    }),
    discountValue: z.coerce.number().min(0, "Value cannot be negative"),
    minOrderAmount: z.coerce.number().min(0, "Amount cannot be negative").optional(),
    maxDiscountAmount: z.coerce.number().min(0, "Amount cannot be negative").nullable().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    isActive: z.boolean().default(true),
    usageLimit: z.coerce.number().min(0, "Limit cannot be negative").optional(),
    userLimit: z.coerce.number().min(1, "User limit must be at least 1").optional(),
    couponType: z.enum(
        ["all", "new_users", "specific_users", "specific_products", "registered_after"],
        { errorMap: () => ({ message: "Invalid coupon type" }) }
    ),
    registeredAfter: z.string().optional(),
    specificUsers: z.array(z.string()).optional(),
    specificProducts: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
    if (data.couponType === 'registered_after' && !data.registeredAfter) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Registration date is required",
            path: ["registeredAfter"],
        });
    }

    if (data.couponType === 'specific_users' && (!data.specificUsers || data.specificUsers.length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Select at least one user",
            path: ["specificUsers"],
        });
    }

    if (data.couponType === 'specific_products' && (!data.specificProducts || data.specificProducts.length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Select at least one product",
            path: ["specificProducts"],
        });
    }

    if (data.discountType === 'percentage') {
        if (data.discountValue <= 0 || data.discountValue >= 100) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Percentage must be between 1 and 99",
                path: ["discountValue"],
            });
        }
        if (data.maxDiscountAmount && data.minOrderAmount && data.minOrderAmount <= data.maxDiscountAmount) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Minimum order must be greater than max discount",
                path: ["minOrderAmount"],
            });
        }
    }

    if (data.discountType === 'fixed') {
        if (data.minOrderAmount && data.discountValue >= data.minOrderAmount) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Discount must be less than minimum order amount",
                path: ["discountValue"],
            });
        }
    }

    if (data.startDate && data.endDate && new Date(data.endDate) <= new Date(data.startDate)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date must be after start date",
            path: ["endDate"],
        });
    }
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
