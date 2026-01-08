"use client";
import React from "react";
import { ProductForm } from "../../../../../../components/admin/products/ProductForm";

export default function AddProductPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add Product</h1>
            <ProductForm />
        </div>
    );
}
