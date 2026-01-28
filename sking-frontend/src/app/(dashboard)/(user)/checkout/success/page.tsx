"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { userOrderService } from "@/services/user/userOrderApiService";

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get("orderId");
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            userOrderService.getOrderDetail(orderId)
                .then((res: any) => {
                    setOrder(res.data);
                    setLoading(false);
                })
                .catch((err: any) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [orderId]);

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center pt-20 pb-12 px-4">
            <div className="max-w-2xl w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[40px] p-8 lg:p-12 shadow-2xl border border-gray-100 text-center relative overflow-hidden"
                >
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sking-pink via-purple-500 to-sking-pink"></div>

                    <div className="mb-8 flex justify-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center"
                        >
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </motion.div>
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-black mb-4">
                        Order Confirmed!
                    </h1>
                    <p className="text-gray-500 font-medium mb-8 max-w-md mx-auto">
                        Your beauty essentials are being prepared for shipment. Thank you for choosing SKING COSMETICS.
                    </p>

                    {loading ? (
                        <div className="h-24 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-black/10 border-t-black rounded-full animate-spin" />
                        </div>
                    ) : order ? (
                        <div className="bg-gray-50 rounded-3xl p-6 mb-10 text-left border border-gray-100">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order ID</span>
                                <span className="text-sm font-black text-black">#{order._id.slice(-8).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Paid</span>
                                <span className="text-sm font-black text-sking-pink">₹{order.finalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Estimated Delivery</span>
                                <span className="text-sm font-black text-black">3-5 Business Days</span>
                            </div>
                        </div>
                    ) : null}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href={`/orders/${orderId}`}
                            className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <Package className="w-4 h-4" />
                            View Order
                        </Link>
                        <Link
                            href="/shop"
                            className="bg-white text-black border-2 border-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                    </div>
                </motion.div>

                <p className="text-center mt-8 text-xs text-gray-400 font-bold uppercase tracking-[0.3em]">
                    A confirmation email has been sent to your inbox
                </p>
            </div>
        </div>
    );
}
