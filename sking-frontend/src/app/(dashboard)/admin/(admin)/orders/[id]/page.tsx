"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminOrderService } from "@/services/admin/adminOrderApiService";
import Badge from "@/components/admin/ui/badge/Badge";
import Button from "@/components/admin/ui/button/Button";
import {
    ChevronLeft,
    User,
    MapPin,
    CreditCard,
    Package,
    Clock,
    Truck,
    CheckCircle2,
    XCircle,
    Printer,
    Mail,
    Phone,
    Copy,
    ArrowRight,
    MessageSquare,
    ShieldCheck
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { ManualPaymentModal } from "@/components/admin/orders/ManualPaymentModal";

export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [statusLoading, setStatusLoading] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isManualPaymentModalOpen, setIsManualPaymentModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [isCriticalUpdate, setIsCriticalUpdate] = useState(false);

    const CANCELLATION_TEMPLATES = [
        { label: "Payment Not Done", message: "Order cancelled because payment was not received within the required timeframe." },
        { label: "Not Confirmed", message: "WhatsApp ordering was not confirmed by the customer via chat." },
        { label: "Out of Stock", message: "Unfortunately, some items in your order are currently out of stock." },
        { label: "Invalid Details", message: "The shipping or contact details provided were invalid/incomplete." },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.getElementById('status-dropdown-container');
            if (dropdown && !dropdown.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    useEffect(() => {
        if (id) fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const res = await adminOrderService.getOrderById(id as string);
            if (res.success) {
                setOrder(res.order);
            }
        } catch (error) {
            console.error("Failed to fetch order", error);
            toast.error("Order not found");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = (status: string, isCritical: boolean = false) => {
        setPendingStatus(status);
        setIsCriticalUpdate(isCritical);
        setStatusMessage(""); // Reset message
        setIsDropdownOpen(false);
        setIsConfirmModalOpen(true);
    };

    const confirmStatusUpdate = async () => {
        if (!pendingStatus) return;
        try {
            setStatusLoading(true);
            const res = await adminOrderService.updateOrderStatus(id as string, pendingStatus, isCriticalUpdate, statusMessage);
            if (res.success) {
                setOrder(res.order);
                toast.success(`Order status ${isCriticalUpdate ? 'CRITICALLY ' : ''}updated to ${pendingStatus.replace('_', ' ')}`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setStatusLoading(false);
            setIsConfirmModalOpen(false);
        }
    };

    const confirmManualPayment = async (data: { upiTransactionId?: string }) => {
        try {
            setStatusLoading(true);
            const res = await adminOrderService.confirmManualPayment(id as string, data);
            if (res.success) {
                setOrder(res.order);
                toast.success("Payment confirmed! Order moved to processing.");
                setIsManualPaymentModalOpen(false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to confirm payment");
        } finally {
            setStatusLoading(false);
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sking-red"></div>
        </div>
    );

    if (!order) return <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">Order not found</div>;

    const steps = [
        { key: 'payment_pending', label: 'Payment Pending', icon: Clock, color: 'text-amber-500' },
        { key: 'processing', label: 'Processing', icon: Package, color: 'text-blue-500' },
        { key: 'shipped', label: 'Shipped', icon: Truck, color: 'text-indigo-500' },
        { key: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'text-green-500' },
    ];

    const currentStepIndex = steps.findIndex(s => s.key === order.orderStatus);
    const isCancelled = order.orderStatus === 'cancelled';

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen bg-transparent space-y-8">
            {/* Status Hero Section */}
            <div className="bg-white dark:bg-white/[0.03] rounded-[40px] p-8 border border-gray-50 dark:border-white/[0.05] shadow-sm flex flex-col md:flex-row items-center gap-8 transition-all duration-500 relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 text-black/[0.02] dark:text-white/[0.02] transition-transform group-hover:scale-110 duration-1000">
                    {isCancelled ? <XCircle size={240} /> : steps[currentStepIndex]?.icon && React.createElement(steps[currentStepIndex].icon, { size: 240 })}
                </div>

                <div className={`relative z-10 w-28 h-28 rounded-[35px] flex items-center justify-center shadow-2xl transition-all duration-500 ${isCancelled ? 'bg-error-50 dark:bg-error-500/10 text-error-500' : 'bg-success-50 dark:bg-success-500/10 text-success-500'}`}>
                    {isCancelled ? <XCircle size={56} className="animate-pulse" /> : steps[currentStepIndex]?.icon && React.createElement(steps[currentStepIndex].icon, { size: 56, className: "animate-bounce-slow" })}
                </div>
                <div className="relative z-10 text-center md:text-left flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`w-2 h-2 rounded-full animate-ping ${isCancelled ? 'bg-error-500' : 'bg-success-500'}`}></span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Live Status</span>
                            </div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white mb-2 italic">
                                {isCancelled ? 'Order Cancelled.' : steps[currentStepIndex]?.label + '.'}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-[0.2em]">
                                {isCancelled ? 'This order was cancelled and will not be processed.' : `The order is currently being ${steps[currentStepIndex]?.label.toLowerCase()}.`}
                            </p>

                            {order.orderStatus === 'payment_pending' && order.paymentExpiresAt && (
                                <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-2xl w-fit">
                                    <Clock size={14} className="text-amber-600 animate-pulse" />
                                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest whitespace-nowrap">
                                        Expiring: {new Date(order.paymentExpiresAt).toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-center md:items-end bg-gray-50 dark:bg-white/5 p-4 rounded-3xl border border-gray-100 dark:border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Last Update Received</span>
                            <span className="text-xl font-black dark:text-white">
                                {order.statusHistory?.length > 0
                                    ? new Date(order.statusHistory[order.statusHistory.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    : new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                }
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                {new Date(order.updatedAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all shadow-sm"
                    >
                        <ChevronLeft className="w-5 h-5 dark:text-white" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order Reference</span>
                            <span className="text-xl font-black text-black dark:text-white">#{order._id.toUpperCase()}</span>
                            <button onClick={() => copyToClipboard(order._id, 'Order ID')} className="p-1 text-gray-300 hover:text-black">
                                <Copy size={12} />
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge color={isCancelled ? 'error' : 'success'} size="sm" className="font-black uppercase tracking-widest text-[9px]">
                                {order.orderStatus.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                {new Date(order.createdAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none flex items-center gap-2">
                        <Printer size={16} /> Print
                    </Button>

                    {order.paymentMethod === 'whatsapp' && order.paymentStatus === 'pending' && (
                        <Button
                            variant="primary"
                            className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 border-none flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                            onClick={() => setIsManualPaymentModalOpen(true)}
                        >
                            <CreditCard size={16} /> Confirm Payment
                        </Button>
                    )}
                    <div className="relative flex-1 md:flex-none" id="status-dropdown-container">
                        <Button
                            variant="primary"
                            className="w-full flex items-center justify-between gap-2 min-w-[160px]"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className="flex-grow text-center">Change Status</span>
                            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-90' : 'rotate-270'}`} />
                        </Button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                                <div className="p-2 border-b border-gray-50 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.02]">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-3 py-1">Select New Status</span>
                                </div>
                                <div className="p-1">
                                    {(isCancelled || order.orderStatus === 'delivered' ? [] :
                                        order.orderStatus === 'shipped' ? ['delivered', 'cancelled'] :
                                            ['processing', 'shipped', 'delivered', 'cancelled']
                                    )
                                        .filter(s => s !== order.orderStatus)
                                        .map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusUpdate(status)}
                                                className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-xl transition-all duration-200 flex items-center justify-between group/item mb-1 last:mb-0 dark:text-gray-300"
                                            >
                                                <span>{status.replace('_', ' ')}</span>
                                                <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" />
                                            </button>
                                        ))}
                                    {(isCancelled || order.orderStatus === 'delivered') && (
                                        <div className="p-3 text-[10px] text-gray-500 font-bold text-center uppercase">
                                            {order.orderStatus.replace('_', ' ')} orders cannot be modified
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Columns - Body Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Detailed Status Tracks (Amazon Style) */}
                    <div className="bg-white dark:bg-white/[0.03] rounded-[40px] p-8 border border-gray-50 dark:border-white/[0.05] shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                                <Truck size={20} />
                            </div>
                            <h3 className="font-black uppercase tracking-tight text-sm dark:text-white">Live Tracking Timeline</h3>
                        </div>

                        <div className="relative pl-8 space-y-10 border-l-2 border-dashed border-gray-100 dark:border-white/10 ml-4 mb-4">
                            {(order.statusHistory?.length > 0 ? [...order.statusHistory].reverse() : [{ status: order.orderStatus, timestamp: order.updatedAt, message: 'Current order status' }]).map((history: any, idx: number) => {
                                const step = steps.find(s => s.key === history.status) || { icon: Clock, color: 'text-gray-400' };
                                const Icon = step.icon;
                                const isFirst = idx === 0;

                                return (
                                    <div key={idx} className="relative group">
                                        <div className={`absolute -left-[45px] top-0 w-8 h-8 rounded-full border-4 border-white dark:border-gray-900 shadow-sm flex items-center justify-center transition-all duration-300 ${isFirst ? 'bg-black dark:bg-white text-white dark:text-black scale-125' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                            <Icon size={isFirst ? 14 : 12} />
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className={`text-sm font-black uppercase tracking-wide italic ${isFirst ? 'text-black dark:text-white' : 'text-gray-400'}`}>
                                                        {history.status.replace('_', ' ')}
                                                    </h4>
                                                    {history.isCritical && (
                                                        <Badge color="error" size="sm" className="text-[8px] animate-pulse">Critical Change</Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 uppercase tracking-wider">
                                                    {history.message || (isFirst ? 'Most recent update' : 'Previous update')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest leading-none">
                                                    {new Date(history.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                </div>
                                                <div className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                                                    {new Date(history.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white dark:bg-white/[0.03] rounded-[40px] border border-gray-50 dark:border-white/[0.05] shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 dark:border-white/[0.05] flex justify-between items-center">
                            <h2 className="text-lg font-black uppercase tracking-tight dark:text-white">Order Items</h2>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{order.items.length} Items</span>
                        </div>
                        <div className="divide-y divide-gray-50 dark:divide-white/[0.05]">
                            {order.items.map((item: any, idx: number) => (
                                <div
                                    key={idx}
                                    onClick={() => item.product?._id && router.push(`/admin/products/edit/${item.product._id}`)}
                                    className="p-8 flex gap-6 hover:bg-gray-50/30 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group/item"
                                >
                                    <div className="relative w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 flex-shrink-0">
                                        {item.product?.images?.[0] ? (
                                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover group-hover/item:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 font-bold uppercase">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-grow flex flex-col justify-center">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-black dark:text-white uppercase tracking-tight text-sm line-clamp-1 group-hover/item:text-sking-red transition-colors">{item.product?.name || 'Unknown Product'}</h3>
                                            <ArrowRight size={12} className="text-gray-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1 flex items-center gap-2">
                                            {item.variantName || 'Universal'} <span className="w-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></span> Qty: {item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center items-end min-w-[100px]">
                                        <div className="font-black text-black dark:text-white text-sm">₹{(item.price * item.quantity).toLocaleString()}</div>
                                        <div className="text-[10px] text-gray-400 font-medium">₹{item.price.toLocaleString()} each</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-gray-50/50 dark:bg-white/[0.02]">
                            <div className="space-y-4 max-w-xs ml-auto">
                                <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span className="text-black dark:text-white">₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest text-green-600">
                                    <span>Shipping</span>
                                    <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee.toLocaleString()}`}</span>
                                </div>
                                {order.discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest text-green-600">
                                        <span>Discount {order.discountCode && <span className="text-[10px] bg-green-50 text-green-700 px-1 rounded ml-1 border border-green-100">{order.discountCode}</span>}</span>
                                        <span>-₹{order.discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="pt-4 border-t border-gray-200 dark:border-white/[0.1] flex justify-between items-center">
                                    <span className="text-sm font-black uppercase tracking-tighter italic dark:text-white">Total Amount</span>
                                    <span className="text-xl font-black text-sking-red">₹{order.finalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Summaries & Meta */}
                <div className="space-y-8">
                    {/* Customer Info */}
                    <div className="bg-white dark:bg-white/[0.03] rounded-[40px] p-8 border border-gray-50 dark:border-white/[0.05] shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-black dark:bg-gray-100 text-white dark:text-black rounded-2xl flex items-center justify-center shadow-lg">
                                    <User size={20} />
                                </div>
                                <h3 className="font-black uppercase tracking-tight text-sm dark:text-white">Customer Profile</h3>
                            </div>
                            {order.user?._id && (
                                <button
                                    onClick={() => router.push(`/admin/customers/${order.user._id}`)}
                                    className="p-2 bg-gray-50 dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-xl transition-all border border-transparent hover:border-black dark:hover:border-white"
                                >
                                    <ArrowRight size={16} />
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Full Name</h4>
                                <p className="text-sm font-bold text-black dark:text-white uppercase tracking-tight">{order.user?.name || order.shippingAddress.name}</p>
                            </div>
                            <div className="pt-4 border-t border-gray-50 dark:border-white/5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Address</h4>
                                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => copyToClipboard(order.user?.email || order.shippingAddress.email, 'Email')}>
                                    <Mail size={12} className="text-gray-300 dark:text-gray-600" />
                                    <p className="text-sm font-medium text-black dark:text-white truncate pr-4">{order.user?.email || order.shippingAddress.email}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-50 dark:border-white/5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Phone Number</h4>
                                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => copyToClipboard(order.user?.phoneNumber || order.shippingAddress.phoneNumber, 'Phone')}>
                                    <Phone size={12} className="text-gray-300 dark:text-gray-600" />
                                    <p className="text-sm font-bold text-black dark:text-white tracking-widest">{order.user?.phoneNumber || order.shippingAddress.phoneNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-white dark:bg-white/[0.03] rounded-[40px] p-8 border border-gray-50 dark:border-white/[0.05] shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-sking-pink text-white rounded-2xl flex items-center justify-center shadow-lg">
                                    <MapPin size={20} />
                                </div>
                                <h3 className="font-black uppercase tracking-tight text-sm dark:text-white">Shipping Address</h3>
                            </div>
                            {order.shippingAddress.addressType && (
                                <Badge color="info" size="sm" className="font-black uppercase tracking-widest text-[8px]">
                                    {order.shippingAddress.addressType}
                                </Badge>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Recipient Info</h4>
                                <p className="text-sm font-bold text-black dark:text-white">{order.shippingAddress.name}</p>
                                <p className="text-xs text-gray-500">{order.shippingAddress.email} • {order.shippingAddress.phoneNumber}</p>
                            </div>
                            <div className="pt-4 border-t border-gray-50 dark:border-white/5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Street / Landmark</h4>
                                <p className="text-sm font-bold text-black dark:text-white">{order.shippingAddress.street}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-50 dark:border-white/5">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">City</h4>
                                    <p className="text-black dark:text-white font-bold text-xs uppercase tracking-tight">{order.shippingAddress.city}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">State</h4>
                                    <p className="text-black dark:text-white font-bold text-xs uppercase tracking-tight">{order.shippingAddress.state}</p>
                                </div>
                            </div>
                            <div className="pt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Pincode</h4>
                                    <p className="text-black dark:text-white font-black text-sm">{order.shippingAddress.postalCode}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Country</h4>
                                    <p className="text-black dark:text-white font-bold text-xs uppercase tracking-tight">{order.shippingAddress.country}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-white dark:bg-white/[0.03] rounded-[40px] p-8 border border-gray-50 dark:border-white/[0.05] shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                                <CreditCard size={20} />
                            </div>
                            <h3 className="font-black uppercase tracking-tight text-sm dark:text-white">Payment Info</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-white/[0.05]">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Type</span>
                                <div className="flex items-center gap-2 text-xs font-black uppercase text-black dark:text-white italic">
                                    {order.paymentMethod === 'whatsapp' ? (
                                        <>
                                            <MessageSquare size={14} className="text-emerald-500" />
                                            WhatsApp Order
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={14} className="text-brand-500" />
                                            Online Secure Order
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-white/[0.05]">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Gateway</span>
                                <span className="text-xs font-black uppercase text-black dark:text-white italic">
                                    {order.paymentMethod === 'whatsapp' ? 'Direct Chat' : 'Razorpay'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-white/[0.05]">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Flow Status</span>
                                <Badge color={order.paymentStatus === 'completed' ? 'success' : order.paymentStatus === 'failed' ? 'error' : 'warning'} size="sm" className="font-black uppercase text-[8px] tracking-[0.2em]">
                                    {order.paymentStatus}
                                </Badge>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Gateway Order ID</h4>
                                    <p className="text-[10px] font-mono font-medium text-gray-400 dark:text-white/60 truncate uppercase">{order.paymentDetails?.gatewayOrderId || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Transaction ID</h4>
                                    <p className="text-[10px] font-mono font-medium text-black dark:text-white truncate uppercase">
                                        {order.paymentDetails?.gatewayPaymentId || order.manualPaymentDetails?.upiTransactionId || 'N/A'}
                                    </p>
                                </div>
                                {order.manualPaymentDetails?.verifiedBy && (
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Verified By</h4>
                                        <p className="text-[10px] font-bold text-emerald-500 uppercase">{order.manualPaymentDetails.verifiedBy}</p>
                                    </div>
                                )}
                                {order.paymentDetails?.paidAt && (
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Settlement Time</h4>
                                        <p className="text-[10px] font-bold text-success-500 uppercase">{new Date(order.paymentDetails.paidAt).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Critical Admin Actions */}
            <div className="pt-12 border-t border-gray-100 dark:border-white/5">
                <div className="bg-red-50/30 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 rounded-[40px] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-red-500 text-white rounded-[20px] flex items-center justify-center shadow-lg shadow-red-500/20">
                            <XCircle size={28} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-tight text-red-600 dark:text-red-500">Critical Override System</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest text-[10px]">Bypass all status transition rules and force a specific order state</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {['payment_pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => handleStatusUpdate(status, true)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${order.orderStatus === status ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 shadow-sm border border-gray-100 dark:border-white/10'}`}
                                disabled={order.orderStatus === status}
                            >
                                Force {status.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmStatusUpdate}
                title={isCriticalUpdate ? "⚠️ Critical Status Override" : "Update Order Status"}
                message={isCriticalUpdate
                    ? `Warning: You are performing a critical override to mark this order as "${pendingStatus.replace('_', ' ')}". This bypasses normal workflow rules. Proceed with extreme caution.`
                    : `Are you sure you want to change the order status to "${pendingStatus.replace('_', ' ')}"? The customer will be notified of this change.`}
                confirmText={isCriticalUpdate ? "Force Update Status" : "Update Status"}
                type={(pendingStatus === 'cancelled' || isCriticalUpdate) ? 'danger' : 'success'}
                isLoading={statusLoading}
            >
                <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Optional Status Message</label>
                        {pendingStatus === 'cancelled' && (
                            <span className="text-[9px] font-bold text-sking-red uppercase italic">Recommended for cancellations</span>
                        )}
                    </div>

                    {pendingStatus === 'cancelled' && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            {CANCELLATION_TEMPLATES.map((template, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setStatusMessage(template.message)}
                                    className="px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] text-[9px] font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                                >
                                    {template.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <textarea
                        value={statusMessage}
                        onChange={(e) => setStatusMessage(e.target.value)}
                        placeholder="e.g. Items shipped via BlueDart. Tracking: 12345..."
                        className="w-full min-h-[100px] p-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.08] rounded-2xl text-xs font-medium placeholder:text-gray-300 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white transition-all outline-none resize-none"
                    />
                    <p className="text-[10px] text-gray-400 font-medium italic px-1">
                        This message will be visible in the order history {pendingStatus === 'cancelled' ? 'and sent to the customer.' : 'for internal tracking.'}
                    </p>
                </div>
            </ConfirmationModal>

            <ManualPaymentModal
                isOpen={isManualPaymentModalOpen}
                onClose={() => setIsManualPaymentModalOpen(false)}
                onConfirm={confirmManualPayment}
                isLoading={statusLoading}
                orderAmount={order.finalAmount}
            />
        </div >
    );
}
