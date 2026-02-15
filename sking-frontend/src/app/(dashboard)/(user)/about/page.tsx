'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    ShieldCheck,
    Leaf,
    Heart,
    ArrowRight,
    Award,
    Users,
    CheckCircle2,
    Globe,
    Zap,
    Instagram,
    Facebook,
    MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const AboutPage = () => {
    return (
        <div className="flex-1 w-full bg-white overflow-hidden">
            {/* --- IMMERSIVE HERO SECTION --- */}
            <section className="relative min-h-[90vh] flex items-center justify-center pt-20 px-4">
                {/* Modern Gradient Backgrounds */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sking-pink/10 rounded-full blur-[160px] -mr-96 -mt-96" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sking-red/5 rounded-full blur-[140px] -ml-48 -mb-48" />

                <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/5 backdrop-blur-sm">
                            <Sparkles size={14} className="text-sking-pink" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">The Future of Beauty</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black uppercase leading-[0.9] italic">
                            Crafting Soulful <br />
                            <span className="text-sking-pink">Glow.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-500 font-medium max-w-lg leading-relaxed">
                            We believe skincare is a ritual of self-love. Sking Cosmetics merges the purity of nature with the precision of science to deliver results that radiate.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                href="/shop"
                                className="px-8 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-sking-pink transition-all shadow-2xl shadow-black/20 hover:-translate-y-1 active:scale-95 flex items-center gap-3"
                            >
                                Shop Collection <Zap size={16} fill="currentColor" />
                            </Link>
                            <Link
                                href="#story"
                                className="px-8 py-5 bg-white text-black border border-black/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all hover:-translate-y-1 active:scale-95"
                            >
                                Our Story
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl z-20">
                            <img
                                src="/sking/sking-perfume-2.webp"
                                alt="Luxury Skincare"
                                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        </div>

                        {/* Interactive Float Cards */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -right-8 top-1/4 z-30 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/50 hidden md:block"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-sking-pink rounded-2xl text-white">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="text-xl font-black italic">50K+</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Happy Users</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -left-8 bottom-1/4 z-30 bg-black/90 text-white p-6 rounded-3xl shadow-2xl hidden md:block"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white text-black rounded-2xl">
                                    <CheckCircle2 size={20} />
                                </div>
                                <div>
                                    <p className="text-xl font-black italic">100%</p>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Peta Approved</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* --- PHILOSOPHY SECTION (Horizontal Scroll Effect) --- */}
            <section id="story" className="py-24 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-sking-pink blur-sm" />
                </div>

                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <div className="lg:col-span-12 text-center space-y-6 mb-16">
                            <motion.span
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-sking-pink text-xs font-black uppercase tracking-[0.3em]"
                            >
                                The Manifest
                            </motion.span>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
                                We Exist to <span className="text-sking-pink">Inspire.</span>
                            </h2>
                        </div>

                        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    id: "01",
                                    title: "Pure Origins",
                                    desc: "Sourcing ingredients responsibly from the depths of nature.",
                                    icon: <Leaf className="text-sking-pink" />
                                },
                                {
                                    id: "02",
                                    title: "Clinical Rigor",
                                    desc: "Dermatologist tested formulas developed in high-tech labs.",
                                    icon: <ShieldCheck className="text-sking-pink" />
                                },
                                {
                                    id: "03",
                                    title: "Total Transparency",
                                    desc: "No secrets. We list every single ingredient on the bottle.",
                                    icon: <Globe className="text-sking-pink" />
                                }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.2 }}
                                    className="group p-10 rounded-[40px] border border-white/10 hover:border-sking-pink/50 bg-white/5 backdrop-blur-sm transition-all duration-500"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="p-4 bg-white/10 rounded-2xl group-hover:bg-sking-pink group-hover:text-white transition-colors">
                                            {item.icon}
                                        </div>
                                        <span className="text-3xl font-black text-white/10 group-hover:text-sking-pink/20 transition-colors uppercase italic">{item.id}</span>
                                    </div>
                                    <h3 className="text-xl font-black uppercase italic mb-4">{item.title}</h3>
                                    <p className="text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CORE VALUES (Aesthetic Grid) --- */}
            <section className="py-24 px-4 md:px-8 max-w-[1280px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="relative order-2 lg:order-1">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-6 pt-12">
                                <div className="h-80 relative rounded-[40px] overflow-hidden group shadow-xl">
                                    <img src="/sking/sking-lipbalm.webp" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Texture" />
                                </div>
                                <div className="h-64 relative rounded-[40px] overflow-hidden group shadow-xl">
                                    <img src="/sking/sking-hero-1.webp" className="w-full h-full object-cover rotate-3 hover:rotate-0 transition-all duration-700" alt="Ingredient" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="h-64 relative rounded-[40px] overflow-hidden group shadow-xl">
                                    <img src="/sking/sking-bg-2.webp" className="w-full h-full object-cover -rotate-3 hover:rotate-0 transition-all duration-700" alt="Formula" />
                                </div>
                                <div className="h-80 relative rounded-[40px] overflow-hidden group shadow-xl">
                                    <img src="/sking/sking-bg-3.webp" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Portrait" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-12 order-1 lg:order-2">
                        <div className="space-y-4">
                            <span className="text-sking-pink text-xs font-black uppercase tracking-[0.3em]">Our Spirit</span>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.9]">
                                Science meets <br />
                                <span className="text-sking-pink">Soul.</span>
                            </h2>
                        </div>

                        <div className="space-y-8">
                            {[
                                { title: "Dermatologically Tested", desc: "Rigorous testing to ensure safety for even the most sensitive skin types.", icon: <Heart fill="currentColor" className="text-red-400" /> },
                                { title: "Zero Animal Testing", desc: "We love our furry friends. Every product is 100% cruelty-free.", icon: <Heart fill="currentColor" className="text-sking-pink" /> },
                                { title: "Sustainable Luxury", desc: "Eco-conscious packaging tailored for high-end aesthetics.", icon: <Heart fill="currentColor" className="text-green-400" /> }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex gap-6 group"
                                >
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-all">
                                        <div className="w-5 h-5 flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black uppercase italic mb-1">{item.title}</h4>
                                        <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CALL TO ACTION --- */}
            <section className="py-24 px-4">
                <div className="max-w-[1280px] mx-auto relative rounded-[60px] bg-black p-12 md:p-24 overflow-hidden text-center text-white">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sking-pink/30 rounded-full blur-[100px] -mr-48 -mt-48" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sking-red/20 rounded-full blur-[100px] -ml-48 -mb-48" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="relative z-10 space-y-8"
                    >
                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
                            Join the Glow <br />
                            <span className="text-sking-pink">Revolution.</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-medium">
                            Ready to embrace your skin's natural potential? Experience the ritual of Sking Cosmetics.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                            <Link
                                href="/shop"
                                className="px-12 py-6 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-sking-pink hover:text-white transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                            >
                                Shop All Products <ArrowRight size={16} />
                            </Link>
                            <Link
                                href="/contact"
                                className="px-12 py-6 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                            >
                                <MessageCircle size={16} /> Contact Support
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
