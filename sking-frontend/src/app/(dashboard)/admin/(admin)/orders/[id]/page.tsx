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
    ArrowRight
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";

export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [statusLoading, setStatusLoading] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState("");

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

    const handleStatusUpdate = (status: string) => {
        setPendingStatus(status);
        setIsConfirmModalOpen(true);
    };

    const confirmStatusUpdate = async () => {
        if (!pendingStatus) return;
        try {
            setStatusLoading(true);
            const res = await adminOrderService.updateOrderStatus(id as string, pendingStatus);
            if (res.success) {
                setOrder(res.order);
                toast.success(`Order status updated to ${pendingStatus.replace('_', ' ')}`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setStatusLoading(false);
            setIsConfirmModalOpen(false);
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
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen bg-transparent">
            {/* New Status Hero Section */}
            <div className="bg-white dark:bg-white/[0.03] rounded-[40px] p-8 border border-gray-50 dark:border-white/[0.05] shadow-sm flex flex-col md:flex-row items-center gap-8 mb-10 transition-all duration-500">
                <div className={`w-28 h-28 rounded-[35px] flex items-center justify-center shadow-2xl ${isCancelled ? 'bg-error-50 dark:bg-error-500/10 text-error-500' : 'bg-success-50 dark:bg-success-500/10 text-success-500'}`}>
                    {isCancelled ? <XCircle size={56} /> : steps[currentStepIndex]?.icon && React.createElement(steps[currentStepIndex].icon, { size: 56 })}
                </div>
                <div className="text-center md:text-left flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter dark:text-white mb-2 italic">
                                {isCancelled ? 'Order Cancelled.' : steps[currentStepIndex]?.label + '.'}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-[0.2em]">
                                {isCancelled ? 'This order was cancelled by the administrator.' : `The order is currently being ${steps[currentStepIndex]?.label.toLowerCase()}.`}
                            </p>
                        </div>
                        <div className="flex flex-col items-center md:items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Estimated Completion</span>
                            <span className="text-xl font-black dark:text-white">
                                {order.orderStatus === 'delivered' ? 'DELIVERED' : '2-3 DAYS'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
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
                    <div className="relative group flex-1 md:flex-none">
                        <Button variant="primary" className="w-full flex items-center gap-2">
                            Change Status <ChevronLeft className="w-4 h-4 rotate-270 group-hover:rotate-90 transition-transform" />
                        </Button>
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-2">
                            {['processing', 'shipped', 'delivered', 'cancelled'].filter(s => s !== order.orderStatus).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusUpdate(status)}
                                    className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors border-b border-gray-50 dark:border-white/[0.05] last:border-0 dark:text-gray-200"
                                >
                                    Mark as {status.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Columns - Body Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Progress Tracker Visibility */}
                    {!isCancelled && (
                        <div className="bg-white dark:bg-white/[0.03] rounded-[40px] p-10 border border-gray-50 dark:border-white/[0.05] shadow-sm overflow-hidden mb-8">
                            <div className="relative flex justify-between">
                                {/* Connector Line */}
                                <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800">
                                    <div
                                        className="h-full bg-black dark:bg-sking-red transition-all duration-1000"
                                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                                    />
                                </div>
                                {steps.map((step, idx) => {
                                    const Icon = step.icon;
                                    const isActive = idx <= currentStepIndex;
                                    return (
                                        <div key={step.key} className="relative z-10 flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isActive ? 'bg-black dark:bg-gray-100 border-black dark:border-gray-100 text-white dark:text-black shadow-lg' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-200 dark:text-gray-600'}`}>
                                                <Icon size={18} />
                                            </div>
                                            <span className={`mt-3 text-[9px] font-black uppercase tracking-widest text-center ${isActive ? 'text-black dark:text-white' : 'text-gray-300 dark:text-gray-600'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Order Items */}
                    <div className="bg-white dark:bg-white/[0.03] rounded-[40px] border border-gray-50 dark:border-white/[0.05] shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 dark:border-white/[0.05] flex justify-between items-center">
                            <h2 className="text-lg font-black uppercase tracking-tight dark:text-white">Order Items</h2>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{order.items.length} Items</span>
                        </div>
                        <div className="divide-y divide-gray-50 dark:divide-white/[0.05]">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-8 flex gap-6 hover:bg-gray-50/30 dark:hover:bg-white/[0.02] transition-colors">
                                    <div className="relative w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 flex-shrink-0">
                                        {item.product?.images?.[0] ? (
                                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 font-bold uppercase">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-grow flex flex-col justify-center">
                                        <h3 className="font-bold text-black dark:text-white uppercase tracking-tight text-sm line-clamp-1">{item.product?.name || 'Unknown Product'}</h3>
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
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-black dark:bg-gray-100 text-white dark:text-black rounded-2xl flex items-center justify-center shadow-lg">
                                <User size={20} />
                            </div>
                            <h3 className="font-black uppercase tracking-tight text-sm dark:text-white">Customer Info</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Full Name</h4>
                                <p className="text-sm font-bold text-black dark:text-white">{order.shippingAddress.name}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Address</h4>
                                <div className="flex items-center gap-2 group">
                                    <Mail size={12} className="text-gray-300 dark:text-gray-600" />
                                    <p className="text-sm font-medium text-black dark:text-white truncate pr-4">{order.shippingAddress.email}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Phone Number</h4>
                                <div className="flex items-center gap-2">
                                    <Phone size={12} className="text-gray-300 dark:text-gray-600" />
                                    <p className="text-sm font-bold text-black dark:text-white">{order.shippingAddress.phoneNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-white dark:bg-white/[0.03] rounded-[40px] p-8 border border-gray-50 dark:border-white/[0.05] shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-sking-pink text-white rounded-2xl flex items-center justify-center shadow-lg">
                                <MapPin size={20} />
                            </div>
                            <h3 className="font-black uppercase tracking-tight text-sm dark:text-white">Shipping Address</h3>
                        </div>
                        <div className="text-xs text-gray-500 font-medium leading-loose uppercase tracking-wider">
                            <p className="text-black dark:text-white font-bold mb-1">{order.shippingAddress.street}</p>
                            <p className="dark:text-gray-400">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                            <p className="dark:text-gray-400">{order.shippingAddress.country} - <span className="text-black dark:text-white font-black">{order.shippingAddress.postalCode}</span></p>
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
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Method</span>
                                <span className="text-xs font-black uppercase text-black dark:text-white">Online Payment</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-50 dark:border-white/[0.05]">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</span>
                                <Badge color={order.paymentStatus === 'completed' ? 'success' : 'warning'} size="sm" className="font-black uppercase text-[8px] tracking-[0.2em]">
                                    {order.paymentStatus}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Razorpay ID</span>
                                <span className="text-[10px] font-mono font-medium text-black dark:text-white uppercase">
                                    {order.paymentDetails?.gatewayPaymentId?.slice(-12) || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmStatusUpdate}
                title="Update Order Status"
                message={`Are you sure you want to change the order status to "${pendingStatus.replace('_', ' ')}"? The customer will be notified of this change.`}
                confirmText="Update Status"
                type={pendingStatus === 'cancelled' ? 'danger' : 'success'}
                isLoading={statusLoading}
            />
        </div>
    );
}
