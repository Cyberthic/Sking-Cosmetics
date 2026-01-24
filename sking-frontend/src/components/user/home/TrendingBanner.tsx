"use client";
import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

const TrendingBanner = () => {
    return (
        <section className="py-10 bg-white">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8">
                <div className="relative w-full h-[300px] rounded-[2rem] overflow-hidden bg-gradient-to-r from-purple-800 to-indigo-700 flex items-center justify-between px-12 md:px-24">

                    {/* Left Brushes */}
                    <div className="relative w-64 h-full hidden md:block">
                        <Image
                            src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=600&auto=format&fit=crop" // Placeholder for Brushes
                            alt="Makeup Brushes"
                            fill
                            className="object-contain object-left scale-125 -rotate-12"
                        />
                    </div>

                    {/* Center Text */}
                    <div className="relative z-10 text-center mx-auto">
                        <Sparkles className="absolute -top-8 -left-12 text-white w-8 h-8 animate-pulse" />
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                            Discover The Latest <br />
                            Trending Product
                        </h2>
                        <Sparkles className="absolute -bottom-8 -right-12 text-white w-6 h-6 animate-pulse delay-700" />
                    </div>

                    {/* Right Palette */}
                    <div className="relative w-64 h-full hidden md:block">
                        <Image
                            src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=600&auto=format&fit=crop" // Placeholder for Palette
                            alt="Eyeshadow Palette"
                            fill
                            className="object-contain object-right scale-110 rotate-12"
                        />
                    </div>

                    {/* Background Accents (Grid lines/dots simulated) */}
                    <div className="absolute inset-0 border border-white/10 rounded-[2rem] m-4 pointer-events-none" />
                </div>
            </div>
        </section>
    );
};

export default TrendingBanner;
