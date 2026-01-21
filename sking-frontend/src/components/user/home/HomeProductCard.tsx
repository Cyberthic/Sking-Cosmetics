"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface ProductProps {
    _id: string;
    name: string;
    price: number;
    offer?: number;
    images: string[];
    rating?: number;
    reviewCount?: number;
}

const HomeProductCard = ({ product }: { product: ProductProps }) => {
    const finalPrice = product.offer
        ? product.price - (product.price * (product.offer / 100))
        : product.price;

    return (
        <div className="group relative w-full flex flex-col">
            <Link href={`/product/${product._id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                {product.images?.[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                        No Image
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.offer && product.offer > 0 && (
                        <span className="bg-sking-red text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
                            -{product.offer}%
                        </span>
                    )}
                    {/* Mock Best Seller Badge if relevant */}
                    {product.rating && product.rating >= 4.5 && (
                        <span className="bg-black text-white text-xs font-bold px-3 py-1 uppercase tracking-widest">
                            Bestseller
                        </span>
                    )}
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="w-full bg-black text-white font-bold py-3 uppercase tracking-widest text-sm hover:bg-sking-red transition-colors">
                        Add to Cart
                    </button>
                </div>
            </Link>

            <div className="flex flex-col gap-1 items-start">
                <div className="flex items-center gap-1 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={14} fill={star <= (product.rating || 4) ? "currentColor" : "none"} stroke="currentColor" />
                    ))}
                    <span className="text-gray-400 text-xs ml-1">({product.reviewCount || 120})</span>
                </div>
                <Link href={`/product/${product._id}`} className="font-bold text-lg text-black hover:text-sking-red transition-colors line-clamp-1">
                    {product.name}
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-black font-bold text-lg">₹{Math.floor(finalPrice)}</span>
                    {product.offer && product.offer > 0 && (
                        <span className="text-gray-400 line-through text-sm">₹{product.price}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomeProductCard;
