"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

interface FeaturedProductsProps {
    data: any[];
}

const FeaturedProducts = ({ data }: FeaturedProductsProps) => {
    // If no data, the fallback has already been handled in the service/page level
    if (!data || data.length === 0) return null;

    return (
        <section className="py-16 bg-white">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-bold uppercase text-black">
                        Featured Products
                    </h2>
                    <Link href="/shop" className="text-sking-pink font-bold hover:underline">
                        View All
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {data.slice(0, 10).map((product) => (
                        <Link href={`/product/${product.slug}`} key={product._id} className="group flex flex-col">
                            {/* Image */}
                            <div className="relative h-64 w-full bg-white border border-gray-100 rounded-xl overflow-hidden mb-4 p-4 flex items-center justify-center">
                                <Image
                                    src={product.images?.[0] || ""}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">{product.category?.name || "SKINCARE"}</span>
                                <h3 className="font-bold text-sm truncate text-black">{product.name}</h3>

                                <div className="mt-1">
                                    <span className="font-bold text-lg">₹{product.price}</span>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mt-1">
                                    <div className="flex text-sking-pink">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={10} fill="currentColor" />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-gray-400">({product.soldCount || 0} Sold)</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
