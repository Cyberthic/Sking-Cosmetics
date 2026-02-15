"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react";

interface NewInStoreProps {
    products: any[];
}

const NewInStore = ({ products }: NewInStoreProps) => {
    const [quantity, setQuantity] = useState(1);

    const displayProducts = products.length > 0 ? products.slice(0, 6) : [];
    const featuredProduct = products.length > 6 ? products[6] : (products.length > 0 ? products[0] : null);

    if (!displayProducts.length) return null;

    return (
        <section className="py-24 bg-gray-50/50">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                            NEW IN <span className="text-sking-pink italic">STORE</span>
                        </h2>
                        <p className="text-gray-500 mt-2 font-medium">Discover our latest arrivals and fresh additions.</p>
                    </div>
                    <Link href="/shop" className="text-sking-pink font-black text-lg hover:underline underline-offset-8">
                        View All Collections
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left Grid (2/3 width) */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
                        {displayProducts.map((product) => (
                            <Link href={`/product/${product.slug}`} key={product._id} className="group flex flex-col">
                                <div className="relative h-64 w-full bg-white rounded-[2rem] overflow-hidden mb-5 p-6 flex items-center justify-center border border-gray-100 group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-500">
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                                    />
                                    {product.offerPercentage > 0 && (
                                        <div className="absolute top-4 left-4 bg-sking-pink text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                                            -{product.offerPercentage}%
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 px-1">
                                    <span className="text-[10px] text-sking-pink font-black uppercase tracking-widest">{product.category?.name || "SKING"}</span>
                                    <h3 className="font-bold text-base text-gray-900 line-clamp-2 leading-tight h-10 group-hover:text-sking-pink transition-colors">{product.name}</h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex flex-col">
                                            <span className="font-black text-xl text-gray-900">₹{product.offerPercentage > 0 ? Math.round(product.price * (1 - product.offerPercentage / 100)) : product.price}</span>
                                            {product.offerPercentage > 0 && <span className="text-xs text-gray-400 line-through font-medium">₹{product.price}</span>}
                                        </div>
                                        <div className="flex text-sking-pink">
                                            <Star size={10} fill="currentColor" />
                                            <Star size={10} fill="currentColor" />
                                            <Star size={10} fill="currentColor" />
                                            <Star size={10} fill="currentColor" />
                                            <Star size={10} fill="currentColor" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Right Featured Card (1/3 width) */}
                    {featuredProduct && (
                        <div className="w-full lg:w-[450px] bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 p-8 flex flex-col hover:shadow-sking-pink/5 transition-all duration-500">

                            <div className="flex items-center justify-between mb-8">
                                <span className="bg-gray-900 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">Editor&apos;s Pick</span>
                                <button className="text-gray-400 hover:text-sking-pink transition-colors"><Heart size={24} /></button>
                            </div>

                            {/* Main Image */}
                            <div className="relative w-full h-80 mb-8 p-10 bg-gray-50 rounded-[2.5rem] overflow-hidden group/feat">
                                <Image
                                    src={featuredProduct.images[0]}
                                    alt={featuredProduct.name}
                                    fill
                                    className="object-contain p-8 group-hover/feat:scale-110 transition-transform duration-700"
                                />
                            </div>

                            {/* Product Details */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <span className="text-xs font-black text-sking-pink uppercase tracking-[0.2em]">{featuredProduct.category?.name || "PREMIUM"}</span>
                                    <h3 className="text-3xl font-black text-gray-900 leading-tight">{featuredProduct.name}</h3>
                                    <div className="flex items-center gap-4 pt-2">
                                        <span className="text-4xl font-black text-gray-900">₹{featuredProduct.offerPercentage > 0 ? Math.round(featuredProduct.price * (1 - featuredProduct.offerPercentage / 100)) : featuredProduct.price}</span>
                                        {featuredProduct.offerPercentage > 0 && <span className="text-lg text-gray-400 line-through font-bold">₹{featuredProduct.price}</span>}
                                    </div>
                                </div>

                                {/* Stock & Info */}
                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                                    {featuredProduct.shortDescription || "Experience the pinnacle of skincare excellence with our latest premium selection. Crafted for perfection and glowing results."}
                                </p>

                                {/* Actions */}
                                <div className="pt-4 space-y-4">
                                    <Link
                                        href={`/product/${featuredProduct.slug}`}
                                        className="w-full py-5 bg-gray-900 text-white font-black text-sm uppercase rounded-[2rem] hover:bg-sking-pink transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                                    >
                                        <ShoppingBag size={20} /> VIEW PRODUCT DETAILS
                                    </Link>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="py-4 border border-gray-100 rounded-2xl font-bold text-xs uppercase hover:bg-gray-50 transition-all">Add to Wishlist</button>
                                        <button className="py-4 border border-gray-100 rounded-2xl font-bold text-xs uppercase hover:bg-gray-50 transition-all">Quick View</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default NewInStore;
