"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const HeroSection = () => {
    const images = [
        "/sking/sking-bg-2.webp",
        "/sking/sking-bg-3.webp",
        "/sking/sking-bg-4.webp"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const mottoRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);

    // GSAP Entrance Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.fromTo(mottoRef.current,
                { x: -50, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, delay: 0.5 }
            )
                .fromTo(headingRef.current,
                    { x: -50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 1 },
                    "-=0.6"
                )
                .fromTo(subRef.current,
                    { x: -50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 1 },
                    "-=0.8"
                )
                .fromTo(buttonsRef.current,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8 },
                    "-=0.6"
                );

        }, contentRef);

        return () => ctx.revert();
    }, []);

    // Carousel Auto-Play
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [images.length]);

    // Handle Dot Click
    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <section className="relative h-screen w-full overflow-hidden bg-sking-black text-white">
            {/* Carousel Background with Sideways Slide */}
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={currentIndex}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={images[currentIndex]}
                        alt="Sking Hero"
                        fill
                        className="object-cover opacity-70"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                </motion.div>
            </AnimatePresence>

            {/* Content - Left Aligned */}
            <div ref={contentRef} className="relative z-10 flex h-full items-center px-6 md:px-12 lg:px-24">
                <div className="max-w-4xl space-y-8">

                    {/* Motto */}
                    <p ref={mottoRef} className="text-sking-pink font-bold tracking-widest uppercase text-xs md:text-sm mb-2">
                        Sking Cosmetics
                    </p>

                    <h1 ref={headingRef} className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                        Confidence begins with <br />
                        <span className="text-sking-red">the skin you wear.</span>
                    </h1>

                    <p ref={subRef} className="text-lg md:text-xl text-gray-200 max-w-2xl font-light tracking-wide leading-relaxed">
                        High-performance, cruelty-free makeup made for unapologetic confidence.
                    </p>

                    <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6 pt-4">
                        <Link
                            href="/shop"
                            className="px-10 py-5 bg-sking-red text-black font-bold tracking-widest hover:bg-white transition-all uppercase text-sm md:text-base border border-sking-red"
                        >
                            Shop Now
                        </Link>
                        <Link
                            href="/best-sellers"
                            className="px-10 py-5 bg-transparent border border-white text-white font-bold tracking-widest hover:bg-white hover:text-black transition-all uppercase text-sm md:text-base backdrop-blur-sm"
                        >
                            Explore Best Sellers
                        </Link>
                    </div>
                </div>
            </div>

            {/* Carousel Dots - Bottom Right */}
            <div className="absolute bottom-12 right-12 z-20 flex gap-4">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                            ? "bg-sking-red w-8"
                            : "bg-white/50 hover:bg-white"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSection;
