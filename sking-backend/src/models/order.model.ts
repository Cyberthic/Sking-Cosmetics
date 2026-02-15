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
    isCritical?: boolean;
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
    paymentMethod: "online" | "whatsapp";
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
    manualPaymentDetails?: {
        upiTransactionId?: string;
        paymentScreenshot?: string;
        verifiedAt?: Date;
        verifiedBy?: string; // Admin ID or Name
    };

    // Coupon fields
    coupon?: mongoose.Types.ObjectId;
    discountCode?: string;
    discountAmount: number;

    // Display IDs
    displayId: string;
    whatsappOptIn: boolean;

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
    paymentMethod: { type: String, enum: ["online", "whatsapp"], default: "online" },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed", "refunded", "expired", "cancelled"], default: "pending" },
    orderStatus: { type: String, enum: ["payment_pending", "processing", "shipped", "delivered", "cancelled"], default: "payment_pending" },
    paymentExpiresAt: { type: Date, required: true },
    paymentDetails: {
        gatewayOrderId: { type: String },
        gatewayPaymentId: { type: String },
        gatewaySignature: { type: String },
        paymentGateway: { type: String },
        paidAt: { type: Date }
    },
    manualPaymentDetails: {
        upiTransactionId: { type: String },
        paymentScreenshot: { type: String },
        verifiedAt: { type: Date },
        verifiedBy: { type: String }
    },

    coupon: { type: Schema.Types.ObjectId, ref: "Coupon" },
    discountCode: { type: String },
    discountAmount: { type: Number, default: 0 },

    displayId: { type: String, required: true, unique: true },
    whatsappOptIn: { type: Boolean, default: true },

    statusHistory: [
        {
            status: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            message: { type: String },
            isCritical: { type: Boolean, default: false }
        }
    ]
}, { timestamps: true });

export default mongoose.model<IOrder>("Order", OrderSchema);
