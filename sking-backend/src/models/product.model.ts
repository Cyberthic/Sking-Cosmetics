import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IVariant {
    name: string;
    stock: number;
    price: number;
}

export interface IProduct extends Document {
    name: string;
    description: string;
    category: Types.ObjectId;
    price: number;
    offer: number; // Percentage 0-99
    images: string[];
    variants: IVariant[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        price: { type: Number, required: true },
        offer: { type: Number, default: 0, min: 0, max: 99 },
        images: [{ type: String }],
        variants: [
            {
                name: { type: String, required: true },
                stock: { type: Number, required: true, default: 0 },
                price: { type: Number, required: true, default: 0 },
            },
        ],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const ProductModel: Model<IProduct> = mongoose.model<IProduct>(
    "Product",
    ProductSchema
);
