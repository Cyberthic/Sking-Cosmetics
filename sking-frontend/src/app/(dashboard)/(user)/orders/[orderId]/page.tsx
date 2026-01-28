"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ChevronLeft,
    Package,
    Truck,
    MapPin,
    CreditCard,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowLeft,
    Printer,
    MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { userOrderService } from "@/services/user/userOrderApiService";
import Link from "next/link";
import { toast } from "sonner";

export default function OrderDetailPage() {
    const { orderId } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isExpired, setIsExpired] = useState(false);
    const [isRetrying, setIsRetrying] = React.useState(false);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetail();
        }
    }, [orderId]);

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            const res = await userOrderService.getOrderDetail(orderId as string);
            setOrder(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!order?.paymentExpiresAt || order.paymentStatus === 'completed' || order.orderStatus === 'cancelled') return;

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
                setIsExpired(false);
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
            const response = await userOrderService.retryPayment(orderId as string);

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
                                fetchOrderDetail();
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fcfcfc] pt-32 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="h-8 w-48 bg-gray-100 animate-pulse rounded-lg mb-8" />
                    <div className="bg-white rounded-[40px] p-8 h-96 animate-pulse border border-gray-100" />
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-black uppercase mb-4">Order not found</h2>
                    <Link href="/profile/orders" className="text-sking-pink font-bold uppercase tracking-widest text-xs underline">
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusStep = (status: string) => {
        const steps = ['payment_pending', 'processing', 'shipped', 'delivered'];
        const currentIndex = steps.indexOf(status);
        return currentIndex;
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 hover:border-black transition-all shadow-sm group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order</span>
                                <span className="text-lg font-black text-black">#{order._id.slice(-8).toUpperCase()}</span>
                            </div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {order.orderStatus === 'payment_pending' && !isExpired && (
                            <button
                                onClick={handleRetry}
                                disabled={isRetrying}
                                className="bg-sking-pink text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-black transition-all shadow-lg"
                            >
                                {isRetrying ? <Clock className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                                Pay Now ({timeLeft})
                            </button>
                        )}
                        <button className="bg-white text-black border border-gray-100 p-3 rounded-xl hover:border-black transition-all">
                            <Printer className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Status Track */}
                        <div className="bg-white rounded-[32px] p-6 md:p-10 border border-gray-50 shadow-sm">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-xl font-black uppercase tracking-tight">Track Order</h2>
                                <div className={`px-4 py-1.5 rounded-full border ${order.orderStatus === 'delivered' ? 'bg-green-50 border-green-100 text-green-600' :
                                    order.orderStatus === 'cancelled' ? 'bg-red-50 border-red-100 text-red-600' :
                                        'bg-orange-50 border-orange-100 text-orange-600'
                                    }`}>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{order.orderStatus}</span>
                                </div>
                            </div>

                            <div className="relative flex justify-between items-start max-w-2xl mx-auto">
                                {/* Connector Line */}
                                <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 -z-0">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(getStatusStep(order.orderStatus) / 3) * 100}%` }}
                                        className="h-full bg-black transition-all"
                                    />
                                </div>

                                {['Confirmed', 'Processing', 'On Way', 'Delivered'].map((label, idx) => {
                                    const stepIndex = getStatusStep(order.orderStatus);
                                    const isActive = idx <= stepIndex;
                                    const isCurrent = idx === stepIndex;

                                    return (
                                        <div key={idx} className="flex flex-col items-center relative z-10 w-1/4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-gray-100 text-gray-300'
                                                }`}>
                                                {idx === 0 && <CheckCircle2 className="w-5 h-5" />}
                                                {idx === 1 && <Clock className="w-5 h-5" />}
                                                {idx === 2 && <Truck className="w-5 h-5" />}
                                                {idx === 3 && <Package className="w-5 h-5" />}
                                            </div>
                                            <span className={`mt-4 text-[10px] font-black uppercase tracking-widest text-center ${isActive ? 'text-black' : 'text-gray-300'
                                                }`}>
                                                {label}
                                            </span>
                                            {isCurrent && (
                                                <motion.div
                                                    layoutId="current"
                                                    className="w-1.5 h-1.5 bg-black rounded-full mt-2"
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-[32px] p-6 md:p-10 border border-gray-50 shadow-sm">
                            <h2 className="text-xl font-black uppercase tracking-tight mb-8">Order Items ({order.items.length})</h2>
                            <div className="space-y-6">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-6 items-center pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                        <Link href={`/product/${item.product?.slug || item.product?._id}`} className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 group cursor-pointer">
                                            <img
                                                src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/product/${item.product?.slug || item.product?._id}`}>
                                                <h3 className="text-base font-bold text-black mb-1 truncate hover:text-sking-pink transition-colors cursor-pointer">{item.product?.name}</h3>
                                            </Link>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-md">
                                                    {item.variantName || 'Universal'}
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                    Qty: {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-black text-black">₹{item.price.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="hidden sm:block text-right">
                                            <p className="text-sm font-black text-sking-pink">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Shipping Info */}
                        <div className="bg-white rounded-[32px] p-6 md:p-8 border border-gray-50 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <h2 className="text-sm font-black uppercase tracking-tight">Shipping Info</h2>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-black">{order.shippingAddress.name}</p>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                    {order.shippingAddress.street}, {order.shippingAddress.city}, <br />
                                    {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                                </p>
                                <p className="text-xs text-black font-bold pt-2">{order.shippingAddress.phoneNumber}</p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-[32px] p-6 md:p-8 border border-gray-50 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h2 className="text-sm font-black uppercase tracking-tight">Payment Details</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Method</span>
                                    <span className="text-black">Online Payment</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Status</span>
                                    <span className={`uppercase ${order.paymentStatus === 'completed' ? 'text-green-500' : 'text-orange-500'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                                <div className="pt-4 border-t border-dashed border-gray-100 space-y-2">
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                                        <span>Subtotal</span>
                                        <span>₹{order.totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                                        <span>Shipping</span>
                                        <span className={order.shippingFee === 0 ? 'text-green-500' : ''}>
                                            {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee.toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 text-base font-black text-black">
                                        <span>Total</span>
                                        <span>₹{order.finalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Help Banner */}
                        <div className="bg-sking-pink/5 rounded-[32px] p-8 border border-sking-pink/10 text-center">
                            <h3 className="text-sm font-black uppercase tracking-tight mb-2">Need Help?</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-6">Our experts are here 24/7</p>
                            <button className="w-full bg-sking-pink text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-sm hover:scale-105 transition-transform">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
