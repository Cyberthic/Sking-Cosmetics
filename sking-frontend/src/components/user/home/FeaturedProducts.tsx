"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

const featuredProducts = [
    {
        id: 1,
        name: "Dewy Finish Foundation",
        category: "MAKEUP",
        price: 39.99,
        reviews: 369,
        image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Pro-Blend Makeup Brushes",
        category: "MAKEUP TOOLS",
        price: 29.99,
        reviews: 15400,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Organic Facial Cleanser",
        category: "SKINCARE",
        price: 19.99,
        reviews: 120,
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Nourishing Hair Mask",
        category: "HAIRCARE",
        price: 24.99,
        reviews: 691,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 5,
        name: "Bold Matte Lipstick",
        category: "MAKEUP",
        price: 14.99,
        reviews: 793,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062dc?q=80&w=800&auto=format&fit=crop"
    }
];

const FeaturedProducts = () => {
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
                    {featuredProducts.map((product) => (
                        <div key={product.id} className="group flex flex-col">
                            {/* Image */}
                            <div className="relative h-64 w-full bg-white border border-gray-100 rounded-xl overflow-hidden mb-4 p-4 flex items-center justify-center">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">{product.category}</span>
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
                                    <span className="text-[10px] text-gray-400">({product.reviews} Sold)</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
