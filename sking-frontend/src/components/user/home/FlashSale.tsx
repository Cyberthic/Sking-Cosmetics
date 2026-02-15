"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Star } from "lucide-react";

const flashProducts = [
    {
        id: 1,
        name: "Rosewater Hydrating Mist",
        brand: "GLOWIFY BEAUTY",
        price: 19.99,
        originalPrice: 23.50,
        rating: 5,
        reviews: 871,
        stock: 10,
        image: "https://images.unsplash.com/photo-1601049541289-9b39e25d4810?q=80&w=800&auto=format&fit=crop",
        discount: "20%"
    },
    {
        id: 2,
        name: "Silk Lash Extensions",
        brand: "LUXE LASHES",
        price: 24.99,
        originalPrice: 30.50,
        rating: 4.5,
        reviews: 110,
        stock: 5,
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop",
        discount: "15%"
    },
    {
        id: 3,
        name: "Vitamin C Serum",
        brand: "RADIANT SKINCARE",
        price: 29.99,
        originalPrice: 45.99,
        rating: 5,
        reviews: 1100,
        stock: 8,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
        discount: "25%"
    },
    {
        id: 4,
        name: "Charcoal Face Mask",
        brand: "GLOWIFY BEAUTY",
        price: 19.99,
        originalPrice: 23.50,
        rating: 4,
        reviews: 871,
        stock: 10,
        image: "https://images.unsplash.com/photo-1596704017382-30508d71b65d?q=80&w=800&auto=format&fit=crop",
        discount: "20%"
    },
    {
        id: 5,
        name: "Eco Green Mist",
        brand: "GLOWIFY BEAUTY",
        price: 19.99,
        originalPrice: 23.50,
        rating: 4.5,
        reviews: 871,
        stock: 10,
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=800&auto=format&fit=crop",
        discount: "20%"
    }
];

const FlashSale = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 15, minutes: 29, seconds: 20 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold flex items-center gap-2">
                            Fla<Zap className="fill-sking-pink text-sking-pink rotate-12" size={28} />h sale
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-500">Ends in</span>
                        <div className="flex gap-2 text-white font-bold text-lg">
                            <div className="bg-sking-pink px-3 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</div>
                            <span className="text-sking-pink flex items-center">:</span>
                            <div className="bg-sking-pink px-3 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</div>
                            <span className="text-sking-pink flex items-center">:</span>
                            <div className="bg-sking-pink px-3 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</div>
                        </div>
                    </div>

                    <Link href="/shop" className="text-sking-pink font-bold hover:underline">
                        View All
                    </Link>
                </div>

                {/* Products */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {flashProducts.map((product) => (
                        <div key={product.id} className="group flex flex-col">
                            {/* Image */}
                            <div className="relative h-64 w-full bg-gray-50 rounded-xl overflow-hidden mb-4">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                                    {product.discount} OFF
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest">{product.brand}</span>
                                <h3 className="font-bold text-sm truncate text-black">{product.name}</h3>

                                <div className="flex items-end gap-2 mt-1">
                                    <span className="font-bold text-lg">₹{product.price}</span>
                                    <span className="text-xs text-gray-400 line-through mb-1">₹{product.originalPrice}</span>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mt-1">
                                    <div className="flex text-sking-pink">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={10} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-gray-300"} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-gray-400">({product.reviews})</span>
                                </div>

                                {/* Stock Bar */}
                                <div className="mt-2">
                                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-600 w-1/2 rounded-full"></div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-1">Stock: {product.stock}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FlashSale;
