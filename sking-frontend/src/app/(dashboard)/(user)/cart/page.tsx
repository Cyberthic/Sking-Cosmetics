"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import { userCartService } from "@/services/user/userCartApiService";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { updateCartLocally } from "@/redux/features/cartSlice";

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

    const dispatch = useDispatch();

    const handleUpdateQuantity = async (productId: string, variantName: string | undefined, currentQuantity: number, targetQuantity: number) => {
        if (targetQuantity < 1) return;
        if (targetQuantity > 10) {
            toast.error("maximum 10 per product");
            return;
        }

        try {
            const response = await userCartService.updateQuantity(productId, variantName, targetQuantity);
            if (response.success) {
                setCart(response.cart);
                dispatch(updateCartLocally(response.cart));
                if (targetQuantity > currentQuantity) {
                    toast.success("Added to Bag");
                }
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update quantity");
        }
    };

    const handleRemove = async (productId: string, variantName?: string) => {
        try {
            const response = await userCartService.removeFromCart(productId, variantName);
            if (response.success) {
                setCart(response.cart);
                dispatch(updateCartLocally(response.cart));
                toast.success("Item removed");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to remove item");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-sking-black border-t-sking-red rounded-full animate-spin"></div>
                <p className="font-bold tracking-widest uppercase text-sm">Loading Cart...</p>
            </div>
        </div>
    );

    const total = cart?.items?.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0) || 0;

    return (
        <>
            {/* Page Header - Dark to support transparent Navbar */}
            <div className="relative h-[40vh] min-h-[300px] w-full bg-sking-black flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-neutral-900" />
                <div className="relative z-10 text-center space-y-4 px-4">
                    <p className="text-sking-pink font-bold tracking-widest uppercase text-xs md:text-sm">
                        Shopping Bag
                    </p>
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic">
                        Your <span className="text-sking-red">Picks.</span>
                    </h1>
                </div>
            </div>

            <div className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-20 w-full">
                {(!cart || cart.items.length === 0) ? (
                    <div className="text-center py-20">
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Your bag is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any luxury essentials to your collection yet.</p>
                        <Link href="/shop" className="inline-block px-10 py-4 bg-black text-white font-bold tracking-widest hover:bg-sking-red transition-all uppercase text-sm">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-8">
                            {cart.items.map((item: any) => (
                                <div key={item._id} className="flex gap-6 p-6 border-b border-gray-100 items-start">
                                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 flex-shrink-0">
                                        {item.product.images?.[0] ? (
                                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-300 uppercase font-bold">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-between flex-grow min-h-[128px]">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-xl uppercase tracking-tight">{item.product.name}</h3>
                                                {item.variantName && <p className="text-sm text-gray-400 mt-1 uppercase tracking-wide">{item.variantName}</p>}
                                                <div className="mt-2 font-medium text-lg">₹{(item.price || 0).toLocaleString()}</div>
                                            </div>
                                            <button onClick={() => handleRemove(item.product._id, item.variantName)} className="text-gray-300 hover:text-sking-red transition-colors p-1">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex items-center gap-4">
                                                <span className="text-xs uppercase font-bold text-gray-400">Qty</span>
                                                <div className="flex items-center border border-gray-200">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product._id, item.variantName, item.quantity, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product._id, item.variantName, item.quantity, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="font-bold text-xl tracking-tight">₹{((item.price || 0) * item.quantity).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-50 p-8 sticky top-32">
                                <h3 className="text-xl font-black uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">Order Summary</h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-600 uppercase text-sm font-medium">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-black">₹{Math.floor(total).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 uppercase text-sm font-medium">
                                        <span>Shipping</span>
                                        <span className="text-gray-400">Calculated at checkout</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 flex justify-between font-black text-xl">
                                        <span>Total</span>
                                        <span>₹{Math.floor(total).toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Tax included and shipping calculated at checkout.</p>
                                </div>
                                <button className="w-full py-4 bg-sking-red text-white font-bold tracking-widest uppercase hover:bg-black transition-all duration-300">
                                    Checkout
                                </button>
                                <div className="mt-8 flex justify-center gap-4 text-gray-300">
                                    {/* Trust badges placeholders */}
                                    <div className="h-6 w-10 bg-gray-200/50 rounded"></div>
                                    <div className="h-6 w-10 bg-gray-200/50 rounded"></div>
                                    <div className="h-6 w-10 bg-gray-200/50 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
