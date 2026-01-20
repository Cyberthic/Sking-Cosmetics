"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/user/Navbar";
import { userCartService } from "@/services/user/userCartApiService";
import { toast } from "react-hot-toast";

export default function CartPage() {
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const data = await userCartService.getCart();
            if (data.success) {
                setCart(data.cart);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (productId: string, variantName: string | undefined, quantity: number) => {
        try {
            await userCartService.updateQuantity(productId, variantName, quantity);
            fetchCart();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update quantity");
        }
    };

    const handleRemove = async (productId: string, variantName?: string) => {
        try {
            await userCartService.removeFromCart(productId, variantName);
            toast.success("Item removed");
            fetchCart();
        } catch (err) {
            toast.error("Failed to remove item");
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Cart...</div>;

    const total = cart?.items?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) || 0;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <Navbar />
            <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-bold mb-8">Your Cart</h1>

                {(!cart || cart.items.length === 0) ? (
                    <div className="text-center py-20 bg-gray-900 rounded-3xl">
                        <p className="text-xl text-gray-400 mb-6">Your cart is empty.</p>
                        <Link href="/" className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {cart.items.map((item: any) => (
                                <div key={item._id} className="flex gap-4 p-4 rounded-2xl bg-gray-900/50 border border-gray-800">
                                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                                        {item.product.images?.[0] ? (
                                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-between flex-grow">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-lg">{item.product.name}</h3>
                                                <button onClick={() => handleRemove(item.product._id, item.variantName)} className="text-gray-500 hover:text-white transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                            {item.variantName && <p className="text-sm text-gray-400">Variant: {item.variantName}</p>}
                                        </div>
                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex items-center gap-3 bg-gray-800 rounded-full px-3 py-1">
                                                <button onClick={() => handleUpdateQuantity(item.product._id, item.variantName, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center hover:text-gray-300">-</button>
                                                <span className="w-4 text-center text-sm">{item.quantity}</span>
                                                <button onClick={() => handleUpdateQuantity(item.product._id, item.variantName, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center hover:text-gray-300">+</button>
                                            </div>
                                            <div className="font-bold text-xl">₹{Math.floor(item.price * item.quantity)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-900 rounded-2xl p-6 sticky top-24">
                                <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span>₹{Math.floor(total)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Shipping</span>
                                        <span className="text-green-400">Free</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-800 flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>₹{Math.floor(total)}</span>
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
