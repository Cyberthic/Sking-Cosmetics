import mongoose, { Schema, Document, Model, Types } from "mongoose";

/* ---------- Variant Interface ---------- */
export interface IVariant {
    size: string;           // e.g. 30ml, 50ml, Small, Medium
    stock: number;
    reservedStock: number;
    price: number;
}

/* ---------- Ingredient Interface ---------- */
export interface IIngredient {
    name: string;
    description: string;
}

/* ---------- Product Interface ---------- */
export interface IProduct extends Document {
    name: string;
    slug: string; // Add slug
    shortDescription: string;
    description: string;
    category: Types.ObjectId;

    price: number;                 // Base price
    offerPercentage: number;       // 0–99
    images: string[];

    variants: IVariant[];

    ingredients: IIngredient[];
    howToUse: string[];

    soldCount: number;
    reviewsCount: number;

    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/* ---------- Product Schema ---------- */
const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        slug: { type: String, unique: true, index: true }, // Add slug field

        shortDescription: { type: String, required: true },
        description: { type: String, required: true },

        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        price: { type: Number, required: true },

        offerPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 99,
        },

        images: [{ type: String, required: true }],

        /* ----- Variants (Size-wise stock & price) ----- */
        variants: [
            {
                size: { type: String, required: true },
                stock: { type: Number, default: 0 },
                reservedStock: { type: Number, default: 0 },
                price: { type: Number, required: true },
            },
        ],

        /* ----- Ingredients (key-value like) ----- */
        ingredients: [
            {
                name: { type: String, required: true },
                description: { type: String, required: true },
            },
        ],

        /* ----- How to Use (Steps) ----- */
        howToUse: [{ type: String, required: true }],

        soldCount: { type: Number, default: 0 },
        reviewsCount: { type: Number, default: 0 },

        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

/* ---------- Virtual: Offer Price ---------- */
ProductSchema.virtual("offerPrice").get(function () {
    return Math.round(
        this.price - (this.price * this.offerPercentage) / 100
    );
});

/* ---------- Ensure Virtuals in Response ---------- */
ProductSchema.set("toJSON", { virtuals: true });
ProductSchema.set("toObject", { virtuals: true });

export const ProductModel: Model<IProduct> =
    mongoose.model<IProduct>("Product", ProductSchema);
