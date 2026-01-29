'use client';

import React, { useEffect, useState } from 'react';
import { Ticket, Copy, CheckCircle2, Clock, Info, Package, ExternalLink, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { userCouponApiService } from '@/services/user/userCouponApiService';
import { toast } from 'sonner';
import Link from 'next/link';

interface Product {
    _id: string;
    name: string;
    images: string[];
    price: number;
}

interface ICoupon {
    _id: string;
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderAmount: number;
    endDate: string;
    isActive: boolean;
    couponType: 'all' | 'new_users' | 'specific_users' | 'specific_products' | 'registered_after';
    specificProducts?: Product[];
}

export default function CouponsPage() {
    const [activeCoupons, setActiveCoupons] = useState<ICoupon[]>([]);
    const [endedCoupons, setEndedCoupons] = useState<ICoupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'ended'>('active');
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [selectedCouponProducts, setSelectedCouponProducts] = useState<Product[] | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await userCouponApiService.getMyCoupons();
            if (res.success) {
                setActiveCoupons(res.data.active);
                setEndedCoupons(res.data.ended);
            }
        } catch (error) {
            console.error("Failed to fetch coupons", error);
            toast.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success("Coupon code copied!");
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const couponsToShow = activeTab === 'active' ? activeCoupons : endedCoupons;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-black">My Rewards</h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Exclusive discounts for you</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'active'
                            ? "bg-black text-white shadow-lg"
                            : "text-gray-500 hover:text-black"
                            }`}
                    >
                        Active ({activeCoupons.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('ended')}
                        className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ended'
                            ? "bg-black text-white shadow-lg"
                            : "text-gray-500 hover:text-black"
                            }`}
                    >
                        Ended ({endedCoupons.length})
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-sking-pink border-t-transparent rounded-full animate-spin" />
                </div>
            ) : couponsToShow.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 border border-gray-200 border-dashed rounded-[32px] p-12 text-center"
                >
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                        <Ticket className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-black uppercase text-black mb-2">No {activeTab} coupons</h3>
                    <p className="text-gray-500 text-sm font-medium mb-6">Check back later for new exclusive offers and rewards!</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {couponsToShow.map((coupon, index) => (
                            <motion.div
                                key={coupon._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={`group relative bg-white border rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden ${activeTab === 'ended' ? "opacity-75 grayscale-[0.5]" : "hover:-translate-y-1"
                                    }`}
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-sking-pink/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700 pointer-events-none" />

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-2">
                                            <div className="p-3 bg-black text-white rounded-2xl shadow-lg">
                                                <Ticket className="w-6 h-6" />
                                            </div>
                                            {coupon.couponType === 'specific_users' && (
                                                <div className="px-3 py-2 bg-gradient-to-r from-sking-pink to-pink-400 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Exclusive for you
                                                </div>
                                            )}
                                        </div>
                                        {activeTab === 'active' && (
                                            <div className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Verified
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-3xl font-black text-black leading-none mb-1">
                                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                                            <span className="text-lg text-sking-pink ml-1">OFF</span>
                                        </h3>
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-wide line-clamp-2 min-h-[2rem]">
                                            {coupon.description}
                                        </p>
                                    </div>

                                    {coupon.couponType === 'specific_products' && (
                                        <button
                                            onClick={() => {
                                                setSelectedCouponProducts(coupon.specificProducts || []);
                                                setIsProductModalOpen(true);
                                            }}
                                            className="mb-4 w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-black hover:text-white border border-gray-100 hover:border-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300"
                                        >
                                            <ShoppingBag className="w-3.5 h-3.5" />
                                            View Eligible Products
                                        </button>
                                    )}

                                    <div className="space-y-4 pt-6 border-t border-gray-100 border-dashed">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Coupon Code</span>
                                            <div
                                                onClick={() => activeTab === 'active' && copyToClipboard(coupon.code)}
                                                className={`flex items-center justify-between p-3 rounded-2xl border border-gray-200 bg-gray-50 group/code cursor-pointer transition-all ${activeTab === 'active' ? "hover:border-black hover:bg-white" : "cursor-default"
                                                    }`}
                                            >
                                                <span className="font-mono font-black text-black uppercase tracking-widest">{coupon.code}</span>
                                                {activeTab === 'active' && (
                                                    copiedCode === coupon.code ? (
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-gray-400 group-hover/code:text-black transition-colors" />
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                {activeTab === 'active' ? "Expires" : "Ended"}: {new Date(coupon.endDate).toLocaleDateString()}
                                            </div>
                                            {coupon.minOrderAmount > 0 && (
                                                <div className="flex items-center gap-1 text-sking-pink">
                                                    Min ₹{coupon.minOrderAmount}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Side punch hole effect */}
                                <div className="absolute top-1/2 left-0 w-4 h-8 bg-white border border-l-0 border-gray-200 rounded-r-full -translate-y-1/2 shadow-inner" />
                                <div className="absolute top-1/2 right-0 w-4 h-8 bg-white border border-r-0 border-gray-200 rounded-l-full -translate-y-1/2 shadow-inner" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Product List Modal */}
            <AnimatePresence>
                {isProductModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsProductModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-2xl font-black uppercase text-black italic">Eligible Products</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Discount applies to these items</p>
                                    </div>
                                    <button
                                        onClick={() => setIsProductModalOpen(false)}
                                        className="p-3 bg-gray-50 hover:bg-black hover:text-white rounded-2xl transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                                    {selectedCouponProducts?.length === 0 ? (
                                        <div className="text-center py-10 text-gray-400 font-bold uppercase text-xs tracking-widest">
                                            No products found
                                        </div>
                                    ) : (
                                        selectedCouponProducts?.map((product) => (
                                            <Link
                                                key={product._id}
                                                href={`/product/${product._id}`}
                                                className="group flex items-center gap-4 p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-3xl transition-all duration-300 shadow-sm hover:shadow-md"
                                            >
                                                <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 overflow-hidden shrink-0">
                                                    <img
                                                        src={product.images?.[0] || '/placeholder.png'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-black text-black uppercase truncate group-hover:text-sking-pink transition-colors">{product.name}</h4>
                                                    <p className="text-sking-pink font-black italic">₹{product.price}</p>
                                                </div>
                                                <div className="p-2 bg-white text-black rounded-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                    <ExternalLink className="w-4 h-4" />
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>

                                <button
                                    onClick={() => setIsProductModalOpen(false)}
                                    className="mt-8 w-full py-4 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-sking-pink transition-all shadow-xl shadow-black/10 hover:shadow-sking-pink/20"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Hint Box */}
            <div className="mt-12 bg-black text-white p-8 rounded-[32px] overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sking-pink/20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-sking-pink/30 transition-colors" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                        <Info className="w-8 h-8 text-sking-pink" />
                    </div>
                    <div>
                        <h4 className="text-xl font-black uppercase mb-1">How to use?</h4>
                        <p className="text-gray-400 text-sm font-medium">Copy any active coupon code and paste it in the "Coupon Code" field during checkout to redeem your reward.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
