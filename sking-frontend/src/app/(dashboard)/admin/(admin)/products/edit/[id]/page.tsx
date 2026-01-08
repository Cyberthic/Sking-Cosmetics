"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { adminProductService } from "@/services/admin/adminProductApiService";

export default function EditProductPage() {
    const params = useParams();
    const id = params?.id as string;
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const data = await adminProductService.getProductById(id);
            if (data.success) {
                setProduct(data.product);
            }
        } catch (error) {
            console.error("Failed to fetch product", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!product) return <div className="p-6">Product not found</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Product</h1>
            <ProductForm initialData={product} isEdit />
        </div>
    );
}
