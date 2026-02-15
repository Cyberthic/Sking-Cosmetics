"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { clearCartLocally } from "@/redux/features/cartSlice";
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
    ShoppingBag,
    Ticket,
    X,
    Gift,
    BadgePercent,
    ExternalLink,
    MessageSquare,
    Smartphone,
    AlertCircle
} from "lucide-react";
import { userCouponApiService } from "@/services/user/userCouponApiService";
import { userAddressService, Address } from "@/services/user/userAddressApiService";
import { userCheckoutService } from "@/services/user/userCheckoutApiService";
import { userOrderSettingsService, OrderSettings } from "@/services/admin/adminOrderSettingsApiService";
import { AddressModal } from "@/components/user/modals/AddressModal";

const generateWhatsAppMessage = (order: any, items: any[], finalTotal: number, address: any, totalAmount: number, shippingFee: number, discountAmount: number) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    let message = `*New Order from Sking Cosmetics*\n\n`;
    message += `*Order ID:* ${order.displayId} (${order._id})\n`;
    message += `*Customer:* ${address?.name}\n`;
    message += `*Phone:* ${address?.phoneNumber}\n`;
    message += `*Address:* ${address?.street}, ${address?.city}, ${address?.state} - ${address?.postalCode}\n\n`;

    message += `*Items:*\n`;
    items.forEach((item, index) => {
        message += `${index + 1}. ${item.product.name} (${item.variantName || 'Universal'}) x ${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}\n`;
        message += `🔗 _Product Link: ${origin}/product/${item.product.slug || item.product._id}_\n\n`;
    });

    message += `*--- Order Summary ---*\n`;
    message += `Subtotal: ₹${totalAmount.toFixed(2)}\n`;
    message += `Shipping: ${shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}\n`;
    if (discountAmount > 0) {
        message += `Discount: -₹${discountAmount.toFixed(2)}\n`;
    }
    message += `*Grand Total: ₹${finalTotal.toFixed(2)}*\n\n`;
    message += `Please confirm my order. Thank you!`;

    return encodeURIComponent(message);
};

