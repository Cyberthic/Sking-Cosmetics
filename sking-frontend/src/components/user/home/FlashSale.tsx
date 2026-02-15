"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Star } from "lucide-react";
import { motion } from "framer-motion";

interface FlashSaleProps {
    data: any;
}

const FlashSale = ({ data }: FlashSaleProps) => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!data || !data.currentEndTime) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(data.currentEndTime).getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, [data]);

    if (!data || !data.products || data.products.length === 0) {
        return (
            <section className="py-16 bg-white overflow-hidden">
                <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8">
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                        <Zap size={64} className="text-gray-200 mb-6" />
                        <h2 className="text-2xl font-bold text-gray-400">Currently no flash sale</h2>
                        <p className="text-gray-400 mt-2">Check back later for exciting deals!</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-white">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-4xl md:text-5xl font-black flex items-center gap-3 text-gray-900 tracking-tight">
                            Fla<Zap className="fill-sking-pink text-sking-pink -rotate-12 animate-pulse" size={40} />h Sale
                        </h2>
                    </div>

                    <div className="flex items-center gap-6 bg-gray-50 p-4 rounded-3xl border border-gray-100 shadow-sm">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Ending In</span>
                        <div className="flex gap-3 text-white font-black text-2xl">
                            <div className="bg-sking-pink w-14 h-14 flex items-center justify-center rounded-2xl shadow-lg shadow-sking-pink/20">{String(timeLeft.hours).padStart(2, '0')}</div>
                            <span className="text-sking-pink flex items-center">:</span>
                            <div className="bg-sking-pink w-14 h-14 flex items-center justify-center rounded-2xl shadow-lg shadow-sking-pink/20">{String(timeLeft.minutes).padStart(2, '0')}</div>
                            <span className="text-sking-pink flex items-center">:</span>
                            <div className="bg-sking-pink w-14 h-14 flex items-center justify-center rounded-2xl shadow-lg shadow-sking-pink/20">{String(timeLeft.seconds).padStart(2, '0')}</div>
                        </div>
                    </div>

                    <Link href="/shop" className="group flex items-center gap-2 text-sking-pink font-black text-lg hover:gap-4 transition-all">
                        View All Deals <span className="text-2xl">→</span>
                    </Link>
                </div>

                {/* Products */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {data.products.map((product: any) => (
                        <div key={product._id} className="group flex flex-col relative">
                            {/* Image Container */}
                            <div className="relative h-80 w-full bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6 shadow-sm border border-gray-100 group-hover:shadow-xl transition-all duration-500">
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-all duration-700"
                                />
                                {/* Discount Badge */}
                                <div className="absolute top-4 right-4 bg-gray-900 text-white text-xs font-black px-4 py-2 rounded-full shadow-xl">
                                    {product.flashSalePercentage}% OFF
                                </div>

                                {/* Hover Add to Cart Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                    <Link
                                        href={`/product/${product.slug}`}
                                        className="bg-white text-black font-black px-8 py-3 rounded-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-sking-pink hover:text-white"
                                    >
                                        GRAB DEAL
                                    </Link>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col gap-2 px-2">
                                <span className="text-[10px] font-black text-sking-pink uppercase tracking-[0.2em]">{product.category?.name || "SKING EXCLUSIVE"}</span>
                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-sking-pink transition-colors line-clamp-1">{product.name}</h3>

                                <div className="flex items-baseline gap-3">
                                    <span className="font-black text-2xl text-gray-900">₹{Math.round(product.price * (1 - product.flashSalePercentage / 100))}</span>
                                    <span className="text-sm text-gray-400 line-through font-medium">₹{product.price}</span>
                                </div>

                                {/* Stock Indicator */}
                                <div className="mt-2 space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                        <span>Limited Stock</span>
                                        <span className="text-sking-pink">{product.variants?.[0]?.stock || 5} Left</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "35%" }}
                                            className="h-full bg-linear-to-r from-sking-pink to-purple-600 rounded-full"
                                        />
                                    </div>
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
