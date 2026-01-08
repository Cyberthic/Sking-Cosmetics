import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IWishlist extends Document {
    user: Types.ObjectId;
    products: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const WishlistSchema: Schema<IWishlist> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    },
    { timestamps: true }
);

export const WishlistModel: Model<IWishlist> = mongoose.model<IWishlist>("Wishlist", WishlistSchema);
