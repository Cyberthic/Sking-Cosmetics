import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFeaturedProduct extends Document {
    products: Types.ObjectId[];
}

const FeaturedProductSchema = new Schema<IFeaturedProduct>(
    {
        products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    },
    { timestamps: true }
);

export const FeaturedProductModel = mongoose.model<IFeaturedProduct>(
    "FeaturedProduct",
    FeaturedProductSchema
);
