import mongoose, { Schema, Document } from "mongoose";

export interface IOrderSettings extends Document {
    isOnlinePaymentEnabled: boolean;
    isWhatsappOrderingEnabled: boolean;
    whatsappNumber: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSettingsSchema: Schema = new Schema({
    isOnlinePaymentEnabled: { type: Boolean, default: true },
    isWhatsappOrderingEnabled: { type: Boolean, default: true },
    whatsappNumber: { type: String, default: "+918848886919" }
}, {
    timestamps: true
});

const OrderSettings = mongoose.models.OrderSettings || mongoose.model<IOrderSettings>("OrderSettings", OrderSettingsSchema);
export default OrderSettings as mongoose.Model<IOrderSettings>;
