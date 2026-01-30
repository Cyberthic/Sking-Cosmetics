"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Star, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RateProductsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
}

export const RateProductsModal: React.FC<RateProductsModalProps> = ({ isOpen, onClose, order }) => {
    if (!order) return null;

    // Filter items that have product data
    const items = order.items.filter((item: any) => item.product);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-black uppercase tracking-tight">Rate Products</h3>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                                    Select an item from Order #{order._id.slice(-8).toUpperCase()}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-3">
                                {items.map((item: any, idx: number) => (
                                    <Link
                                        key={idx}
                                        href={`/product/${item.product?.slug || item.product?._id}?orderId=${order._id}&writeReview=true`}
                                        onClick={onClose}
                                        className="flex items-center gap-4 p-4 rounded-3xl group hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                                    >
                                        <div className="w-16 h-16 rounded-2xl border border-gray-100 overflow-hidden flex-shrink-0 relative">
                                            <Image
                                                src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                                                alt={item.product?.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-black truncate group-hover:text-sking-pink transition-colors">
                                                {item.product?.name}
                                            </h4>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                                                {item.variantName || 'Universal'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-sking-pink rounded-xl text-[9px] font-black uppercase tracking-widest group-hover:bg-sking-pink group-hover:text-white transition-all">
                                            <Star size={10} fill="currentColor" />
                                            Rate
                                            <ChevronRight size={10} strokeWidth={3} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-8 bg-gray-50/50 border-t border-gray-50">
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center leading-relaxed">
                                You can only rate products that have been delivered to you. <br />
                                Your feedback helps us improve our products.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
