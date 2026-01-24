"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { adminProductService } from "@/services/admin/adminProductApiService";
import Button from "@/components/admin/ui/button/Button";
import Badge from "@/components/admin/ui/badge/Badge";

export default function ProductDetailPage() {
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

    const finalPrice = product.offerPercentage > 0
        ? product.price - (product.price * (product.offerPercentage / 100))
        : product.price;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{product.name}</h1>
                    <div className="flex items-center gap-3">
                        <Badge color={product.isActive ? "success" : "error"}>
                            {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-gray-500 text-sm">ID: {product._id}</span>
                        <span className="text-gray-500 text-sm">Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" href="/admin/products">Back to List</Button>
                    <Button href={`/admin/products/edit/${product._id}`}>Edit Product</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Images */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="aspect-square relative rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                        {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                        )}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {product.images?.map((img: string, idx: number) => (
                            <div key={idx} className="aspect-square relative rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
                                <Image src={img} alt={`Product ${idx}`} fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle Column - Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Key Info */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Product Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Base Price</label>
                                <div className="text-xl font-bold text-gray-800 dark:text-white">₹{product.price}</div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Applied Offer</label>
                                <div className="text-xl font-bold text-green-600">{product.offerPercentage}% OFF</div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Final Base Price</label>
                                <div className="text-xl font-bold text-brand-600">₹{finalPrice.toFixed(2)}</div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Category</label>
                                <div className="text-base font-medium text-gray-800 dark:text-white">
                                    {typeof product.category === 'object' ? product.category.name : 'Unknown'}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="block text-xs text-gray-500 mb-1">Short Description</label>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{product.shortDescription || "N/A"}</p>

                            <label className="block text-xs text-gray-500 mb-1">Description</label>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                        </div>

                        {/* Ingredients & How to Use */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Ingredients</label>
                                {product.ingredients && product.ingredients.length > 0 ? (
                                    <ul className="text-sm list-disc pl-4 text-gray-600 dark:text-gray-300">
                                        {product.ingredients.map((ing: any, i: number) => (
                                            <li key={i}><span className="font-semibold">{ing.name}</span>: {ing.description}</li>
                                        ))}
                                    </ul>
                                ) : <p className="text-sm text-gray-400">No ingredients listed</p>}
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">How To Use</label>
                                {product.howToUse && product.howToUse.length > 0 ? (
                                    <ol className="text-sm list-decimal pl-4 text-gray-600 dark:text-gray-300">
                                        {product.howToUse.map((step: string, i: number) => (
                                            <li key={i}>{step}</li>
                                        ))}
                                    </ol>
                                ) : <p className="text-sm text-gray-400">No instructions listed</p>}
                            </div>
                        </div>
                    </div>

                    {/* Variants Table */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Variants & Stock</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-800">
                                        <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Volume/Size</th>
                                        <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Price (₹)</th>
                                        <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
                                        <th className="pb-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {product.variants?.map((v: any, idx: number) => (
                                        <tr key={idx}>
                                            <td className="py-3 text-sm font-medium text-gray-800 dark:text-white">{v.size || v.name}</td>
                                            <td className="py-3 text-sm text-gray-600 dark:text-gray-300">₹{v.price || 0}</td>
                                            <td className="py-3 text-sm text-gray-600 dark:text-gray-300">{v.stock}</td>
                                            <td className="py-3">
                                                <Badge size="sm" color={v.stock > 0 ? "success" : "error"}>
                                                    {v.stock > 0 ? "In Stock" : "Out of Stock"}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Metrics (Placeholders) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
                            <div className="text-blue-600 dark:text-blue-400 font-medium mb-1">Total Sales</div>
                            <div className="text-2xl font-bold text-gray-800 dark:text-white">0</div>
                            <div className="text-xs text-gray-500 mt-1">Units sold</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border border-green-100 dark:border-green-800">
                            <div className="text-green-600 dark:text-green-400 font-medium mb-1">Total Revenue</div>
                            <div className="text-2xl font-bold text-gray-800 dark:text-white">₹0</div>
                            <div className="text-xs text-gray-500 mt-1">Lifetime earnings</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
