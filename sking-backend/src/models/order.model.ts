import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    variantName?: string;
    quantity: number;
    price: number;
}

export interface IStatusHistory {
    status: string;
    timestamp: Date;
    message?: string;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    shippingFee: number;
    finalAmount: number;
    shippingAddress: {
        name: string;
        email: string;
        phoneNumber: string;
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        addressType?: string;
    };
    paymentMethod: "online";
    paymentStatus: "pending" | "completed" | "failed" | "refunded" | "expired";
    orderStatus: "payment_pending" | "processing" | "shipped" | "delivered" | "cancelled";
    paymentExpiresAt: Date;
    paymentDetails?: {
        gatewayOrderId?: string;
        gatewayPaymentId?: string;
        gatewaySignature?: string;
        paymentGateway?: string;
        paidAt?: Date;
    };
    statusHistory: IStatusHistory[];
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variantName: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
});

const OrderSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    finalAmount: { type: Number, required: true },
    shippingAddress: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true },
        addressType: { type: String }
    },
    paymentMethod: { type: String, enum: ["online"], default: "online" },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed", "refunded", "expired"], default: "pending" },
    orderStatus: { type: String, enum: ["payment_pending", "processing", "shipped", "delivered", "cancelled"], default: "payment_pending" },
    paymentExpiresAt: { type: Date, required: true },
    paymentDetails: {
        gatewayOrderId: { type: String },
        gatewayPaymentId: { type: String },
        gatewaySignature: { type: String },
        paymentGateway: { type: String },
        paidAt: { type: Date }
    },
    statusHistory: [
        {
            status: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            message: { type: String }
        }
    ]
}, { timestamps: true });

export default mongoose.model<IOrder>("Order", OrderSchema);
