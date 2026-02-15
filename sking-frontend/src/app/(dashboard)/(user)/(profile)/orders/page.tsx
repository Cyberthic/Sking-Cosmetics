'use client';

import React, { useEffect, useState } from 'react';
import { Package, Search, ChevronRight, Clock, CheckCircle2, Truck, AlertCircle, CreditCard, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { userOrderService } from '@/services/user/userOrderApiService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { clearCartLocally } from '@/redux/features/cartSlice';
import { RateProductsModal } from '@/components/user/RateProductsModal';

export default function OrdersPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [selectedOrderForRate, setSelectedOrderForRate] = useState<any>(null);
    const [isRateModalOpen, setIsRateModalOpen] = useState(false);

    const handleRateItems = (order: any) => {
        if (order.items.length === 1) {
            const item = order.items[0];
            router.push(`/product/${item.product?.slug || item.product?._id}?orderId=${order._id}&writeReview=true`);
        } else {
            setSelectedOrderForRate(order);
            setIsRateModalOpen(true);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await userOrderService.getUserOrders();
            setOrders(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleRetry = async (orderId: string, order: any) => {
        try {
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
                                toast.success(verificationResponse.message || "Payment successful!");
                                dispatch(clearCartLocally());
                                fetchOrders(); // Refresh list
                            }
                        } catch (error: any) {
                            toast.error(error.response?.data?.error || "Verification failed");
                        }
                    },
                    prefill: {
                        name: retryOrder.shippingAddress.name,
                        email: retryOrder.shippingAddress.email,
                        contact: retryOrder.shippingAddress.phoneNumber
                    },
                    theme: { color: "#FF1493" }
                };

                const paymentObject = new (window as any).Razorpay(options);
                paymentObject.open();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to retry payment");
        }
    };

    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item: any) => item.product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-3 h-3 text-orange-500" />;
            case 'processing': return <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />;
            case 'shipped': return <Truck className="w-3 h-3 text-purple-500" />;
            case 'delivered': return <CheckCircle2 className="w-3 h-3 text-green-500" />;
            case 'cancelled': return <AlertCircle className="w-3 h-3 text-red-500" />;
            default: return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-black uppercase tracking-tighter text-black">Order History</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by order ID or product..."
                        className="bg-white border border-gray-200 rounded-xl px-10 py-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black w-full md:w-80 transition-all placeholder:text-gray-400 font-medium"
                    />
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-gray-50 animate-pulse h-40 rounded-3xl" />
                    ))}
                </div>
            ) : filteredOrders.length > 0 ? (
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredOrders.map((order, idx) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group bg-white border border-gray-100 rounded-[32px] p-6 hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order</span>
                                            <span className="text-sm font-black text-black">#{order._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 self-start sm:self-center">
                                        {/* WhatsApp Order Badge */}
                                        {order.paymentMethod === 'whatsapp' && (
                                            <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100 flex items-center gap-1.5">
                                                <MessageSquare className="w-3 h-3" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">WhatsApp Order</span>
                                            </div>
                                        )}
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${order.orderStatus === 'delivered' ? 'bg-green-50 border-green-100 text-green-600' :
                                            order.orderStatus === 'cancelled' ? 'bg-red-50 border-red-100 text-red-600' :
                                                'bg-orange-50 border-orange-100 text-orange-600'
                                            }`}>
                                            {getStatusIcon(order.orderStatus)}
                                            <span className="text-[10px] font-black uppercase tracking-widest">{order.orderStatus}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    <div className="flex -space-x-4 overflow-hidden py-1">
                                        {order.items.slice(0, 3).map((item: any, i: number) => (
                                            <div key={i} className="relative w-16 h-16 rounded-2xl border-2 border-white bg-gray-50 overflow-hidden shadow-sm">
                                                <img
                                                    src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                                                    alt={item.product?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="w-16 h-16 rounded-2xl border-2 border-white bg-black flex items-center justify-center text-white text-xs font-black shadow-sm">
                                                +{order.items.length - 3}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-black truncate mb-1">
                                            {order.items[0].product?.name}
                                            {order.items.length > 1 && ` + ${order.items.length - 1} more items`}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-medium">
                                            Total: <span className="font-bold text-black">₹{order.finalAmount.toFixed(2)}</span>
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                        {order.orderStatus === 'payment_pending' && order.paymentStatus !== 'completed' && order.paymentMethod !== 'whatsapp' && (
                                            <button
                                                onClick={() => handleRetry(order._id, order)}
                                                className="bg-sking-pink text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg"
                                            >
                                                <CreditCard className="w-4 h-4" />
                                                Pay Now
                                            </button>
                                        )}
                                        {order.orderStatus === 'delivered' && (
                                            <button
                                                onClick={() => handleRateItems(order)}
                                                className="bg-white text-sking-pink border border-sking-pink px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-pink-50 transition-all shadow-lg"
                                            >
                                                Rate Items
                                            </button>
                                        )}
                                        <Link
                                            href={`/orders/${order._id}`}
                                            className="bg-black text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all shadow-lg group"
                                        >
                                            Order Details
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-gray-100 rounded-[40px] p-16 text-center shadow-sm"
                >
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-100">
                        <Package className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-3">No orders found</h3>
                    <p className="text-gray-500 font-medium mb-8 max-w-xs mx-auto">Looks like you haven't indulged in anything yet. Time to pamper yourself!</p>
                    <Link
                        href="/shop"
                        className="inline-flex bg-black text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all shadow-xl"
                    >
                        Start Shopping
                    </Link>
                </motion.div>
            )
            }

            <RateProductsModal
                isOpen={isRateModalOpen}
                onClose={() => setIsRateModalOpen(false)}
                order={selectedOrderForRate}
            />
        </div >
    );
}
