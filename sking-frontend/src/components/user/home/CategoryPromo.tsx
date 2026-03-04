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
    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

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
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8">
                <div ref={containerRef} className="grid grid-cols-3 gap-2 md:gap-8">
                    {pros.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                            className={`group relative h-[220px] sm:h-[350px] md:h-[500px] rounded-2xl md:rounded-[2rem] overflow-hidden flex flex-col items-center justify-start text-center p-3 md:p-8 transition-transform duration-500 cursor-pointer overflow-hidden ${activeIndex === idx ? "-translate-y-2 shadow-2xl" : "hover:-translate-y-2"
                                }`}
                        >
                            {/* Full Background Image */}
                            <div className="absolute inset-0 z-0 scale-100 group-hover:scale-110 transition-transform duration-700 ease-out">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className={`object-cover ${activeIndex === idx ? "scale-110" : ""}`}
                                />
                            </div>

                            {/* Text Content - Shifts Up on Hover/Tap */}
                            <div className={`relative z-20 mt-4 md:mt-12 transform transition-all duration-500 ease-out ${activeIndex === idx
                                    ? "-translate-y-2 md:-translate-y-4"
                                    : "group-hover:-translate-y-2 md:group-hover:-translate-y-4"
                                }`}>
                                <h3 className="text-xs sm:text-xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-1 md:mb-3 text-black leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-gray-700 font-medium text-[8px] sm:text-xs md:text-sm max-w-[90%] mx-auto leading-tight md:leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>

                            {/* Button - Pops Up from Bottom on Hover/Tap */}
                            <div className={`absolute bottom-4 md:bottom-12 left-0 w-full flex justify-center transition-all duration-500 z-30 ${activeIndex === idx
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-4 md:translate-y-10 group-hover:opacity-100 group-hover:translate-y-0"
                                }`}>
                                <Link
                                    href={item.link}
                                    onClick={(e) => e.stopPropagation()}
                                    className="px-3 py-1.5 md:px-8 md:py-3 bg-black text-white font-bold uppercase tracking-widest text-[7px] md:text-xs rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-1 md:gap-2 whitespace-nowrap"
                                >
                                    <span className="hidden sm:inline">Shop Now</span>
                                    <span className="sm:hidden">Shop</span>
                                    <ArrowRight size={10} className="md:w-3.5 md:h-3.5 w-2 h-2" />
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
