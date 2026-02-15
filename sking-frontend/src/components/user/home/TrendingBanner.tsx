"use client";
import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

const TrendingBanner = () => {
    return (
        <section className="py-10 bg-white">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8">
                <div className="relative w-full h-[300px] md:h-[400px] rounded-[2.5rem] overflow-hidden group">
                    {/* Main Discovery Image */}
                    <Image
                        src="/sking/sking-discover.webp"
                        alt="Discover Sking products"
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />

                    {/* Darker Overlay for better text contrast */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500" />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                        <div className="mb-4">
                            <Sparkles className="text-sking-pink w-10 h-10 animate-pulse" />
                        </div>
                        <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-tight drop-shadow-2xl">
                            Discover The Latest <br />
                            <span className="text-sking-pink">Trending</span> Products
                        </h2>
                        <div className="mt-8">
                            <button className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-sking-pink hover:text-white transition-all transform hover:scale-110 active:scale-95 shadow-xl">
                                Explore Collection
                            </button>
                        </div>
                    </div>

                    {/* Decorative Border */}
                    <div className="absolute inset-4 border border-white/20 rounded-[2rem] pointer-events-none" />
                </div>
            </div>
        </section>
    );
};

export default TrendingBanner;
