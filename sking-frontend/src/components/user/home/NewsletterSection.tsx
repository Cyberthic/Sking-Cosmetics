"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const NewsletterSection = () => {
    return (
        <section className="bg-transparent relative z-20 -mt-32 pointer-events-none">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 pointer-events-auto">
                <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-[#1a1c1e] flex items-center min-h-[400px] shadow-2xl">
                    {/* Background Subtle Shine/Texture */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/5 pointer-events-none" />

                    {/* Left Image (Model) with Seamless Blend */}
                    <div className="hidden md:block w-[60%] h-full absolute left-0 top-0">
                        <Image
                            src="/sking/sking-model.webp"
                            alt="Beauty Model"
                            fill
                            className="object-cover object-center"
                            priority
                        />
                        {/* Complex Gradient Blend: Fades the model image into the dark container background */}
                        <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-[#1a1c1e]/20 to-[#1a1c1e]" />
                    </div>

                    {/* Right Content */}
                    <div className="relative z-20 w-full md:w-[55%] md:ml-auto p-10 md:p-20 flex flex-col justify-center items-start">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black text-white mb-3 italic tracking-tighter uppercase leading-none">
                                    Join the <span className="text-sking-pink">Glow</span> Club
                                </h2>
                                <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-md">
                                    Unlock exclusive rituals, early access to new collections, and beauty secrets delivered to your inbox.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row w-full max-w-md gap-3 pt-4">
                                <input
                                    type="email"
                                    placeholder="your-email@lux.com"
                                    className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-sking-pink transition-all backdrop-blur-md"
                                />
                                <button className="px-10 py-4 bg-white text-black hover:bg-sking-pink hover:text-white font-black text-xs rounded-2xl uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 whitespace-nowrap">
                                    Subscribe
                                </button>
                            </div>

                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-2">
                                * Privacy prioritized. Unsubscribe anytime.
                            </p>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;
