"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Plus,
    Check,
    ChevronRight,
    CreditCard,
    ShieldCheck,
    Truck,
    Clock,
    ShoppingBag
} from "lucide-react";
import { userAddressService, Address } from "@/services/user/userAddressApiService";
import { userCheckoutService } from "@/services/user/userCheckoutApiService";
import { userOrderService } from "@/services/user/userOrderApiService";
import { AddressModal } from "@/components/user/modals/AddressModal";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalAmount } = useSelector((state: RootState) => state.cart);

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Mock shipping fee logic from CartDrawer
    const shippingFee = totalAmount > 1000 ? 0 : 49;
    const finalTotal = totalAmount + shippingFee;

    const fetchAddresses = async () => {
        try {
            setIsLoading(true);
            const response = await userAddressService.getAllAddresses();
            setAddresses(response.data);

            // Auto-select primary address if available
            const primary = response.data.find((addr: Address) => addr.isPrimary);
            if (primary) {
                setSelectedAddressId(primary._id);
            } else if (response.data.length > 0) {
                setSelectedAddressId(response.data[0]._id);
            }
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Redirection if cart is empty
        if (items.length === 0) {
            toast.error("Your cart is empty. Add items to checkout.");
            router.push("/cart");
            return;
        }
        fetchAddresses();
    }, [items, router]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            toast.error("Please select a shipping address");
            return;
        }

        try {
            setIsPlacingOrder(true);
            const response = await userCheckoutService.placeOrder({
                addressId: selectedAddressId,
                paymentMethod: "online"
            });

            if (response.success) {
                const order = response.data;
                const res = await loadRazorpayScript();

                if (!res) {
                    toast.error("Razorpay SDK failed to load. Are you online?");
                    return;
                }

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: Math.round(order.finalAmount * 100),
                    currency: "INR",
                    name: "SKING COSMETICS",
                    description: "Order Payment",
                    image: "/logo.png", // Replace with your actual logo path
                    order_id: order.paymentDetails.gatewayOrderId,
                    handler: async function (response: any) {
                        try {
                            const verificationData = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            };

                            const verificationResponse = await userOrderService.verifyPayment(verificationData);

                            if (verificationResponse.success) {
                                toast.success("Payment successful!");
                                router.push(`/checkout/success?orderId=${order._id}`);
                            }
                        } catch (error: any) {
                            console.error("Verification Error:", error);
                            toast.error(error.response?.data?.error || "Payment verification failed");
                            router.push(`/checkout/failure?orderId=${order._id}`);
                        }
                    },
                    prefill: {
                        name: order.shippingAddress.name,
                        email: order.shippingAddress.email,
                        contact: order.shippingAddress.phoneNumber
                    },
                    theme: {
                        color: "#FF1493" // Hot pink color
                    },
                    modal: {
                        ondismiss: function () {
                            setIsPlacingOrder(false);
                        }
                    }
                };

                const paymentObject = new (window as any).Razorpay(options);
                paymentObject.open();

                paymentObject.on('payment.failed', function (response: any) {
                    toast.error("Payment failed: " + response.error.description);
                    router.push(`/checkout/failure?orderId=${order._id}`);
                });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to place order");
            setIsPlacingOrder(false);
        }
    };

    if (items.length === 0) return null;

    return (
        <div className="bg-[#fcfcfc] min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">

                {/* Header Section */}
                <div className="mb-10 text-center lg:text-left">
                    <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-black mb-2">Checkout</h1>
                    <p className="text-gray-500 font-medium">Complete your beauty upgrade</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Side: Address & Payment */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Address Selection Section */}
                        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold uppercase tracking-tight">Shipping Address</h2>
                                </div>
                                <button
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="flex items-center gap-2 text-sm font-bold text-sking-pink hover:text-pink-600 transition-colors uppercase tracking-wider"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add New
                                </button>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-4">
                                    <div className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Addresses...</p>
                                </div>
                            ) : addresses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <AnimatePresence>
                                        {addresses.map((addr: Address) => (
                                            <motion.div
                                                key={addr._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                onClick={() => setSelectedAddressId(addr._id)}
                                                className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md ${selectedAddressId === addr._id
                                                    ? 'border-black bg-black/[0.02]'
                                                    : 'border-gray-100 bg-white hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${addr.type === 'Home' ? 'bg-blue-50 text-blue-600' :
                                                        addr.type === 'Work' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'
                                                        }`}>
                                                        {addr.type}
                                                    </span>
                                                    {selectedAddressId === addr._id && (
                                                        <div className="bg-black rounded-full p-1">
                                                            <Check className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className="font-bold text-sm text-black mb-1">{addr.name}</h3>
                                                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-1">{addr.street}</p>
                                                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                                    {addr.city}, {addr.state} - {addr.postalCode}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2 font-medium">{addr.phoneNumber}</p>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <p className="text-gray-500 font-bold mb-4 uppercase tracking-widest text-xs">No addresses found</p>
                                    <button
                                        onClick={() => setIsAddressModalOpen(true)}
                                        className="bg-black text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all shadow-lg"
                                    >
                                        Add Shipping Address
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Payment Method Section */}
                        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold uppercase tracking-tight">Payment Method</h2>
                            </div>

                            <div className="p-4 rounded-2xl border-2 border-black bg-black/[0.02] flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                                        <ShieldCheck className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-black uppercase tracking-wide">Online Secure Payment</h3>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">UPI, Cards, Netbanking</p>
                                    </div>
                                </div>
                                <div className="bg-black rounded-full p-1">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            </div>

                            <p className="mt-6 text-xs text-gray-400 font-medium leading-relaxed flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                Secure 128-bit SSL Encrypted Payment
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold uppercase tracking-tight mb-8">Order Summary</h2>

                            {/* Product List */}
                            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                        <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                            <img
                                                src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-black px-1.5 py-0.5 rounded-bl-lg">
                                                x{item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1">{item.product.name}</h3>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.variantName || 'Universal'}</p>
                                            <p className="text-sm font-bold text-sking-pink mt-1">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-4 pt-6 border-t border-dashed border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Subtotal</span>
                                    <span className="text-sm font-black text-black">₹{totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Shipping</span>
                                    <span className={`text-sm font-black ${shippingFee === 0 ? 'text-green-500' : 'text-black'}`}>
                                        {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-gray-900">
                                    <span className="text-sm font-black uppercase tracking-widest text-black">Grand Total</span>
                                    <span className="text-xl font-black text-black">₹{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* CTA */}
                            <button
                                disabled={isPlacingOrder || !selectedAddressId}
                                onClick={handlePlaceOrder}
                                className="w-full mt-8 bg-black hover:bg-neutral-800 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-sm transition-all shadow-2xl flex items-center justify-center gap-3 relative overflow-hidden group"
                            >
                                {isPlacingOrder ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </div>
                                ) : (
                                    <>
                                        Place Order
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            {/* Trust Badges */}
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100">
                                    <Truck className="w-3 h-3 text-gray-400" />
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Fast Delivery</span>
                                </div>
                                <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100">
                                    <ShieldCheck className="w-3 h-3 text-gray-400" />
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">100% Genuine</span>
                                </div>
                            </div>
                        </div>

                        {/* Back to Cart */}
                        <button
                            onClick={() => router.push('/cart')}
                            className="w-full py-4 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-3 h-3" />
                            Return to Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                address={null} // Always add new in checkout
                refresh={fetchAddresses}
            />
        </div>
    );
}
