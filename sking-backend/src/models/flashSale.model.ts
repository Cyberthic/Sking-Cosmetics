import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFlashSaleProduct {
    product: Types.ObjectId;
    offerPercentage: number;
}

export interface IFlashSale extends Document {
    products: IFlashSaleProduct[];
    startTime: Date;
    durationHours: number;
    isActive: boolean;
}

const FlashSaleSchema = new Schema<IFlashSale>(
    {
        products: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product" },
                offerPercentage: { type: Number, default: 0 }
            }
        ],
        startTime: { type: Date, required: true },
        durationHours: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const FlashSaleModel = mongoose.model<IFlashSale>("FlashSale", FlashSaleSchema);
