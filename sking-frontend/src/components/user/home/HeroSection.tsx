"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

interface Slide {
    video?: string;
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
    link: string;
    duration?: number;
}

const slides: Slide[] = [
    {
        video: "/sking/sking-video.mp4",
        image: "/sking/sking-bg-2.webp",
        title: "Discover Your Beauty",
        subtitle: "Shop the Best Beauty Products Online",
        buttonText: "Shop Now",
        link: "/shop",
        duration: 10000 // 10 seconds for the first slide (video)
    },
    {
        image: "/sking/sking-bg-3.webp",
        title: "Redefine Your Glow",
        subtitle: "Premium Skincare for Every Skin Type",
        buttonText: "Explore More",
        link: "/shop/skincare",
        duration: 5000
    },
    {
        image: "/sking/sking-bg-4.webp",
        title: "Empower Your Style",
        subtitle: "Unleash Your Inner Confidence Today",
        buttonText: "View Collection",
        link: "/new-arrivals",
        duration: 5000
    }
];

const brands = [
    "SKING", "INKLINE", "ARTISTRY", "LUMINA", "CHROMA", "HYDRALUX",
    "SKING", "INKLINE", "ARTISTRY", "LUMINA", "CHROMA", "HYDRALUX"
];

const HeroSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    // GSAP Entrance Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.fromTo(headingRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, delay: 0.2 }
            )
                .fromTo(subRef.current,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1 },
                    "-=0.7"
                )
                .fromTo(buttonRef.current,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8 },
                    "-=0.7"
                );

        }, contentRef);

        return () => ctx.revert();
    }, [currentIndex]); // Re-run animation on slide change

    // Carousel Auto-Play with dynamic duration
    useEffect(() => {
        const slideDuration = slides[currentIndex].duration || 5000;
        const timer = setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, slideDuration);

        return () => clearTimeout(timer);
    }, [currentIndex]);

    // Handle Dot Click
    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    const currentSlide = slides[currentIndex];

    // Duplicate brands for seamless loop
    const marqueeBrands = [...brands, ...brands, ...brands];

    return (
        <section className="w-full py-6 bg-white overflow-hidden space-y-8">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8">
                {/* Rounded Container */}
                <div className="relative w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-xl bg-sking-black">

                    {/* Carousel Background with Sideways Slide */}
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                            key={currentIndex}
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="absolute inset-0 z-0 bg-sking-black"
                        >
                            {currentSlide.video ? (
                                <video
                                    src={currentSlide.video}
                                    poster={currentSlide.image}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                                />
                            ) : (
                                <Image
                                    src={currentSlide.image}
                                    alt={`Sking Cosmetics - ${currentSlide.title} - ${currentSlide.subtitle}`}
                                    fill
                                    className="object-cover opacity-80"
                                    priority
                                />
                            )}
                            {/* Gradient Overlay for Text Visibility */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black/60 md:to-black/40" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Content Layer */}
                    <div ref={contentRef} className="absolute inset-0 z-10 flex flex-col justify-center items-end px-8 md:px-16 text-right">
                        <div className="max-w-xl space-y-4">

                            <h1 ref={headingRef} className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] drop-shadow-md">
                                {currentSlide.title}
                            </h1>

                            <p ref={subRef} className="text-base md:text-lg text-white/90 font-medium tracking-wide drop-shadow-sm">
                                {currentSlide.subtitle}
                            </p>

                            <div ref={buttonRef} className="pt-3 flex justify-end">
                                <Link
                                    href={currentSlide.link}
                                    className="px-8 py-3 bg-sking-pink text-white font-bold tracking-widest text-xs uppercase rounded shadow-lg hover:bg-white hover:text-sking-pink transition-all transform hover:-translate-y-1"
                                >
                                    {currentSlide.buttonText}
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Dots - Bottom Center */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? "bg-sking-pink w-8"
                                    : "bg-white/50 w-2 hover:bg-white"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Moving Brands Marquee */}
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8">
                <div className="w-full overflow-hidden border-t border-b border-gray-100 py-6 bg-white">
                    <motion.div
                        className="flex whitespace-nowrap"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 30
                        }}
                    >
                        {marqueeBrands.map((brand, index) => (
                            <span
                                key={index}
                                className="mx-8 md:mx-16 text-3xl md:text-4xl font-bold uppercase tracking-widest text-sking-pink/30 hover:text-sking-pink/50 transition-colors cursor-default select-none font-outline-2"
                            >
                                {brand}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