function CheckoutPageContent() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { items, totalAmount } = useSelector((state: RootState) => state.cart);

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Order Settings
    const [orderSettings, setOrderSettings] = useState<OrderSettings | null>(null);
    const [deliverySettings, setDeliverySettings] = useState({ deliveryCharge: 49, freeShippingThreshold: 1000 });

    // Coupon State
    const [coupons, setCoupons] = useState<any[]>([]);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [couponError, setCouponError] = useState("");
    const [whatsappOptIn, setWhatsappOptIn] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<"online" | "whatsapp">("online");

    // Shipping & Total Logic
    const shippingFee = totalAmount > deliverySettings.freeShippingThreshold ? 0 : deliverySettings.deliveryCharge;
    const finalTotal = Math.max(0, totalAmount + shippingFee - discountAmount);

    useEffect(() => {
        // Redirection if cart is empty, but NOT while we are placing an order
        if (items.length === 0 && !isPlacingOrder) {
            toast.error("Your cart is empty. Add items to checkout.");
            router.push("/cart");
        }
    }, [items.length, isPlacingOrder, router]);

    useEffect(() => {
        fetchAddresses();
        fetchCoupons();
        fetchOrderSettings();
        fetchDeliverySettings();
    }, []);

    const fetchDeliverySettings = async () => {
        try {
            const res = await userCheckoutService.getDeliverySettings();
            if (res.success) {
                setDeliverySettings(res.data);
            }
        } catch (e) { }
    };

    const fetchOrderSettings = async () => {
        try {
            const res = await userOrderSettingsService.getSettings();
            if (res.success) {
                setOrderSettings(res.data);
                // Set default payment method based on allowed options
                if (!res.data.isOnlinePaymentEnabled && res.data.isWhatsappOrderingEnabled) {
                    setPaymentMethod("whatsapp");
                }
            }
        } catch (e) { }
    };

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

    const fetchCoupons = async () => {
        try {
            const res = await userCouponApiService.getMyCoupons();
            if (res.data && res.data.active) {
                setCoupons(res.data.active);
            }
        } catch (e) { }
    };

    const handleApplyCoupon = async (code: string = couponCode) => {
        setCouponError("");
        if (!code) {
            setCouponError("Please enter a code");
            return;
        }
        try {
            const res = await userCouponApiService.applyCoupon(code, totalAmount, items);
            if (res.success && res.data) {
                setDiscountAmount(res.data.discountAmount);
                setAppliedCoupon(res.data.coupon);
                setCouponCode(code); // Ensure input matches
                toast.success(`Coupon ${code} applied! Saved ₹${res.data.discountAmount}`);
                setIsCouponModalOpen(false);
            }
        } catch (error: any) {
            const msg = error.message || error.error || "Invalid Coupon";
            setCouponError(msg);
            toast.error(msg);
            setAppliedCoupon(null);
            setDiscountAmount(0);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponCode("");
        toast.info("Coupon removed");
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
                paymentMethod: paymentMethod,
                couponCode: appliedCoupon?.code,
                whatsappOptIn: whatsappOptIn
            });

            if (response.success) {
                const order = response.data;
                if (paymentMethod === "online") {
                    router.push(`/checkout/payment/${order.displayId}`);
                } else {
                    const selectedAddress = addresses.find(a => a._id === selectedAddressId);
                    const message = generateWhatsAppMessage(order, items, finalTotal, selectedAddress, totalAmount, shippingFee, discountAmount);
                    const cleanNumber = (orderSettings?.whatsappNumber || "+918848886919").replace(/\+/g, "").replace(/\s/g, "");
                    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${message}`;

                    dispatch(clearCartLocally());
                    toast.success("Order placed! Redirecting to WhatsApp...");

                    // Open WhatsApp in a new tab
                    window.open(whatsappUrl, '_blank');

                    // Redirect current tab to the order status/payment page
                    router.push(`/checkout/payment/${order._id}`);
                }
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to place order");
            setIsPlacingOrder(false);
        }
    };

    if (items.length === 0 && !isPlacingOrder) return null;

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

                            <div className="space-y-4">
                                {(orderSettings === null || orderSettings.isOnlinePaymentEnabled) && (
                                    <div
                                        onClick={() => setPaymentMethod("online")}
                                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === "online" ? 'border-black bg-black/[0.02]' : 'border-gray-100 hover:border-gray-200'
                                            } flex items-center justify-between`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                                                <ShieldCheck className={`w-6 h-6 ${paymentMethod === "online" ? 'text-green-500' : 'text-gray-400'}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm text-black uppercase tracking-wide">Online Secure Payment</h3>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">UPI, Cards, Netbanking</p>
                                            </div>
                                        </div>
                                        {paymentMethod === "online" && (
                                            <div className="bg-black rounded-full p-1">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {(orderSettings === null || orderSettings.isWhatsappOrderingEnabled) && (
                                    <div
                                        onClick={() => setPaymentMethod("whatsapp")}
                                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === "whatsapp" ? 'border-black bg-black/[0.02]' : 'border-gray-100 hover:border-gray-200'
                                            } flex items-center justify-between`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-green-50 rounded-xl shadow-sm border border-green-100 flex items-center justify-center text-green-600">
                                                <MessageSquare className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm text-black uppercase tracking-wide">WhatsApp Chat Ordering</h3>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">Order directly on WhatsApp</p>
                                            </div>
                                        </div>
                                        {paymentMethod === "whatsapp" && (
                                            <div className="bg-black rounded-full p-1">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {orderSettings !== null && !orderSettings.isOnlinePaymentEnabled && !orderSettings.isWhatsappOrderingEnabled && (
                                    <div className="p-8 text-center bg-red-50 rounded-2xl border-2 border-red-100">
                                        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                        <p className="text-sm font-bold text-red-600 uppercase tracking-tight">Checkout Currently Unavailable</p>
                                        <p className="text-xs text-red-500 font-medium mt-1">Please contact support or try again later.</p>
                                    </div>
                                )}
                            </div>

                            <p className="mt-6 text-xs text-gray-400 font-medium leading-relaxed flex items-center gap-2">
                                {paymentMethod === "online" ? (
                                    <>
                                        <ShieldCheck className="w-3 h-3" />
                                        Secure 128-bit SSL Encrypted Payment
                                    </>
                                ) : (
                                    <>
                                        <Smartphone className="w-3 h-3" />
                                        Redirects to official WhatsApp chat
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Coupon Section */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-pink-50 text-sking-pink rounded-lg flex items-center justify-center">
                                    <BadgePercent className="w-4 h-4" />
                                </div>
                                <h2 className="text-sm font-bold uppercase tracking-tight">Offers & Coupons</h2>
                            </div>

                            {/* Input */}
                            <div className="flex gap-2 relative mb-4">
                                <input
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="Enter Promo Code"
                                    disabled={!!appliedCoupon}
                                    className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:border-black uppercase ${appliedCoupon ? 'text-green-600 border-green-200 bg-green-50' : ''}`}
                                />
                                {appliedCoupon ? (
                                    <button onClick={removeCoupon} className="absolute right-2 top-2 p-1.5 bg-white text-gray-400 hover:text-red-500 rounded-lg shadow-sm">
                                        <X size={16} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleApplyCoupon()}
                                        className="px-6 bg-black text-white rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-neutral-800"
                                    >
                                        Apply
                                    </button>
                                )}
                            </div>
                            {couponError && <p className="text-red-500 text-xs font-bold mb-4">{couponError}</p>}

                            {/* Best Coupons */}
                            {!appliedCoupon && coupons.length > 0 && (
                                <div className="space-y-3">
                                    {coupons.slice(0, 2).map((coupon, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-dashed border-gray-200 rounded-xl hover:border-pink-200 hover:bg-pink-50/50 transition-all group cursor-pointer" onClick={() => handleApplyCoupon(coupon.code)}>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-sking-pink/10 p-2 rounded-lg text-sking-pink">
                                                    <Ticket size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-black uppercase tracking-wider">{coupon.code}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 line-clamp-1">{coupon.description || `Save ${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : ' flat'}`}</p>
                                                </div>
                                            </div>
                                            <button className="text-xs font-bold text-sking-pink uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Apply</button>
                                        </div>
                                    ))}
                                    <button onClick={() => setIsCouponModalOpen(true)} className="w-full py-2 text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest flex items-center justify-center gap-1">
                                        View All Coupons <ChevronRight size={12} />
                                    </button>
                                </div>
                            )}

                            {/* Applied Coupon Info */}
                            {appliedCoupon && (
                                <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                                    <div className="bg-green-500 text-white p-1.5 rounded-full"><Check size={12} /></div>
                                    <div>
                                        <p className="text-xs font-bold text-green-700 uppercase tracking-wide">Code {appliedCoupon.code} Applied</p>
                                        <p className="text-[10px] font-bold text-green-600">You saved ₹{discountAmount.toFixed(2)}!</p>
                                    </div>
                                </div>
                            )}
                        </div>

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
                                {discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-green-600">
                                        <span className="text-xs font-bold uppercase tracking-widest">Discount</span>
                                        <span className="text-sm font-black">-₹{discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-4 border-t border-gray-900">
                                    <span className="text-sm font-black uppercase tracking-widest text-black">Grand Total</span>
                                    <span className="text-xl font-black text-black">₹{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* WhatsApp Opt-in */}
                            <div className="mt-8 p-4 rounded-2xl bg-green-50/50 border border-green-100 flex items-start gap-4 cursor-pointer group hover:bg-green-50 transition-all" onClick={() => setWhatsappOptIn(!whatsappOptIn)}>
                                <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${whatsappOptIn ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300 group-hover:border-green-600'}`}>
                                    {whatsappOptIn && <Check size={14} className="text-white" />}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-black uppercase tracking-tight">WhatsApp Updates</p>
                                    <p className="text-[10px] text-gray-500 font-medium leading-tight">Get order updates & delivery alerts on WhatsApp</p>
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
                            className="w-full py-4 mt-6 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center justify-center gap-2"
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

            {/* Coupon Modal */}
            <AnimatePresence>
                {isCouponModalOpen && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCouponModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl relative z-10 flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                                <h3 className="text-lg font-black uppercase tracking-tight">Available Coupons</h3>
                                <button onClick={() => setIsCouponModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto bg-gray-50 custom-scrollbar flex-1">
                                {coupons.length > 0 ? (
                                    <div className="space-y-4">
                                        {coupons.map((coupon, idx) => (
                                            <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                                <div className="p-4 flex gap-4">
                                                    <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-sking-pink shrink-0">
                                                        <Gift size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h4 className="font-black text-sm uppercase tracking-wider">{coupon.code}</h4>
                                                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Active</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 font-medium mb-3">{coupon.description || 'Special discount for you'}</p>
                                                        <button
                                                            onClick={() => handleApplyCoupon(coupon.code)}
                                                            className="w-full py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-800 transition-colors"
                                                        >
                                                            Apply Coupon
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                            <Ticket size={32} />
                                        </div>
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No coupons available right now</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                                <a href="/coupons" target="_blank" className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-sking-pink hover:text-black transition-colors">
                                    View Full Coupon Page <ExternalLink size={12} />
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-[#fcfcfc]">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-sking-pink rounded-full animate-spin mb-4" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 animate-pulse">Initializing Checkout...</p>
            </div>
        }>
            <CheckoutPageContent />
        </Suspense>
    );
}
