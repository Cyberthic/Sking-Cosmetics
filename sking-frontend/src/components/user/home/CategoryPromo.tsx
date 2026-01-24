"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const pros = [
    {
        title: "Get Radiant Skin!",
        desc: "Experience the ultimate skincare transformation with our face whitening creams and washes.",
        image: "/sking/sking-hero-1.webp",
        link: "/shop/face",
        accent: "text-sking-pink"
    },
    {
        title: "Enhance Your Aura",
        desc: "Discover premium perfumes and rich moisturizers to define your signature scent and feel.",
        image: "/sking/sking-perfume-2.webp",
        link: "/shop/body",
        accent: "text-purple-500"
    },
    {
        title: "Perfect Your Pout",
        desc: "Nourishing lip balms and trending makeup for that flawless, confident finish.",
        image: "/sking/sking-lipbalm.webp",
        link: "/shop/lips",
        accent: "text-sking-red"
    }
];

const CategoryPromo = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = containerRef.current?.children;
            if (cards) {
                gsap.fromTo(cards,
                    { y: 100, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        stagger: 0.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="py-20 bg-white">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8">
                <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pros.map((item, idx) => (
                        <div
                            key={idx}
                            className={`group relative h-[500px] rounded-[2rem] overflow-hidden flex flex-col items-center justify-start text-center p-8 transition-transform duration-500 hover:-translate-y-2`}
                        >
                            {/* Full Background Image */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                                {/* Overlay removed as per user request for full clear image */}
                            </div>

                            {/* Text Content - Shifts Up on Hover */}
                            <div className="relative z-20 mt-12 transform transition-transform duration-500 ease-out group-hover:-translate-y-4">
                                <h3 className="text-4xl font-bold tracking-tight mb-3 text-black">
                                    {item.title}
                                </h3>
                                <p className="text-gray-700 font-medium text-sm max-w-xs mx-auto leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>

                            {/* Button - Pops Up from Bottom on Hover */}
                            <div className="absolute bottom-12 left-0 w-full flex justify-center opacity-0 translate-y-10 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 z-30">
                                <Link
                                    href={item.link}
                                    className="px-8 py-3 bg-black text-white font-bold uppercase tracking-widest text-xs rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] flex items-center gap-2"
                                >
                                    Shop Now <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryPromo;
