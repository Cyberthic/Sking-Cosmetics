"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const categories = [
    { name: "Lipsticks", image: "https://images.unsplash.com/photo-1586495777744-4413f21062dc?q=80&w=800&auto=format&fit=crop", link: "/shop/lips" },
    { name: "Eyes", image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=800&auto=format&fit=crop", link: "/shop/eyes" },
    { name: "Face", image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=800&auto=format&fit=crop", link: "/shop/face" },
    { name: "Skincare", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop", link: "/shop/skincare" },
];

const CategoryGrid = () => {
    return (
        <section className="py-24 px-4 md:px-6 bg-white text-black">
            <div className="max-w-[1280px] mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                        Shop By <br /><span className="text-sking-red italic">Category</span>
                    </h2>
                    <Link href="/shop" className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-sking-pink hover:border-sking-pink transition-colors">
                        View All Categories
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            href={cat.link}
                            className="group relative h-[400px] w-full overflow-hidden block"
                        >
                            <div className="absolute inset-0 bg-gray-200">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity duration-300" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-start translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 italic">
                                    {cat.name}
                                </h3>
                                <span className="text-sking-pink font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                    Explore Collection
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
