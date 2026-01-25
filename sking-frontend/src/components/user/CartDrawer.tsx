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

import { createPortal } from "react-dom";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const FREE_SHIPPING_THRESHOLD = 1000;

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const dispatch = useDispatch();
    const { items, totalAmount, loading } = useSelector((state: RootState) => state.cart);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        } else {
            document.body.style.overflow = "unset";
            document.body.style.paddingRight = "0px";
        }
        return () => {
            document.body.style.overflow = "unset";
            document.body.style.paddingRight = "0px";
        };
    }, [isOpen]);

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

    // Prevent hydration mismatch by only rendering portal on client
    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-[6px] z-[99999]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                        className="fixed top-0 right-0 h-[100dvh] w-full sm:w-[480px] bg-white text-black z-[100000] shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 flex items-center justify-between border-b border-gray-100 bg-white shadow-sm z-10">
                            <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
                                    Your Bag <span className="text-sking-red tabular-nums">({items?.length || 0})</span>
                                </h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-sking-red animate-pulse"></span>
                                    Luxury Beauty Curations
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 rounded-full transition-all text-gray-400 hover:text-black hover:rotate-90 group"
                            >
                                <X className="w-7 h-7" />
                            </button>
                        </div>

                        {/* Free Shipping Tracker */}
                        {items.length > 0 && (
                            <div className="px-8 py-5 bg-gray-50 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-tight">
                                        <div className={`p-1.5 rounded-full ${freeShippingProgress === 100 ? "bg-green-100 text-green-600" : "bg-red-50 text-sking-red"}`}>
                                            <Truck className="w-4 h-4" />
                                        </div>
                                        {freeShippingProgress === 100 ? (
                                            <span className="text-green-600">Complimentary Shipping Unlocked!</span>
                                        ) : (
                                            <span>Spend <span className="text-black font-black">₹{amountToFreeShipping.toLocaleString()}</span> more for FREESHIP</span>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400">{Math.round(freeShippingProgress)}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${freeShippingProgress}%` }}
                                        className={`h-full ${freeShippingProgress === 100 ? "bg-green-500" : "bg-sking-red"} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 custom-scrollbar">
                            {loading && items.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center gap-5">
                                    <div className="relative">
                                        <div className="animate-spin h-14 w-14 border-[3px] border-gray-100 border-t-sking-red rounded-full"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <ShoppingBag className="w-5 h-5 text-sking-red" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 animate-pulse">Authenticating Selection...</p>
                                </div>
                            ) : items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                                    <div className="relative">
                                        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center">
                                            <ShoppingBag className="w-12 h-12 text-gray-200" />
                                        </div>
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute -top-2 -right-2 w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center shadow-lg"
                                        >
                                            <Zap className="w-5 h-5 text-sking-pink" />
                                        </motion.div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black uppercase tracking-tighter text-gray-900 italic">Empty Collection</h3>
                                        <p className="text-sm text-gray-500 max-w-[280px] mx-auto leading-relaxed">Your luxury curation is currently empty. Explore our latest arrivals to begin your journey.</p>
                                    </div>
                                    <Link
                                        href="/shop"
                                        onClick={onClose}
                                        className="inline-flex items-center gap-3 px-10 py-4 bg-black text-white font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-sking-red transition-all group shadow-2xl hover:shadow-red-200"
                                    >
                                        Explore Collection
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            ) : (
                                items.map((item: any) => (
                                    <div key={item._id} className="flex gap-6 group relative">
                                        {/* Image */}
                                        <Link
                                            href={`/product/${item.product.slug || item.product._id}`}
                                            onClick={onClose}
                                            className="relative w-28 h-36 bg-gray-50 flex-shrink-0 overflow-hidden rounded-sm hover:ring-1 ring-sking-pink transition-all shadow-sm"
                                        >
                                            {item.product.images?.[0] ? (
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 font-bold tracking-tighter">SKING</div>
                                            )}
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-start gap-4">
                                                    <Link
                                                        href={`/product/${item.product.slug || item.product._id}`}
                                                        onClick={onClose}
                                                        className="font-black text-sm uppercase tracking-tight leading-tight line-clamp-2 hover:text-sking-red transition-colors italic"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    <button
                                                        onClick={() => handleRemove(item.product._id, item.variantName)}
                                                        className="h-8 w-8 flex items-center justify-center text-gray-200 hover:text-red-600 hover:bg-red-50 rounded-full transition-all flex-shrink-0"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {item.variantName && (
                                                        <span className="px-2 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-sm">{item.variantName}</span>
                                                    )}
                                                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">₹{(item.price || item.product?.price || 0).toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product._id, item.variantName, item.quantity, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full text-gray-500 transition-all active:scale-95 shadow-sm"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-10 text-center text-xs font-black tabular-nums">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product._id, item.variantName, item.quantity, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-full text-gray-500 transition-all active:scale-95 shadow-sm"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-lg text-gray-900 tabular-nums">₹{((item.price || item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Est. Subtotal</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer / Buttons */}
                        {items.length > 0 && (
                            <div className="p-8 border-t border-gray-100 bg-white space-y-6 shadow-[0_-20px_50px_rgba(0,0,0,0.04)]">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        <span>Merchandise Subtotal</span>
                                        <span className="text-gray-900 whitespace-nowrap">₹{Math.floor(totalAmount).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        <span>Complimentary Shipping</span>
                                        <span className={totalAmount >= FREE_SHIPPING_THRESHOLD ? "text-green-500" : "text-gray-400"}>
                                            {totalAmount >= FREE_SHIPPING_THRESHOLD ? "UNLOCKED" : "CALC. AT STEP 2"}
                                        </span>
                                    </div>
                                    <div className="h-px bg-gray-100 w-full" />
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-sking-red uppercase tracking-[0.3em] mb-1">Total Amount</span>
                                            <span className="text-3xl font-black uppercase tracking-tighter italic">Total.</span>
                                        </div>
                                        <span className="text-4xl font-black text-black tabular-nums tracking-tighter">₹{Math.floor(totalAmount).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 pt-2">
                                    <button className="flex items-center justify-center h-16 bg-sking-red text-white font-black uppercase tracking-[0.2em] hover:bg-black transition-all text-xs shadow-2xl shadow-red-100 active:scale-[0.98]">
                                        Proceed to Checkout
                                    </button>
                                    <Link
                                        href="/cart"
                                        onClick={onClose}
                                        className="flex items-center justify-center h-14 border border-black text-black font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all text-[10px] active:scale-[0.98]"
                                    >
                                        Edit Full Selection
                                    </Link>
                                </div>
                                <div className="flex items-center justify-center gap-4 text-[9px] text-gray-400 font-bold tracking-widest uppercase">
                                    <div className="flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                                        Secure Payments
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                                        Authentic Products
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

