"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/user/Navbar";
import { userWishlistService } from "@/services/user/userWishlistApiService";
import { userCartService } from "@/services/user/userCartApiService";
import { toast } from "react-hot-toast";

import Footer from "@/components/user/Footer";

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const data = await userWishlistService.getWishlist();
            if (data.success) {
                setWishlist(data.wishlist);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId: string) => {
        try {
            await userWishlistService.toggleWishlist(productId);
            toast.success("Removed from wishlist");
            fetchWishlist();
        } catch (err) {
            toast.error("Failed to update wishlist");
        }
    };

    const handleMoveToCart = async (product: any) => {
        try {
            // Defaulting to 1st variant if exists, else base
            const variantName = product.variants?.length > 0 ? product.variants[0].name : undefined;
            await userCartService.addToCart(product._id, variantName, 1);
            toast.success("Added to Cart");
            // Optionally remove from wishlist? 
            // await handleRemove(product._id);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to add to cart");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-sking-black border-t-sking-red rounded-full animate-spin"></div>
                <p className="font-bold tracking-widest uppercase text-sm">Loading Wishlist...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white text-black selection:bg-sking-pink selection:text-white flex flex-col">
            <Navbar />

            {/* Page Header - Dark to support transparent Navbar */}
            <div className="relative h-[40vh] min-h-[300px] w-full bg-sking-black flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-neutral-900" />
                <div className="relative z-10 text-center space-y-4 px-4">
                    <p className="text-sking-pink font-bold tracking-widest uppercase text-xs md:text-sm">
                        Saved for Later
                    </p>
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic">
                        Your <span className="text-sking-red">Wishlist.</span>
                    </h1>
                </div>
            </div>

            <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-20 w-full">
                {(!wishlist || wishlist.products.length === 0) ? (
                    <div className="text-center py-20">
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Save your favorite luxury items here to shop them later.</p>
                        <Link href="/shop" className="inline-block px-10 py-4 bg-black text-white font-bold tracking-widest hover:bg-sking-red transition-all uppercase text-sm">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {wishlist.products.map((product: any) => (
                            <div key={product._id} className="group flex flex-col">
                                <Link href={`/product/${product.slug || product._id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                                    {product.images?.[0] ? (
                                        <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold uppercase text-xs">No Image</div>
                                    )}
                                    {/* Quick action - Remove */}
                                    <button
                                        onClick={(e) => { e.preventDefault(); handleRemove(product._id); }}
                                        className="absolute top-4 right-4 h-8 w-8 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-sking-red hover:text-white transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </Link>

                                <div className="flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg uppercase tracking-tight truncate pr-4">{product.name}</h3>
                                        <span className="font-medium">₹{product.price}</span>
                                    </div>

                                    <button onClick={() => handleMoveToCart(product)} className="w-full mt-auto py-3 bg-black text-white font-bold tracking-widest uppercase hover:bg-sking-red transition-all text-sm">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
