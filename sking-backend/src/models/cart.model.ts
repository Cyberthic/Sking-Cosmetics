import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICartItem {
    product: Types.ObjectId;
    variantName?: string;
    quantity: number;
    price: number;
}

export interface ICart extends Document {
    user: Types.ObjectId;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

const CartSchema: Schema<ICart> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                variantName: { type: String },
                quantity: { type: Number, required: true, min: 1 },
            },
        ],
    },
    { timestamps: true }
);

export const CartModel: Model<ICart> = mongoose.model<ICart>("Cart", CartSchema);
