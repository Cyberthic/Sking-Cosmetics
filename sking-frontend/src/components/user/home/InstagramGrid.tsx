"use client";
import React from "react";
import Image from "next/image";
import { Instagram } from "lucide-react";

const posts = [
    "https://images.unsplash.com/photo-1512207848435-473276a44301?q=80&w=800",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800",
    "https://images.unsplash.com/photo-1522337360705-8b13d52c03cc?q=80&w=800",
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800"
];

const InstagramGrid = () => {
    return (
        <section className="py-20 px-4 md:px-0">
            <div className="max-w-7xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
                    In The <span className="text-sking-pink">Spotlight</span>
                </h2>
                <p className="text-gray-500 mb-6">Follow us @skingcosmetics</p>
                <a href="#" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-sking-pink transition-colors font-bold uppercase text-xs tracking-widest">
                    <Instagram size={18} />
                    Follow Us
                </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 w-full">
                {posts.map((src, idx) => (
                    <div key={idx} className="group relative aspect-square overflow-hidden cursor-pointer">
                        <Image
                            src={src}
                            alt="Instagram Post"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Instagram className="text-white" size={32} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default InstagramGrid;
