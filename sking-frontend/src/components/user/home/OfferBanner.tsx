"use client";
import React from "react";
import Link from "next/link";

const OfferBanner = () => {
    return (
        <section className="bg-sking-pink text-white py-16 px-4 md:px-6 relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="text-center md:text-left space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                        Flat 20% Off <br />
                        <span className="text-black">On Sking Combos</span>
                    </h2>
                    <p className="text-lg font-medium">Use Code: <span className="font-bold bg-white text-sking-pink px-2 py-1 rounded">SKING20</span></p>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-lg border border-white/30 text-center">
                        <p className="text-sm uppercase tracking-widest mb-1">Offer Ends In</p>
                        <div className="text-2xl font-bold font-mono">
                            02 : 14 : 35 : 12
                        </div>
                    </div>
                    <Link
                        href="/offers"
                        className="bg-black text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                    >
                        Shop The Sale
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default OfferBanner;
