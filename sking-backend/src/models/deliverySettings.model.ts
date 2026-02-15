
import mongoose, { Schema, Document } from "mongoose";

export interface IDeliverySettings extends Document {
    deliveryCharge: number;
    freeShippingThreshold: number;
    updatedAt: Date;
}

const DeliverySettingsSchema: Schema = new Schema({
    deliveryCharge: { type: Number, required: true, default: 49 },
    freeShippingThreshold: { type: Number, required: true, default: 1000 }
}, { timestamps: true });

// Ensure only one document exists
DeliverySettingsSchema.index({}, { unique: true });

export default mongoose.model<IDeliverySettings>("DeliverySettings", DeliverySettingsSchema);
