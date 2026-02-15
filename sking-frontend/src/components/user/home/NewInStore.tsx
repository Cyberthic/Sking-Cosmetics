"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react";

// Left Grid Products
const newInProducts = [
    {
        id: 1,
        name: "Radiant Creamy Concealer",
        category: "MAKEUP",
        price: 39.99,
        reviews: 20,
        image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Eyeshadow Palette",
        category: "EYES MAKEUP",
        price: 29.99,
        reviews: 31,
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Hyaluronic Acid Serum",
        category: "SKINCARE",
        price: 19.99,
        reviews: 19,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Curl Defining Cream",
        category: "HAIRCARE",
        price: 24.99,
        reviews: 17,
        image: "https://images.unsplash.com/photo-1596704017382-30508d71b65d?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 5,
        name: "Liquid Eyeliner",
        category: "EYES MAKEUP",
        price: 14.99,
        reviews: 26,
        image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: 6,
        name: "Matte Setting Powder",
        category: "FACE MAKEUP",
        price: 12.99,
        reviews: 18,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=400&auto=format&fit=crop"
    }
];

// Right Featured Product
const featuredNew = {
    id: 101,
    name: "Mascara Perfect Black",
    category: "EYES MAKEUP",
    price: 12.99,
    reviews: 56,
    images: [
        "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?q=80&w=800&auto=format&fit=crop", // Main Mascara
        "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=400&auto=format&fit=crop"
    ]
};

const NewInStore = () => {
    const [quantity, setQuantity] = useState(0);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-bold uppercase text-black">
                        New In Store
                    </h2>
                    <Link href="/shop" className="text-sking-pink font-bold hover:underline">
                        View All
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Grid (2/3 width) */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                        {newInProducts.map((product) => (
                            <div key={product.id} className="group flex flex-col">
                                <div className="relative h-48 w-full bg-gray-50 rounded-lg overflow-hidden mb-3 p-4 flex items-center justify-center">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold">{product.category}</span>
                                    <h3 className="font-bold text-sm text-black line-clamp-2 leading-tight h-9">{product.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="font-bold text-lg">₹{product.price}</span>
                                        <div className="flex text-sking-pink">
                                            <Star size={10} fill="currentColor" />
                                            <Star size={10} fill="currentColor" />
                                            <Star size={10} fill="currentColor" />
                                            <Star size={10} fill="currentColor" />
                                            <Star size={10} fill="currentColor" className="text-gray-300" />
                                        </div>
                                        <span className="text-[10px] text-gray-400">({product.reviews} Sold)</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Featured Card (1/3 width) */}
                    <div className="w-full lg:w-[400px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6 flex flex-col">

                        {/* Main Image Carousel Area */}
                        <div className="relative w-full h-80 mb-6 bg-gray-50 rounded-xl overflow-hidden">
                            <Image
                                src={featuredNew.images[0]}
                                alt={featuredNew.name}
                                fill
                                className="object-contain p-4"
                            />
                        </div>

                        {/* Thumbnails */}
                        <div className="flex items-center justify-between mb-6 px-4">
                            <button className="text-gray-400 hover:text-black"><ChevronLeft size={20} /></button>
                            <div className="flex gap-2">
                                {featuredNew.images.map((img, i) => (
                                    <div key={i} className={`w-12 h-12 rounded border ${i === 0 ? 'border-sking-pink' : 'border-gray-200'} p-1 relative`}>
                                        <Image src={img} alt="" fill className="object-contain" />
                                    </div>
                                ))}
                            </div>
                            <button className="text-gray-400 hover:text-black"><ChevronRight size={20} /></button>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-3">
                            <span className="text-[10px] text-gray-500 uppercase font-bold">{featuredNew.category}</span>
                            <div className="flex items-start justify-between">
                                <h3 className="text-xl font-bold text-black">{featuredNew.name}</h3>
                                <span className="text-2xl font-bold text-black">₹{featuredNew.price}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <div className="flex text-sking-pink">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill="currentColor" />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-400 ml-2">({featuredNew.reviews} Sold)</span>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 space-y-4">
                                {/* Quantity */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs font-bold uppercase text-gray-500">Quantity</span>
                                    <div className="flex items-center border border-gray-300 rounded">
                                        <button onClick={() => setQuantity(Math.max(0, quantity - 1))} className="px-3 py-1 text-gray-500 hover:bg-gray-100">-</button>
                                        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 text-gray-500 hover:bg-gray-100">+</button>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 py-3 border border-sking-pink text-sking-pink font-bold text-sm uppercase rounded hover:bg-sking-pink hover:text-white transition-colors flex items-center justify-center gap-2">
                                        <ShoppingBag size={16} /> Add to Bag
                                    </button>
                                    <button className="flex-1 py-3 bg-sking-pink text-white font-bold text-sm uppercase rounded hover:bg-pink-600 transition-colors">
                                        Buy Now
                                    </button>
                                    <button className="p-3 border border-gray-300 text-gray-400 rounded hover:border-red-500 hover:text-red-500 transition-colors">
                                        <Heart size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default NewInStore;
