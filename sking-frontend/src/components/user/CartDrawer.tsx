"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus, Truck, ArrowRight, Zap } from "lucide-react";
import { userCartService } from "@/services/user/userCartApiService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { updateCartLocally, fetchCart as fetchCartThunk, setDrawerOpen } from "@/redux/features/cartSlice";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const FREE_SHIPPING_THRESHOLD = 1000;

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const dispatch = useDispatch();
    const { items, totalAmount, loading } = useSelector((state: RootState) => state.cart);
    const router = useRouter();

    // Fetch cart when drawer opens if items are empty
    useEffect(() => {
        if (isOpen && items.length === 0) {
            dispatch(fetchCartThunk() as any);
        }
    }, [isOpen, dispatch, items.length]);

    const handleRemove = async (productId: string, variantName?: string) => {
        try {
            const response = await userCartService.removeFromCart(productId, variantName);
            if (response.success) {
                dispatch(updateCartLocally(response.cart));
                toast.success("Item removed");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to remove item");
        }
    };

    const handleUpdateQuantity = async (productId: string, variantName: string | undefined, currentQuantity: number, targetQuantity: number) => {
        if (targetQuantity < 1) return;
        if (targetQuantity > 10) {
            toast.error("maximum 10 per product");
            return;
        }

        try {
            const response = await userCartService.updateQuantity(productId, variantName, targetQuantity);
            if (response.success) {
                dispatch(updateCartLocally(response.cart));
                if (targetQuantity > currentQuantity) {
                    toast.success("Added to Bag");
                }
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update quantity");
        }
    };

    const freeShippingProgress = Math.min((totalAmount / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - totalAmount, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white text-black z-[1001] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 flex items-center justify-between border-b border-gray-100 bg-white">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                                    Your Bag <span className="text-sking-red">({items?.length || 0})</span>
                                </h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Luxury Selection</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black group"
                            >
                                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Free Shipping Tracker */}
                        {items.length > 0 && (
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tight">
                                        <Truck className={`w-4 h-4 ${freeShippingProgress === 100 ? "text-green-500" : "text-sking-red"}`} />
                                        {freeShippingProgress === 100 ? (
                                            <span className="text-green-600">You've unlocked FREE Shipping!</span>
                                        ) : (
                                            <span>Add <span className="text-sking-red font-black">₹{amountToFreeShipping.toLocaleString()}</span> for FREE Shipping</span>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400">{Math.round(freeShippingProgress)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${freeShippingProgress}%` }}
                                        className={`h-full ${freeShippingProgress === 100 ? "bg-green-500" : "bg-sking-red"} transition-all duration-500`}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                            {loading && items.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center gap-4">
                                    <div className="relative">
                                        <div className="animate-spin h-12 w-12 border-4 border-gray-100 border-t-sking-red rounded-full"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <ShoppingBag className="w-4 h-4 text-sking-red" />
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">Refining your bag...</p>
                                </div>
                            ) : items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                                            <ShoppingBag className="w-10 h-10 text-gray-200" />
                                        </div>
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-pink-50 rounded-full flex items-center justify-center"
                                        >
                                            <Zap className="w-4 h-4 text-sking-pink" />
                                        </motion.div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold uppercase tracking-tight text-gray-900 mb-2">Your bag is empty</h3>
                                        <p className="text-sm text-gray-500 max-w-[250px] mx-auto">Discover our collection and find your perfect skincare match.</p>
                                    </div>
                                    <Link
                                        href="/shop"
                                        onClick={onClose}
                                        className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white font-bold uppercase text-xs tracking-widest hover:bg-sking-red transition-all group"
                                    >
                                        Explore Collection
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            ) : (
                                items.map((item: any) => (
                                    <div key={item._id} className="flex gap-5 group">
                                        {/* Image */}
                                        <Link
                                            href={`/product/${item.product.slug || item.product._id}`}
                                            onClick={onClose}
                                            className="relative w-24 h-32 bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 rounded-sm hover:border-sking-pink transition-colors"
                                        >
                                            {item.product.images?.[0] ? (
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 font-bold tracking-tighter">SKING</div>
                                            )}
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start gap-4">
                                                    <Link
                                                        href={`/product/${item.product.slug || item.product._id}`}
                                                        onClick={onClose}
                                                        className="font-bold text-sm uppercase tracking-tight line-clamp-2 hover:text-sking-red transition-colors"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    <button
                                                        onClick={() => handleRemove(item.product._id, item.variantName)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {item.variantName && (
                                                        <span className="px-2 py-0.5 bg-gray-100 text-[10px] text-gray-500 font-bold uppercase rounded-sm">{item.variantName}</span>
                                                    )}
                                                    <span className="text-[10px] text-gray-400 font-medium">₹{(item.price || item.product?.price || 0).toLocaleString()} / unit</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center border border-gray-200 rounded-sm h-9">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product._id, item.variantName, item.quantity, item.quantity - 1)}
                                                        className="w-9 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product._id, item.variantName, item.quantity, item.quantity + 1)}
                                                        className="w-9 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-sm text-gray-900">₹{((item.price || item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                                                    {item.quantity > 1 && <p className="text-[10px] text-gray-400 font-medium">Subtotal</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer / Buttons */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)] bg-white space-y-5">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span className="text-gray-900 font-black">₹{Math.floor(totalAmount).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        <span>Shipping</span>
                                        <span className={totalAmount >= FREE_SHIPPING_THRESHOLD ? "text-green-500 font-black" : "text-gray-500"}>
                                            {totalAmount >= FREE_SHIPPING_THRESHOLD ? "FREE" : "Calculated at checkout"}
                                        </span>
                                    </div>
                                    <div className="pt-3 flex justify-between items-center text-xl font-black uppercase tracking-tighter">
                                        <span>Total Est.</span>
                                        <span className="text-sking-red">₹{Math.floor(totalAmount).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <button className="flex items-center justify-center h-14 bg-sking-red text-white font-black uppercase tracking-widest hover:bg-black transition-all text-xs shadow-xl shadow-red-50">
                                        Secure Checkout
                                    </button>
                                    <Link
                                        href="/cart"
                                        onClick={onClose}
                                        className="flex items-center justify-center h-14 border border-black text-black font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all text-xs"
                                    >
                                        View Full Bag
                                    </Link>
                                </div>
                                <p className="text-[10px] text-center text-gray-400 font-medium tracking-tight uppercase">Complimentary Samples with every order</p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

