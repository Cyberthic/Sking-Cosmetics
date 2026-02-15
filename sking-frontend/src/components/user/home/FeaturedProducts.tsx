"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FeaturedProductsProps {
    data: any[];
}

const FeaturedProducts = ({ data }: FeaturedProductsProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        // Auto-slide for mobile
        const autoSlide = setInterval(() => {
            if (scrollRef.current && window.innerWidth < 1024) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const maxScroll = scrollWidth - clientWidth;
                if (scrollLeft >= maxScroll - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollBy({ left: clientWidth * 0.8, behavior: 'smooth' });
                }
            }
        }, 8000);

        return () => clearInterval(autoSlide);
    }, []);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 20);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth * 0.8;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!data || data.length === 0) return null;

    return (
        <section className="py-16 bg-white overflow-hidden relative group/section">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-black uppercase text-black italic tracking-tight">
                        Featured <span className="text-sking-pink">Gems</span>
                    </h2>
                    <Link href="/shop" className="text-sking-pink font-black text-sm hover:underline underline-offset-4 uppercase tracking-widest">
                        View All
                    </Link>
                </div>

                {/* Slider Container */}
                <div className="relative group/slider">
                    {/* Navigation Arrows */}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-2 -right-2 flex justify-between items-center z-10 pointer-events-none md:hidden">
                        <AnimatePresence>
                            {canScrollLeft && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => scroll('left')}
                                    className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-black pointer-events-auto border border-gray-100"
                                >
                                    <ChevronLeft size={20} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {canScrollRight && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => scroll('right')}
                                    className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-black pointer-events-auto border border-gray-100"
                                >
                                    <ChevronRight size={20} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    <div
                        ref={scrollRef}
                        onScroll={checkScroll}
                        className="flex lg:grid lg:grid-cols-5 gap-6 md:gap-8 overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory pb-6 lg:pb-0"
                    >
                        {data.slice(0, 10).map((product) => (
                            <Link href={`/product/${product.slug}`} key={product._id} className="min-w-[180px] sm:min-w-[220px] lg:min-w-0 group flex flex-col snap-center">
                                {/* Image */}
                                <div className="relative h-64 w-full bg-gray-50/50 border border-gray-100 rounded-[2rem] overflow-hidden mb-4 p-4 flex items-center justify-center group-hover:bg-white group-hover:shadow-2xl transition-all duration-500">
                                    <Image
                                        src={product.images?.[0] || ""}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex flex-col gap-1 px-1">
                                    <span className="text-[10px] text-sking-pink font-black uppercase tracking-[0.2em]">{product.category?.name || "SKINCARE"}</span>
                                    <h3 className="font-bold text-sm truncate text-black group-hover:text-sking-pink transition-colors">{product.name}</h3>

                                    <div className="mt-1">
                                        <span className="font-black text-lg text-black">₹{product.price}</span>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className="flex text-sking-pink">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={8} fill="currentColor" />
                                            ))}
                                        </div>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{product.soldCount || 0} Sold</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    );
};

export default FeaturedProducts;

