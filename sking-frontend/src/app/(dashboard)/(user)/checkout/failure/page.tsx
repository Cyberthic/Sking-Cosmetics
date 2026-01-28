"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, RefreshCw, ShoppingBag, MessageSquare, AlertTriangle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { userOrderService } from "@/services/user/userOrderApiService";
import { toast } from "sonner";

function OrderFailureContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get("orderId");

    const [order, setOrder] = React.useState<any>(null);
    const [timeLeft, setTimeLeft] = React.useState<string>("");
    const [isExpired, setIsExpired] = React.useState(false);
    const [isRetrying, setIsRetrying] = React.useState(false);

    const fetchOrderDetails = async () => {
        if (!orderId) return;
        try {
            const response = await userOrderService.getOrderDetail(orderId);
            if (response.success) {
                setOrder(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch order", error);
        }
    };

    React.useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    React.useEffect(() => {
        if (!order?.paymentExpiresAt) return;

        const interval = setInterval(() => {
            const expiry = new Date(order.paymentExpiresAt).getTime();
            const now = new Date().getTime();
            const diff = expiry - now;

            if (diff <= 0) {
                setTimeLeft("EXPIRED");
                setIsExpired(true);
                clearInterval(interval);
            } else {
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`${minutes}m ${seconds}s`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [order]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if ((window as any).Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleRetry = async () => {
        if (!orderId || isExpired) return;

        try {
            setIsRetrying(true);
            const response = await userOrderService.retryPayment(orderId);

            if (response.success) {
                const retryOrder = response.data;
                const scriptLoaded = await loadRazorpayScript();

                if (!scriptLoaded) {
                    toast.error("Razorpay SDK failed to load");
                    return;
                }

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: Math.round(retryOrder.finalAmount * 100),
                    currency: "INR",
                    name: "SKING COSMETICS",
                    description: "Order Retry Payment",
                    order_id: retryOrder.paymentDetails.gatewayOrderId,
                    handler: async function (res: any) {
                        try {
                            const verificationResponse = await userOrderService.verifyPayment({
                                razorpay_order_id: res.razorpay_order_id,
                                razorpay_payment_id: res.razorpay_payment_id,
                                razorpay_signature: res.razorpay_signature,
                            });

                            if (verificationResponse.success) {
                                toast.success("Payment successful!");
                                router.push(`/checkout/success?orderId=${orderId}`);
                            }
                        } catch (error: any) {
                            toast.error("Verification failed");
                            setIsRetrying(false);
                        }
                    },
                    prefill: {
                        name: retryOrder.shippingAddress.name,
                        email: retryOrder.shippingAddress.email,
                        contact: retryOrder.shippingAddress.phoneNumber
                    },
                    theme: { color: "#FF1493" },
                    modal: {
                        ondismiss: function () {
                            setIsRetrying(false);
                        }
                    }
                };

                const paymentObject = new (window as any).Razorpay(options);
                paymentObject.open();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to retry payment");
            setIsRetrying(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center pt-20 pb-12 px-4 text-center">
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

                    {timeLeft && !isExpired && (
                        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Clock className="w-3 h-3 text-sking-pink animate-pulse" />
                            Retry window expires in: <span className="text-sking-pink">{timeLeft}</span>
                        </div>
                    )}

                    {isExpired && (
                        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <AlertTriangle className="w-3 h-3" />
                            Payment Window Expired
                        </div>
                    )}

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

                    {!isExpired ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={handleRetry}
                                disabled={isRetrying}
                                className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400"
                            >
                                {isRetrying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                Complete Payment
                            </button>
                            <Link
                                href="/orders"
                                className="bg-white text-black border-2 border-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                My Orders
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            <Link
                                href="/cart"
                                className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Return to Cart
                            </Link>
                        </div>
                    )}
                </motion.div>
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
