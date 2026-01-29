import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICoupon extends Document {
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderAmount: number;
    maxDiscountAmount?: number; // Only for percentage
    startDate: Date;
    endDate: Date;
    usageLimit: number; // Total usage limit
    usageCount: number; // Current usage count
    userLimit: number; // Limit per user
    couponType: 'all' | 'new_users' | 'specific_users' | 'specific_products' | 'registered_after';
    specificUsers: Types.ObjectId[];
    specificProducts: Types.ObjectId[];
    registeredAfter?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CouponSchema: Schema = new Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, required: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 0 }, // 0 means unlimited
    usageCount: { type: Number, default: 0 },
    userLimit: { type: Number, default: 1 },
    couponType: { type: String, enum: ['all', 'new_users', 'specific_users', 'specific_products', 'registered_after'], default: 'all' },
    specificUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    specificProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    registeredAfter: { type: Date },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<ICoupon>("Coupon", CouponSchema);
