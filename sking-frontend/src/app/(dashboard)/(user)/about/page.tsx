"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Sparkles,
    ShieldCheck,
    Leaf,
    Heart,
    ArrowRight,
    Target,
    Users,
    Award
} from "lucide-react";
import Link from "next/link";

const AboutPage = () => {
    return (
        <div className="flex-1 w-full bg-white">
            {/* --- HERO SECTION --- */}
            <section className="relative h-[500px] flex items-center justify-center overflow-hidden bg-black text-white">
                {/* Dynamic Background Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sking-red/20 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sking-pink/20 rounded-full blur-[150px] animate-pulse" />

                <div className="relative z-10 max-w-[1000px] mx-auto text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-sking-pink font-bold uppercase tracking-[0.4em] text-sm mb-6 block">Our Essence</span>
                        <h1 className="text-6xl md:text-8xl font-medium tracking-tighter italic mb-8">
                            REDEFINING GLOW<span className="text-sking-red">.</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-light text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Sking Cosmetics is more than a brand. It's a commitment to your skin's health and your inner confidence.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- OUR STORY SECTION --- */}
            <section className="py-24 px-4 md:px-8 max-w-[1280px] mx-auto border-b border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight italic uppercase">
                            The Sking <span className="text-sking-pink underline decoration-2 underline-offset-8">Origin</span>
                        </h2>
                        <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
                            <p>
                                Founded in 2024, Sking Cosmetics emerged from a simple realization: the beauty industry was filled with complexity but lacked transparency. We set out to create a sanctuary for those who seek high-performance skincare without the compromise of harsh chemicals.
                            </p>
                            <p>
                                Our journey began in a small boutique lab, where our founders worked with top dermatologists to master the alchemy of botanical extracts and modern science. Today, we stand as a beacon of minimalist luxury in the cosmetic world.
                            </p>
                        </div>
                        <div className="flex gap-12 pt-4">
                            <div>
                                <h4 className="text-4xl font-bold text-black italic">50K+</h4>
                                <p className="text-sm uppercase tracking-widest text-gray-400 font-bold mt-2">Active Users</p>
                            </div>
                            <div>
                                <h4 className="text-4xl font-bold text-black italic">100%</h4>
                                <p className="text-sm uppercase tracking-widest text-gray-400 font-bold mt-2">Cruelty Free</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        <div className="absolute -inset-4 bg-gray-100 rounded-[3rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
                        <div className="relative aspect-square bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            {/* Placeholder for high-end aesthetic image */}
                            <div className="absolute inset-0 bg-linear-to-tr from-sking-red/40 to-black/60 flex items-center justify-center p-12 text-center">
                                <span className="text-white text-3xl font-light italic">"Science meets Soul in every bottle."</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- VALUES GRID --- */}
            <section className="py-24 bg-gray-50/50">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl font-medium italic uppercase tracking-tight">Our Core Values</h2>
                        <p className="text-gray-500 max-w-xl mx-auto font-light">The pillars that uphold every product we formulate and every relationship we build.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Leaf className="text-green-500" size={32} />,
                                title: "Purity First",
                                desc: "Every ingredient is ethically sourced and rigorously tested for bio-compatibility."
                            },
                            {
                                icon: <ShieldCheck className="text-blue-500" size={32} />,
                                title: "Clinical Trust",
                                desc: "Our formulas are dermatologist-tested and backed by real-world clinical results."
                            },
                            {
                                icon: <Heart className="text-red-500" size={32} />,
                                title: "Ethical Love",
                                desc: "No animal testing, ever. We believe beauty shouldn't come at a cost to others."
                            },
                            {
                                icon: <Sparkles className="text-sking-pink" size={32} />,
                                title: "Radical Glow",
                                desc: "We focus on long-term skin health that radiates from the inside out."
                            }
                        ].map((value, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <div className="mb-6 w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4 italic uppercase tracking-tighter">{value.title}</h3>
                                <p className="text-gray-500 font-light leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PHILOSOPHY --- */}
            <section className="py-24 px-4 md:px-8 max-w-[1280px] mx-auto overflow-hidden">
                <div className="relative rounded-[3.5rem] bg-black p-12 md:p-24 overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
                        <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-sking-pink rounded-full blur-[120px]" />
                        <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-sking-red rounded-full blur-[120px]" />
                    </div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-12 text-center space-y-8">
                            <Target className="text-sking-pink mx-auto" size={48} />
                            <h2 className="text-4xl md:text-6xl text-white font-medium italic uppercase tracking-tight">
                                Our Beauty <span className="text-sking-pink">Manifesto</span>
                            </h2>
                            <p className="text-gray-400 text-xl font-light max-w-3xl mx-auto leading-loose italic">
                                "Beauty is not a mask you wear. It is the vitality you nurture.
                                We don't just sell cosmetics; we provide the tools for individual expression and self-love.
                                Your skin is your story, and we're here to help you write it with confidence."
                            </p>
                            <div className="pt-8">
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-2xl font-bold uppercase tracking-widest hover:bg-sking-pink hover:text-white transition-all shadow-2xl"
                                >
                                    Explore the Collection <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- ACCREDITATIONS --- */}
            <section className="py-20 border-t border-gray-100">
                <div className="max-w-[1280px] mx-auto px-4 text-center">
                    <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-12 italic">Recognized for Excellence</h4>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-3 font-black text-2xl italic"><Award size={28} /> ECOCERT</div>
                        <div className="flex items-center gap-3 font-black text-2xl italic"><Users size={28} /> PETA APPROVED</div>
                        <div className="flex items-center gap-3 font-black text-2xl italic"><ShieldCheck size={28} /> ISO 9001</div>
                        <div className="flex items-center gap-3 font-black text-2xl italic"><Sparkles size={28} /> DERMA TESTED</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
