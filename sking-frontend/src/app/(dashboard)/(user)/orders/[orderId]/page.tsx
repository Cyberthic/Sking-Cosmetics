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

export default function OrderDetailPage() {
    const { orderId } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
        const steps = ['pending', 'processing', 'shipped', 'delivered'];
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
                        <button className="bg-white text-black border border-gray-100 p-3 rounded-xl hover:border-black transition-all">
                            <Printer className="w-5 h-5" />
                        </button>
                        <button className="bg-black text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-neutral-800 transition-all shadow-lg">
                            <MessageCircle className="w-4 h-4" />
                            Help Center
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
                                        <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                                            <img
                                                src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-bold text-black mb-1 truncate">{item.product?.name}</h3>
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
