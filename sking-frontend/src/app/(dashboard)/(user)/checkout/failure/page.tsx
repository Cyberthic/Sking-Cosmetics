"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, RefreshCw, ShoppingBag, MessageSquare, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function OrderFailureContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center pt-20 pb-12 px-4">
            <div className="max-w-2xl w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[40px] p-8 lg:p-12 shadow-2xl border border-gray-100 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

                    <div className="mb-8 flex justify-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                            className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center"
                        >
                            <XCircle className="w-12 h-12 text-red-500" />
                        </motion.div>
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-black mb-4">
                        Payment Failed
                    </h1>
                    <p className="text-gray-500 font-medium mb-4 max-w-md mx-auto">
                        Something went wrong during the transaction. Don't worry, your cart is still safe and items are reserved.
                    </p>

                    <div className="bg-amber-50 rounded-2xl p-4 mb-8 flex items-start gap-3 text-left border border-amber-100">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-amber-900">Refund Information</p>
                            <p className="text-xs text-amber-700 font-medium mt-1">
                                If any money was deducted from your account, it will be automatically credited back within 5-7 business days.
                            </p>
                        </div>
                    </div>

                    <div className="bg-red-50/50 rounded-3xl p-6 mb-10 text-left border border-red-100">
                        <p className="text-xs font-bold text-red-800 uppercase tracking-widest leading-relaxed">
                            Common reasons for failure:
                        </p>
                        <ul className="mt-3 space-y-2">
                            <li className="text-[11px] text-red-600 font-bold uppercase tracking-wide flex items-center gap-2">
                                • Insufficient funds in account
                            </li>
                            <li className="text-[11px] text-red-600 font-bold uppercase tracking-wide flex items-center gap-2">
                                • Transaction timed out
                            </li>
                            <li className="text-[11px] text-red-600 font-bold uppercase tracking-wide flex items-center gap-2">
                                • Payment gateway issues
                            </li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            href="/checkout"
                            className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </Link>
                        <Link
                            href="/cart"
                            className="bg-white text-black border-2 border-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Review Cart
                        </Link>
                    </div>
                </motion.div>

                <button className="w-full mt-8 text-xs text-gray-400 font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:text-black transition-colors">
                    <MessageSquare className="w-3 h-3" />
                    Need help? Contact support
                </button>
            </div>
        </div>
    );
}

export default function OrderFailurePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-100 border-t-red-500 rounded-full animate-spin" />
            </div>
        }>
            <OrderFailureContent />
        </Suspense>
    );
}
