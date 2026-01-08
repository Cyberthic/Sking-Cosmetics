import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
    name: string;
    description: string;
    offer: number; // Percentage 0-99
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema: Schema<ICategory> = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, default: "" },
        offer: { type: Number, default: 0, min: 0, max: 99 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const CategoryModel: Model<ICategory> = mongoose.model<ICategory>(
    "Category",
    CategorySchema
);
