"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { userOrderService } from "@/services/user/userOrderApiService";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    CreditCard,
    ShieldCheck,
    AlertCircle,
    Package,
    MapPin,
    ChevronRight,
    X,
    RefreshCw,
    Check
} from "lucide-react";
import { useDispatch } from "react-redux";
import { clearCartLocally } from "@/redux/features/cartSlice";

export default function OrderPaymentPage() {
    const { orderId } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"initial" | "pending" | "failed" | "success">("initial");
    const [showCancelModal, setShowCancelModal] = useState(false);

    // To prevent multiple auto-opens
    const hasAutoOpened = useRef(false);

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

    const fetchOrder = async () => {
        try {
            setIsLoading(true);
            const response = await userOrderService.getOrderDetail(orderId as string);
            const orderData = response.data;
            setOrder(orderData);

            if (orderData.paymentStatus === "completed") {
                router.push(`/checkout/success?orderId=${orderData.displayId}`);
                return;
            }

            if (orderData.orderStatus === "cancelled") {
                toast.error("This order has been cancelled");
                router.push("/checkout");
                return;
            }

            // After getting order, load script and initiate if not done
            // For WhatsApp orders, we do NOT initiate Razorpay
            if (orderData.paymentMethod === 'whatsapp') {
                return;
            }

            const res = await loadRazorpayScript();
            setRazorpayLoaded(!!res);

            if (res && !hasAutoOpened.current) {
                initiatePayment(orderData);
                hasAutoOpened.current = true;
            }
        } catch (error: any) {
            console.error("Fetch Order Error:", error);
            toast.error("Failed to load order details");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const checkOrderState = async () => {
        try {
            const response = await userOrderService.getOrderDetail(orderId as string);
            const orderData = response.data;

            if (orderData.paymentStatus === "completed") {
                toast.success("Order already paid!");
                router.push(`/checkout/success?orderId=${orderData.displayId}`);
                return true;
            }

            if (orderData.orderStatus === "cancelled") {
                toast.error("This order has been cancelled");
                router.push("/checkout");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Check Order State Error:", error);
            return false;
        }
    };

    const initiatePayment = async (orderData: any) => {
        // Double check state before opening Razorpay
        const isSettled = await checkOrderState();
        if (isSettled) return;

        if (!orderData || !orderData.paymentDetails?.gatewayOrderId) {
            toast.error("Invalid payment details. Please contact support.");
            return;
        }

        setPaymentStatus("pending");

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: Math.round(orderData.finalAmount * 100),
            currency: "INR",
            name: "SKING COSMETICS",
            description: "Order Payment",
            image: "/logo.png",
            order_id: orderData.paymentDetails.gatewayOrderId,
            handler: async function (response: any) {
                try {
                    setIsVerifying(true);
                    const verificationData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    };

                    const verificationResponse = await userOrderService.verifyPayment(verificationData);

                    if (verificationResponse.success) {
                        setPaymentStatus("success");
                        toast.success(verificationResponse.message || "Payment successful!");
                        dispatch(clearCartLocally());
                        router.push(`/checkout/success?orderId=${orderData.displayId}`);
                    }
                } catch (error: any) {
                    console.error("Verification Error:", error);
                    setPaymentStatus("failed");
                    toast.error(error.response?.data?.error || "Payment verification failed");
                    // Refresh order state on failure to see if it was already paid/cancelled
                    fetchOrder();
                } finally {
                    setIsVerifying(false);
                }
            },
            prefill: {
                name: orderData.shippingAddress.name,
                email: orderData.shippingAddress.email,
                contact: orderData.shippingAddress.phoneNumber
            },
            theme: {
                color: "#FF1493"
            },
            modal: {
                ondismiss: function () {
                    setPaymentStatus("failed");
                    toast.info("Payment cancelled. You can try again or cancel the order.");
                }
            }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();

        paymentObject.on('payment.failed', function (response: any) {
            setPaymentStatus("failed");
            toast.error("Payment failed: " + response.error.description);
        });
    };

    const handleRetry = async () => {
        const isSettled = await checkOrderState();
        if (isSettled) return;

        try {
            setIsLoading(true);
            const response = await userOrderService.retryPayment(orderId as string);
            if (response.success) {
                initiatePayment(response.data);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to retry payment");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        const isSettled = await checkOrderState();
        if (isSettled) return;

        try {
            setIsCancelling(true);
            await userOrderService.cancelOrder(orderId as string);
            toast.success("Order cancelled");
            router.push("/checkout");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to cancel order");
        } finally {
            setIsCancelling(false);
            setShowCancelModal(false);
        }
    };

    if (isLoading && !order) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-[#fcfcfc]">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-sking-pink rounded-full animate-spin mb-4" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 animate-pulse">Initializing Payment...</p>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="min-h-screen bg-[#fcfcfc] pt-28 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Payment Status Card */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl border border-gray-100 relative overflow-hidden"
                        >
                            {/* Accent Background */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-[5rem] -mr-8 -mt-8 opacity-50" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="bg-black text-white p-3 rounded-2xl">
                                        <CreditCard size={24} />
                                    </div>
                                    <h1 className="text-2xl font-black uppercase tracking-tight">Complete Payment</h1>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Amount</span>
                                            <span className="text-2xl font-black">₹{order.finalAmount.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                                            <span className="text-xs font-mono font-bold text-black bg-white px-2 py-1 rounded-lg">#{order.displayId}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {order.paymentMethod === 'whatsapp' ? (
                                            <div className="w-full bg-green-50 text-green-700 font-bold p-5 rounded-2xl border border-green-200 text-center">
                                                <div className="flex justify-center items-center gap-2 mb-2">
                                                    <div className="bg-green-100 p-2 rounded-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path></svg>
                                                    </div>
                                                    <span className="text-lg">WhatsApp Order</span>
                                                </div>
                                                <p className="text-xs">
                                                    This order was placed via WhatsApp. Please check your WhatsApp messages or contact support to complete the payment manually.
                                                </p>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => initiatePayment(order)}
                                                disabled={isVerifying || isLoading || isCancelling}
                                                className="w-full bg-black hover:bg-neutral-800 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-sm transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                                            >
                                                {isVerifying ? (
                                                    <>
                                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                                        Verifying...
                                                    </>
                                                ) : (
                                                    <>
                                                        Pay Now
                                                        <ChevronRight size={18} />
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        <button
                                            onClick={() => setShowCancelModal(true)}
                                            disabled={isVerifying || isLoading || isCancelling}
                                            className="w-full bg-transparent hover:bg-red-50 text-gray-400 hover:text-red-500 font-bold py-4 rounded-2xl uppercase tracking-[0.1em] text-xs transition-all flex items-center justify-center gap-2"
                                        >
                                            <X size={16} />
                                            Cancel Order
                                        </button>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 space-y-4">
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-green-600">
                                            <ShieldCheck size={16} />
                                            Secure 256-Bit SSL Encryption
                                        </div>
                                        <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                                            By clicking "Pay Now", you will be redirected to our secure payment gateway Razorpay. The order will only be confirmed once the payment is successful.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Order Summary Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Package size={18} className="text-gray-400" />
                                <h3 className="text-sm font-black uppercase tracking-widest">Shipping Details</h3>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-gray-50 rounded-xl p-3 h-fit">
                                    <MapPin size={20} className="text-gray-400" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-black uppercase tracking-tight">{order.shippingAddress.name}</p>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                        {order.shippingAddress.street}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                                    </p>
                                    <p className="text-xs font-bold text-black pt-1">{order.shippingAddress.phoneNumber}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Order Details List */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 lg:h-[calc(100vh-12rem)] flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-8 shrink-0">
                            <h2 className="text-xl font-black uppercase tracking-tight">Your Order</h2>
                            <span className="bg-gray-50 text-gray-400 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                                {order.items.length} Items
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                                        <img
                                            src={item.product?.images?.[0] || "https://via.placeholder.com/100"}
                                            alt={item.product?.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 py-1">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                            {item.variantName || "Universal"}
                                        </h4>
                                        <h3 className="text-sm font-black text-black leading-tight mb-2">{item.product?.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 py-0.5 bg-gray-50 rounded-md">Qty: {item.quantity}</span>
                                            <span className="text-sm font-black text-sking-pink">₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-dashed border-gray-100 shrink-0 space-y-3">
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400">
                                <span>Subtotal</span>
                                <span>₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-400">
                                <span>Shipping</span>
                                <span>{order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee.toFixed(2)}`}</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-green-500">
                                    <span>Discount</span>
                                    <span>-₹{order.discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-4 text-black">
                                <span className="text-sm font-black uppercase tracking-widest">Total</span>
                                <span className="text-2xl font-black">₹{order.finalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Cancellation Confirmation Modal */}
            <AnimatePresence>
                {showCancelModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle size={32} />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-2">Cancel Order?</h3>
                                <p className="text-gray-500 text-xs font-medium leading-relaxed mb-8">
                                    Are you sure you want to cancel this order? This action cannot be undone and your items will remain in your cart.
                                </p>
                                <div className="space-y-3">
                                    <button
                                        onClick={handleCancelOrder}
                                        disabled={isCancelling}
                                        className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {isCancelling ? <RefreshCw size={16} className="animate-spin" /> : "Yes, Cancel Order"}
                                    </button>
                                    <button
                                        onClick={() => setShowCancelModal(false)}
                                        disabled={isCancelling}
                                        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl uppercase tracking-widest text-xs transition-all"
                                    >
                                        No, Keep It
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
