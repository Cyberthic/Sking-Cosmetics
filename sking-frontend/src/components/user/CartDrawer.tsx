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
                        transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.6 }}
                        className="fixed top-0 right-0 h-[100dvh] w-full sm:w-[420px] bg-white text-black z-[100000] shadow-[0_0_40px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 bg-white z-10">
                            <div>
                                <h2 className="text-lg font-bold uppercase tracking-[0.1em] flex items-center gap-2">
                                    Your Bag <span className="text-sking-red tabular-nums font-medium opacity-70">({items?.length || 0})</span>
                                </h2>
                                <p className="text-[9px] text-gray-400 font-medium uppercase tracking-[0.15em] mt-0.5 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-sking-red/40 animate-pulse"></span>
                                    Signature Skincare
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-full transition-all text-gray-400 hover:text-black group active:scale-90"
                            >
                                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Free Shipping Tracker - More Subtle */}
                        {items.length > 0 && (
                            <div className="px-6 py-3.5 bg-gray-50/50 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                                        <Truck className={`w-3.5 h-3.5 ${freeShippingProgress === 100 ? "text-green-500" : "text-sking-red/60"}`} />
                                        {freeShippingProgress === 100 ? (
                                            <span className="text-green-600">Free Shipping Unlocked</span>
                                        ) : (
                                            <span>Add <span className="text-black">₹{amountToFreeShipping.toLocaleString()}</span> for free shipping</span>
                                        )}
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-300">{Math.round(freeShippingProgress)}%</span>
                                </div>
                                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${freeShippingProgress}%` }}
                                        className={`h-full ${freeShippingProgress === 100 ? "bg-green-500" : "bg-black"} transition-all duration-700`}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Cart Items - Increased listing area via smaller gaps */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
                            {loading && items.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center gap-4">
                                    <div className="relative">
                                        <div className="animate-spin h-10 w-10 border-2 border-gray-100 border-t-sking-red/50 rounded-full"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <ShoppingBag className="w-3.5 h-3.5 text-sking-red/50" />
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-300">Synchronizing Selection</p>
                                </div>
                            ) : items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                    <div className="relative mb-6">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                                            <ShoppingBag className="w-8 h-8 text-gray-200" />
                                        </div>
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                                            transition={{ repeat: Infinity, duration: 2.5 }}
                                            className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100"
                                        >
                                            <Zap className="w-4 h-4 text-sking-pink" />
                                        </motion.div>
                                    </div>
                                    <h3 className="text-lg font-bold uppercase tracking-tight text-gray-900 mb-2">Your Bag is Empty</h3>
                                    <p className="text-[13px] text-gray-400 max-w-[240px] mx-auto leading-relaxed mb-8">
                                        Indulge in our collection and find your next skincare essential.
                                    </p>
                                    <Link
                                        href="/shop"
                                        onClick={onClose}
                                        className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-black text-white font-bold uppercase text-[10px] tracking-[0.15em] hover:bg-sking-red transition-all active:scale-95"
                                    >
                                        Start Shopping
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            ) : (
                                items.map((item: any) => (
                                    <div key={item._id} className="flex gap-4 group">
                                        {/* Image */}
                                        <Link
                                            href={`/product/${item.product.slug || item.product._id}`}
                                            onClick={onClose}
                                            className="relative w-24 h-28 bg-gray-50 flex-shrink-0 overflow-hidden rounded-[4px] border border-gray-100 hover:border-gray-200 transition-colors"
                                        >
                                            {item.product.images?.[0] ? (
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 font-bold tracking-tighterUppercase">SKING</div>
                                            )}
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between items-start gap-3">
                                                    <Link
                                                        href={`/product/${item.product.slug || item.product._id}`}
                                                        onClick={onClose}
                                                        className="font-bold text-[13px] uppercase tracking-tight leading-[1.3] line-clamp-2 hover:text-sking-red transition-colors"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    <button
                                                        onClick={() => handleRemove(item.product._id, item.variantName)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {item.variantName && (
                                                        <span className="text-[9px] font-bold text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">{item.variantName}</span>
                                                    )}
                                                    <span className="text-[10px] text-gray-400 font-medium">₹{(item.price || item.product?.price || 0).toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center border border-gray-100 rounded-[4px] bg-white">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product._id, item.variantName, item.quantity, item.quantity - 1)}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 text-gray-400 transition-colors"
                                                    >
                                                        <Minus className="w-2.5 h-2.5" />
                                                    </button>
                                                    <span className="w-7 text-center text-[11px] font-bold tabular-nums">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product._id, item.variantName, item.quantity, item.quantity + 1)}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 text-gray-400 transition-colors"
                                                    >
                                                        <Plus className="w-2.5 h-2.5" />
                                                    </button>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-[13px] text-gray-900 tabular-nums">₹{((item.price || item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer - More Compact */}
                        {items.length > 0 && (
                            <div className="px-6 py-5 border-t border-gray-100 bg-white space-y-5 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                                <div className="space-y-2.5">
                                    <div className="flex justify-between items-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                        <span>Merchandise total</span>
                                        <span className="text-gray-900 font-bold">₹{Math.floor(totalAmount).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                        <span>Shipping</span>
                                        <span className={totalAmount >= FREE_SHIPPING_THRESHOLD ? "text-green-600 font-bold" : "text-gray-400"}>
                                            {totalAmount >= FREE_SHIPPING_THRESHOLD ? "Complimentary" : "Free over ₹1,000"}
                                        </span>
                                    </div>
                                    <div className="pt-2 flex justify-between items-center h-10 border-t border-gray-50">
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-900">Estimated Total</span>
                                        <span className="text-xl font-bold tracking-tighter">₹{Math.floor(totalAmount).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-2.5">
                                    <Link
                                        href="/checkout"
                                        onClick={onClose}
                                        className="flex items-center justify-center h-13 bg-black text-white font-bold uppercase tracking-[0.15em] hover:bg-sking-red transition-all text-[10px] active:scale-[0.98]"
                                    >
                                        Secure Checkout
                                    </Link>
                                    <Link
                                        href="/cart"
                                        onClick={onClose}
                                        className="flex items-center justify-center h-12 border border-black/10 text-black font-bold uppercase tracking-[0.15em] hover:bg-gray-50 transition-all text-[9px] active:scale-[0.98]"
                                    >
                                        View Detail Bag
                                    </Link>
                                </div>
                                <p className="text-[9px] text-center text-gray-300 font-medium tracking-tight uppercase">Complimentary Samples with every order</p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

