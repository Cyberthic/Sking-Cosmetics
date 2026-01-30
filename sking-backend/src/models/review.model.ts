import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    user?: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    order?: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    images?: string[];
    isVerified: boolean;
    isBlocked: boolean;
    isPinned: boolean;
    isAdminReview: boolean;
    blockedUntil?: Date;
    blockReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: false },
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        order: { type: Schema.Types.ObjectId, ref: "Order", required: false },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        images: [{ type: String }],
        isVerified: { type: Boolean, default: true },
        isBlocked: { type: Boolean, default: false },
        isPinned: { type: Boolean, default: false },
        isAdminReview: { type: Boolean, default: false },
        blockedUntil: { type: Date },
        blockReason: { type: String },
    },
    { timestamps: true }
);

// Index for getting reviews for a product faster
ReviewSchema.index({ product: 1, createdAt: -1 });
// Index for checking if user already reviewed a product for an order
ReviewSchema.index({ user: 1, product: 1, order: 1 }, { unique: true });

export default mongoose.model<IReview>("Review", ReviewSchema);
