"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/user/Navbar";
import { userWishlistService } from "@/services/user/userWishlistApiService";
import { userCartService } from "@/services/user/userCartApiService";
import { toast } from "react-hot-toast";

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

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Wishlist...</div>;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <Navbar />
            <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-bold mb-8">Your Wishlist</h1>

                {(!wishlist || wishlist.products.length === 0) ? (
                    <div className="text-center py-20 bg-gray-900 rounded-3xl">
                        <p className="text-xl text-gray-400 mb-6">Your wishlist is empty.</p>
                        <Link href="/" className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlist.products.map((product: any) => (
                            <div key={product._id} className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
                                <Link href={`/product/${product._id}`} className="block relative aspect-[3/4] overflow-hidden">
                                    {product.images?.[0] ? (
                                        <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                                    )}
                                </Link>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg truncate">{product.name}</h3>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-gray-300">₹{product.price}</span>
                                        <button onClick={() => handleRemove(product._id)} className="text-gray-500 hover:text-red-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                    <button onClick={() => handleMoveToCart(product)} className="w-full mt-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
