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
        <section className="py-20 px-4 md:px-6 bg-white text-black">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black text-center mb-12 tracking-tighter uppercase">
                    Shop By Category
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            href={cat.link}
                            className="group relative h-80 md:h-96 w-full overflow-hidden block"
                        >
                            <div className="absolute inset-0 bg-gray-200">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                            <div className="absolute bottom-6 left-0 w-full text-center">
                                <span className="inline-block px-6 py-2 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors">
                                    {cat.name}
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
