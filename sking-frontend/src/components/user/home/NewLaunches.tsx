"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const newProducts = [
    {
        id: "new1",
        name: "Velvet Matte Liquid Lip",
        desc: "Weightless comfort with intense color payoff.",
        image: "https://images.unsplash.com/photo-1625093742435-09c69298e6f4?q=80&w=1200&auto=format&fit=crop",
        theme: "bg-gray-100"
    },
    {
        id: "new2",
        name: "Luminous Glass Skin Serum",
        desc: "Get that Korean glass skin look instantly.",
        image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=1200&auto=format&fit=crop",
        theme: "bg-rose-50"
    }
]

const NewLaunches = () => {
    return (
        <section className="py-20 px-4 md:px-6 bg-white">
            <div className="max-w-7xl mx-auto mb-12 text-center">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-black mb-4">
                    Just Dropped
                </h2>
                <Link href="/new-arrivals" className="text-sking-red font-bold uppercase tracking-widest border-b-2 border-sking-red pb-1 hover:text-black hover:border-black transition-all">
                    View All New
                </Link>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {newProducts.map((prod) => (
                    <div key={prod.id} className={`group relative h-[600px] overflow-hidden ${prod.theme} flex flex-col justify-end p-8`}>
                        <Image
                            src={prod.image}
                            alt={prod.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                        <div className="relative z-10 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="mb-2">
                                <span className="bg-sking-pink text-white text-xs font-bold px-2 py-1 uppercase tracking-widest rounded-md">New</span>
                            </div>
                            <h3 className="text-3xl font-black uppercase mb-2">{prod.name}</h3>
                            <p className="text-gray-200 mb-6 max-w-md">{prod.desc}</p>
                            <Link href={`/product/${prod.id}`} className="inline-block bg-white text-black font-bold px-8 py-3 uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                                Shop Now
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NewLaunches;
