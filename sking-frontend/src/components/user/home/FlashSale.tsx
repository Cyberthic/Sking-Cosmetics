"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FlashSaleProps {
    data: any;
}

const FlashSale = ({ data }: FlashSaleProps) => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

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
        }, 6000);

        return () => {
            clearInterval(timer);
            clearInterval(autoSlide);
        };
    }, [data]);

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

    if (!data || !data.products || data.products.length === 0 || !data.isActive) {
        return null;
    }

    const { isFallback } = data;

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-4xl md:text-5xl font-black flex items-center gap-3 text-gray-900 tracking-tight">
                            {isFallback ? (
                                <>Recently <span className="text-sking-pink italic">Selection</span></>
                            ) : (
                                <>Fla<Zap className="fill-sking-pink text-sking-pink -rotate-12 animate-pulse" size={40} />h Sale</>
                            )}
                        </h2>
                    </div>

                    {!isFallback && (
                        <div className="flex items-center gap-4 md:gap-6 bg-gray-50 p-3 md:p-4 rounded-3xl border border-gray-100 shadow-sm">
                            <span className="text-[10px] md:text-sm font-black md:font-bold text-gray-400 uppercase tracking-widest">Ending In</span>
                            <div className="flex gap-2 md:gap-3 text-white font-black text-xl md:text-2xl">
                                <div className="bg-sking-pink w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-xl md:rounded-2xl shadow-lg shadow-sking-pink/20">{String(timeLeft.hours).padStart(2, '0')}</div>
                                <span className="text-sking-pink flex items-center">:</span>
                                <div className="bg-sking-pink w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-xl md:rounded-2xl shadow-lg shadow-sking-pink/20">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                <span className="text-sking-pink flex items-center">:</span>
                                <div className="bg-sking-pink w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-xl md:rounded-2xl shadow-lg shadow-sking-pink/20">{String(timeLeft.seconds).padStart(2, '0')}</div>
                            </div>
                        </div>
                    )}

                    <Link href="/shop" className="group flex items-center gap-2 text-sking-pink font-black text-lg hover:gap-4 transition-all">
                        View All <span className="text-2xl">→</span>
                    </Link>
                </div>

                {/* Products Slider */}
                <div className="relative group/slider">
                    {/* Navigation Arrows */}
                    <div className="absolute top-1/2 -translate-y-1/2 -left-2 md:-left-5 -right-2 md:-right-5 flex justify-between items-center z-10 pointer-events-none">
                        <AnimatePresence>
                            {canScrollLeft && (
                                <motion.button
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    onClick={() => scroll('left')}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-black pointer-events-auto hover:bg-sking-pink hover:text-white transition-all border border-gray-100"
                                >
                                    <ChevronLeft size={24} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {canScrollRight && (
                                <motion.button
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    onClick={() => scroll('right')}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-black pointer-events-auto hover:bg-sking-pink hover:text-white transition-all border border-gray-100"
                                >
                                    <ChevronRight size={24} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    <div
                        ref={scrollRef}
                        onScroll={checkScroll}
                        className="flex lg:grid lg:grid-cols-5 gap-6 md:gap-8 overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory pb-8"
                    >
                        {data.products.map((product: any) => (
                            <div key={product._id} className="min-w-[260px] md:min-w-[280px] lg:min-w-0 group flex flex-col relative snap-center">
                                {/* Image Container */}
                                <div className="relative h-72 md:h-80 w-full bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6 shadow-sm border border-gray-100 group-hover:shadow-xl transition-all duration-500">
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-all duration-700"
                                    />
                                    {/* Discount Badge */}
                                    {!isFallback && product.flashSalePercentage > 0 && (
                                        <div className="absolute top-4 right-4 bg-gray-900 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl">
                                            {product.flashSalePercentage}% OFF
                                        </div>
                                    )}

                                    {/* Hover Add to Cart Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                        <Link
                                            href={`/product/${product.slug}`}
                                            className="bg-white text-black font-black px-8 py-3 rounded-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-sking-pink hover:text-white"
                                        >
                                            {isFallback ? "VIEW PRODUCT" : "GRAB DEAL"}
                                        </Link>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="flex flex-col gap-2 px-2">
                                    <span className="text-[10px] font-black text-sking-pink uppercase tracking-[0.2em]">{product.category?.name || "SKING EXCLUSIVE"}</span>
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-sking-pink transition-colors line-clamp-1">{product.name}</h3>

                                    <div className="flex items-baseline gap-3">
                                        <span className="font-black text-2xl text-gray-900">₹{isFallback ? product.price : Math.round(product.price * (1 - product.flashSalePercentage / 100))}</span>
                                        {!isFallback && product.flashSalePercentage > 0 && (
                                            <span className="text-sm text-gray-400 line-through font-medium">₹{product.price}</span>
                                        )}
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
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    );
};

export default FlashSale;

