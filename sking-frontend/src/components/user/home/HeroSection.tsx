"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import Image from "next/image";

const HeroSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                textRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.5 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden bg-sking-black text-white">
            {/* Background Image - Replace with actual asset */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2670&auto=format&fit=crop"
                    alt="Sking Hero"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-sking-black via-transparent to-transparent opacity-90"></div>
            </div>

            <div className="relative z-10 flex h-full items-center justify-center text-center px-4">
                <div ref={textRef} className="max-w-4xl space-y-6">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-none">
                        Own Your <span className="text-sking-red">Glow.</span> <br />
                        Own Your <span className="text-sking-pink">Power.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light tracking-wide">
                        High-performance, cruelty-free makeup made for unapologetic confidence.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <Link
                            href="/shop"
                            className="px-8 py-4 bg-sking-red text-white font-bold tracking-widest hover:bg-red-700 transition-all uppercase text-sm md:text-base border border-sking-red"
                        >
                            Shop Now
                        </Link>
                        <Link
                            href="/best-sellers"
                            className="px-8 py-4 bg-transparent border border-white text-white font-bold tracking-widest hover:bg-white hover:text-black transition-all uppercase text-sm md:text-base"
                        >
                            Explore Best Sellers
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
