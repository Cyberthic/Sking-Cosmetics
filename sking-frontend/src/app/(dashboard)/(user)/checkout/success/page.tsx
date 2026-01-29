"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Package, ArrowRight, ShoppingBag, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { userOrderService } from "@/services/user/userOrderApiService";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get("orderId");
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orderId) {
            userOrderService.getOrderDetail(orderId)
                .then((res: any) => {
                    if (res.success) {
                        setOrder(res.data);
                    } else {
                        setError("Could not retrieve order details.");
                    }
                    setLoading(false);
                })
                .catch((err: any) => {
                    console.error(err);
                    setError("An error occurred while fetching your order.");
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [orderId]);

    if (!orderId && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
                    <p className="text-gray-500 mb-6">We couldn't find the order you're looking for.</p>
                    <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">
                        Back to Shop
                    </Link>
                </div>
            </div>
        );
    }

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
                        <div className="h-24 flex items-center justify-center gap-3">
                            <div className="w-6 h-6 border-2 border-black/10 border-t-black rounded-full animate-spin" />
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Fetching Details...</span>
                        </div>
                    ) : order ? (
                        <div className="bg-gray-50 rounded-3xl p-6 mb-10 text-left border border-gray-100">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order ID</span>
                                <span className="text-sm font-black text-black">#{order.displayId}</span>
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
                    ) : error ? (
                        <div className="bg-orange-50 rounded-3xl p-6 mb-10 text-center border border-orange-100">
                            <p className="text-sm font-bold text-orange-800">{error}</p>
                            <p className="text-xs text-orange-600 mt-2">But don't worry, your order was successful!</p>
                        </div>
                    ) : null}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href={orderId ? `/orders/${orderId}` : "/orders"}
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

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-100 border-t-sking-pink rounded-full animate-spin" />
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
