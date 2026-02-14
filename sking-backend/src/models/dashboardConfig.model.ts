import mongoose, { Schema, Document } from "mongoose";

export interface IDashboardConfig extends Document {
    month: number; // 1-12
    year: number;
    monthlyTarget: number;
    createdAt: Date;
    updatedAt: Date;
}

const DashboardConfigSchema: Schema = new Schema({
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    monthlyTarget: { type: Number, required: true, default: 0 }
}, {
    timestamps: true
});

// Compound index for unique month/year targets
DashboardConfigSchema.index({ month: 1, year: 1 }, { unique: true });

const DashboardConfig = mongoose.models.DashboardConfig || mongoose.model<IDashboardConfig>("DashboardConfig", DashboardConfigSchema);
export default DashboardConfig as mongoose.Model<IDashboardConfig>;
