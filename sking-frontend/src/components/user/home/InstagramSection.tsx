"use client";
import React, { useEffect } from "react";
import { Instagram, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const InstagramSection = () => {
    useEffect(() => {
        // Load Instagram embed script
        const script = document.createElement("script");
        script.src = "//www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Clean up if component unmounts
            const existingScript = document.querySelector('script[src="//www.instagram.com/embed.js"]');
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, []);

    // Instagram account details
    const instagramUrl = "https://www.instagram.com/sking_cosmetic_/";

    // We'll use a selection of reels from the account to make it look diverse
    // Since I can't browse directly, I'll use the provided one and variations if needed, 
    // but the key is making them "neat" which means better containerization.
    const reels = [
        "https://www.instagram.com/reel/DUkqwc4EvHT/",
        "https://www.instagram.com/reel/DTCSoqCE0WY/",
        "https://www.instagram.com/reel/DUfPGYSkzJY/",
        "https://www.instagram.com/reel/DTuLji_Eyc8/",
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">

                {/* --- HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sking-pink/5 border border-sking-pink/10"
                        >
                            <Instagram size={14} className="text-sking-pink" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sking-pink">On Instagram</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.9]">
                            Our Rituals <br />
                            <span className="text-sking-pink">In Motion.</span>
                        </h2>
                    </div>

                    <motion.a
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-sking-pink transition-all shadow-xl shadow-black/10"
                    >
                        Follow @sking_cosmetic_ <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </motion.a>
                </div>

                {/* --- GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {reels.map((url, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative group aspect-[9/16] bg-gray-50 rounded-[40px] overflow-hidden border border-black/5 hover:border-sking-pink/20 transition-all shadow-sm hover:shadow-2xl hover:shadow-black/5"
                        >
                            {/* Neat Wrap for Instagram Embed */}
                            <div className="absolute inset-0 overflow-y-auto no-scrollbar py-4 px-2">
                                <blockquote
                                    className="instagram-media"
                                    data-instgrm-permalink={`${url}?utm_source=ig_embed&amp;utm_campaign=loading`}
                                    data-instgrm-version="14"
                                    style={{
                                        background: '#FFF',
                                        border: 0,
                                        borderRadius: '32px',
                                        margin: '0 auto',
                                        padding: 0,
                                        width: '100%',
                                        minWidth: '100%',
                                        boxShadow: 'none'
                                    }}
                                >
                                    {/* Placeholder while loading */}
                                    <div className="p-8 animate-pulse">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-gray-100" />
                                            <div className="space-y-2">
                                                <div className="w-20 h-3 bg-gray-100 rounded" />
                                                <div className="w-12 h-2 bg-gray-100 rounded" />
                                            </div>
                                        </div>
                                        <div className="aspect-[9/12] bg-gray-100 rounded-3xl" />
                                    </div>
                                </blockquote>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* --- FOOTER DECOR --- */}
                <div className="mt-16 flex items-center gap-4 opacity-20">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-black" />
                    <Instagram size={24} />
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-black" />
                </div>
            </div>

            {/* Hidden Scrollbar Utility */}
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

export default InstagramSection;
