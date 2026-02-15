import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFlashSale extends Document {
    products: Types.ObjectId[];
    startTime: Date;
    durationHours: number;
    isActive: boolean;
}

const FlashSaleSchema = new Schema<IFlashSale>(
    {
        products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
        startTime: { type: Date, required: true },
        durationHours: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const FlashSaleModel = mongoose.model<IFlashSale>("FlashSale", FlashSaleSchema);
