"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { userCartService } from "@/services/user/userCartApiService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Fetch cart when drawer opens
    useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const data = await userCartService.getCart();
            if (data.success) {
                setCart(data.cart);
            }
        } catch (err) {
            console.error("Failed to fetch cart", err);
        } finally {
            setLoading(false);
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

    const handleUpdateQuantity = async (productId: string, variantName: string | undefined, quantity: number) => {
        if (quantity < 1) return;
        try {
            await userCartService.updateQuantity(productId, variantName, quantity);
            fetchCart();
        } catch (err: any) {
            toast.error("Failed to update quantity");
        }
    };

    // Calculate total
    const total = cart?.items?.reduce((acc: number, item: any) => acc + ((item.price || 0) * item.quantity), 0) || 0;

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
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white text-black z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 flex items-center justify-between border-b border-gray-100 bg-white">
                            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                Your Bag <span className="text-sking-red">({cart?.items?.length || 0})</span>
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {loading && !cart ? (
                                <div className="flex h-full items-center justify-center">
                                    <div className="animate-spin h-8 w-8 border-4 border-sking-red border-t-transparent rounded-full"></div>
                                </div>
                            ) : (!cart || cart.items.length === 0) ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-medium">Your bag is empty.</p>
                                    <button
                                        onClick={onClose}
                                        className="text-sking-red font-bold uppercase text-xs tracking-widest hover:underline"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                cart.items.map((item: any) => (
                                    <div key={item._id} className="flex gap-4">
                                        {/* Image */}
                                        <div className="relative w-20 h-24 bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                                            {item.product.images?.[0] ? (
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-300 font-bold">NO IMG</div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="font-bold text-sm uppercase tracking-tight line-clamp-2">{item.product.name}</h3>
                                                    <button
                                                        onClick={() => handleRemove(item.product._id, item.variantName)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {item.variantName && (
                                                    <p className="text-xs text-gray-400 font-medium mt-1">{item.variantName}</p>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border border-gray-200 h-8">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product._id, item.variantName, item.quantity - 1)}
                                                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.product._id, item.variantName, item.quantity + 1)}
                                                        className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <span className="font-bold text-sm">₹{(item.price || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer / Buttons */}
                        {cart && cart.items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                                <div className="flex justify-between items-center text-lg font-black uppercase tracking-tight">
                                    <span>Subtotal</span>
                                    <span>₹{Math.floor(total).toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-center text-gray-400">Shipping & taxes calculated at checkout</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <Link
                                        href="/cart"
                                        onClick={onClose}
                                        className="flex items-center justify-center py-4 border border-black text-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all text-xs"
                                    >
                                        View Cart
                                    </Link>
                                    <button className="flex items-center justify-center py-4 bg-sking-red text-white font-bold uppercase tracking-widest hover:bg-black transition-all text-xs">
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
