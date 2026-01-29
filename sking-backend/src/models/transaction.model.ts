import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
    user: mongoose.Types.ObjectId;
    order?: mongoose.Types.ObjectId;
    amount: number;
    type: 'credit' | 'debit';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod: 'online' | 'wallet' | 'refund';
    transactionId: string; // Gateway ID or generated ID
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    paymentMethod: { type: String, enum: ['online', 'wallet', 'refund'], required: true },
    transactionId: { type: String, required: true, unique: true },
    description: { type: String },
}, { timestamps: true });

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
