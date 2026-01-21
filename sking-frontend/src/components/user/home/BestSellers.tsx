"use client";
import React, { useRef } from "react";
import HomeProductCard from "./HomeProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const mockBestSellers = [
    { _id: "1", name: "Matte Attack Lipstick - Red", price: 799, offer: 10, images: ["https://images.unsplash.com/photo-1586495777744-4413f21062dc?q=80&w=800"], rating: 4.8, reviewCount: 342 },
    { _id: "2", name: "Glow Getter Highlighter", price: 1299, offer: 0, images: ["https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=800"], rating: 4.5, reviewCount: 120 },
    { _id: "3", name: "Volumizing Mascara", price: 599, offer: 15, images: ["https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?q=80&w=800"], rating: 4.2, reviewCount: 85 },
    { _id: "4", name: "Hydrating Face Serum", price: 1499, offer: 20, images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800"], rating: 4.9, reviewCount: 560 },
    { _id: "5", name: "Setting Powder", price: 899, offer: 5, images: ["https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800"], rating: 4.3, reviewCount: 90 },
];

const BestSellers = ({ products = mockBestSellers }: { products?: any[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    return (
        <section className="py-20 px-4 md:px-6 bg-white text-black overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">
                        Best Sellers
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll("left")}
                            className="p-2 rounded-full border border-black hover:bg-black hover:text-white transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="p-2 rounded-full border border-black hover:bg-black hover:text-white transition-colors"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide no-scrollbar"
                >
                    {products.map((product) => (
                        <div key={product._id} className="min-w-[280px] md:min-w-[320px] snap-start">
                            <HomeProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestSellers;
