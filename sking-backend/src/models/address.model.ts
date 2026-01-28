import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAddress extends Document {
    user: Types.ObjectId;
    name: string;
    email: string;
    phoneNumber: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isPrimary: boolean;
    type: string; // Home, Work, etc.
}

const AddressSchema: Schema<IAddress> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
        type: { type: String, default: "Home" }
    },
    { timestamps: true }
);

export const AddressModel: Model<IAddress> = mongoose.model<IAddress>(
    "Address",
    AddressSchema
);
