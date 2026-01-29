"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminCouponService } from "@/services/admin/adminCouponApiService";
import Button from "@/components/admin/ui/button/Button";
import Badge from "@/components/admin/ui/badge/Badge";
import { toast } from "sonner";
import { Tag, Calendar, Users, DollarSign, Package, ArrowRight, Trash2, Edit, Copy } from "lucide-react";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table";
import Pagination from "@/components/admin/tables/Pagination";

export default function CouponDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [coupon, setCoupon] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    // Orders State
    const [orders, setOrders] = useState<any[]>([]);
    const [ordersPage, setOrdersPage] = useState(1);
    const [ordersTotalPages, setOrdersTotalPages] = useState(1);
    const [ordersLoading, setOrdersLoading] = useState(false);

    // Stats State
    const [stats, setStats] = useState<any>(null);
    const [statsLoading, setStatsLoading] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchCoupon();
            fetchStats();
        }
    }, [id]);

    useEffect(() => {
        if (id && activeTab === 'orders') {
            fetchOrders();
        }
    }, [id, activeTab, ordersPage]);

    const fetchCoupon = async () => {
        try {
            const data = await adminCouponService.getCouponById(id);
            if (data.success) {
                setCoupon(data.coupon);
            }
        } catch (error) {
            console.error("Failed to fetch coupon", error);
            toast.error("Failed to fetch coupon details");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            setStatsLoading(true);
            const data = await adminCouponService.getCouponStats(id);
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setStatsLoading(false);
        }
    };

    const fetchOrders = useCallback(async () => {
        try {
            setOrdersLoading(true);
            const data = await adminCouponService.getCouponOrders(id, ordersPage, 10);
            if (data.success) {
                setOrders(data.orders);
                setOrdersTotalPages(Math.ceil(data.total / 10));
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setOrdersLoading(false);
        }
    }, [id, ordersPage]);

    const handleDelete = async () => {
        try {
            setActionLoading(true);
            const res = await adminCouponService.delete(id);
            if (res.success) {
                toast.success("Coupon deleted successfully");
                router.push("/admin/coupons");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete coupon");
        } finally {
            setActionLoading(false);
            setIsDeleteModalOpen(false);
        }
    };

    const handleCopyCode = () => {
        if (coupon?.code) {
            navigator.clipboard.writeText(coupon.code);
            toast.success("Coupon code copied!");
        }
    };

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
    );
    if (!coupon) return <div className="p-6 text-center text-gray-500 font-bold uppercase tracking-widest">Coupon not found</div>;

    const tabs = [
        { id: "overview", label: "Overview", icon: Tag },
        { id: "orders", label: `Usage History`, icon: Package },
    ];

    const isExpired = new Date(coupon.endDate) < new Date();
    const isActive = coupon.isActive && !isExpired;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-white/[0.03] p-8 rounded-[40px] border border-gray-50 dark:border-white/[0.05] shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-sking-pink/10 text-sking-pink flex items-center justify-center border border-sking-pink/20">
                        <Tag size={32} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{coupon.code}</h1>
                            <button onClick={handleCopyCode} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                                <Copy size={16} />
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge color={isActive ? "success" : "error"} size="sm" className="font-black uppercase tracking-widest text-[10px]">
                                {isActive ? "Active" : isExpired ? "Expired" : "Inactive"}
                            </Badge>
                            <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700"></div>
                            <span className="text-xs font-mono text-gray-400">Created: {new Date(coupon.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link href="/admin/coupons" className="px-6 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-gray-50 dark:hover:bg-white/20 transition-all flex items-center gap-2">
                        <ArrowRight className="rotate-180" size={16} /> Back
                    </Link>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-6 py-3 bg-white border border-gray-200 text-red-500 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-red-50 hover:border-red-200 transition-all flex items-center gap-2"
                    >
                        <Trash2 size={16} /> Delete
                    </button>
                    <Link href={`/admin/coupons/edit/${id}`} className="px-6 py-3 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all rounded-xl font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                        <Edit size={16} /> Edit
                    </Link>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                 flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
                                 ${activeTab === tab.id
                                    ? "bg-black text-white dark:bg-white dark:text-black shadow-lg scale-105"
                                    : "bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10"
                                }
                             `}
                        >
                            <Icon size={14} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="bg-white dark:bg-white/[0.03] rounded-[40px] p-8 border border-gray-50 dark:border-white/[0.05] shadow-sm min-h-[500px]">

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="space-y-12">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/5 relative overflow-hidden">
                                <div className="absolute right-0 top-0 p-8 opacity-5">
                                    <Tag size={120} />
                                </div>
                                <div className="relative z-10">
                                    <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Total Used</div>
                                    <div className="text-4xl font-black text-gray-900 dark:text-white">
                                        {stats?.totalUsage || 0}
                                        <span className="text-lg text-gray-400 font-medium ml-2">times</span>
                                    </div>
                                    {coupon.usageLimit > 0 && (
                                        <div className="text-xs font-bold text-gray-400 mt-2">
                                            Limit: {coupon.usageLimit}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/5 relative overflow-hidden">
                                <div className="absolute right-0 top-0 p-8 opacity-5">
                                    <DollarSign size={120} />
                                </div>
                                <div className="relative z-10">
                                    <div className="text-xs font-black uppercase tracking-widest text-green-500 mb-2">Revenue Generated</div>
                                    <div className="text-4xl font-black text-gray-900 dark:text-white">₹{(stats?.totalRevenue || 0).toLocaleString()}</div>
                                    <div className="text-xs font-bold text-gray-400 mt-2">
                                        From {stats?.totalUsage || 0} orders
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/5 relative overflow-hidden">
                                <div className="absolute right-0 top-0 p-8 opacity-5">
                                    <Tag size={120} />
                                </div>
                                <div className="relative z-10">
                                    <div className="text-xs font-black uppercase tracking-widest text-red-500 mb-2">Discount Given</div>
                                    <div className="text-4xl font-black text-gray-900 dark:text-white">₹{(stats?.totalDiscount || 0).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Coupon Settings</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5">
                                        <span className="text-sm text-gray-500 font-bold">Code</span>
                                        <span className="font-mono bg-gray-100 dark:bg-white/10 px-3 py-1 rounded text-sm font-bold text-black dark:text-white">{coupon.code}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5">
                                        <span className="text-sm text-gray-500 font-bold">Discount Value</span>
                                        <span className="text-sm font-bold text-black dark:text-white">
                                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5">
                                        <span className="text-sm text-gray-500 font-bold">Min. Order Amount</span>
                                        <span className="text-sm font-bold text-black dark:text-white">₹{coupon.minOrderAmount}</span>
                                    </div>
                                    {coupon.discountType === 'percentage' && (
                                        <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5">
                                            <span className="text-sm text-gray-500 font-bold">Max Discount</span>
                                            <span className="text-sm font-bold text-black dark:text-white">
                                                {coupon.maxDiscountAmount ? `₹${coupon.maxDiscountAmount}` : 'Unlimited'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Restrictions & Limits</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5">
                                        <span className="text-sm text-gray-500 font-bold">User Limit</span>
                                        <span className="text-sm font-bold text-black dark:text-white">{coupon.userLimit} per user</span>
                                    </div>
                                    <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5">
                                        <span className="text-sm text-gray-500 font-bold">Total Usage Limit</span>
                                        <span className="text-sm font-bold text-black dark:text-white">
                                            {coupon.usageLimit > 0 ? coupon.usageLimit : 'Unlimited'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5">
                                        <span className="text-sm text-gray-500 font-bold">Validity Period</span>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-black dark:text-white">{new Date(coupon.startDate).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-400 text-center font-bold">to</div>
                                            <div className="text-sm font-bold text-black dark:text-white">{new Date(coupon.endDate).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5">
                                        <span className="text-sm text-gray-500 font-bold">Target Audience</span>
                                        <Badge color="info" size="sm" className="uppercase">{coupon.couponType.replace('_', ' ')}</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Description</h3>
                            <p className="text-gray-600 dark:text-gray-300 font-medium">{coupon.description}</p>
                        </div>
                    </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                    <div>
                        {ordersLoading ? (
                            <div className="text-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading usage history...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <Package size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-bold">No orders found using this coupon.</p>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Order ID</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Date Used</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Customer</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Items</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Order Total</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Discount</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Action</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.map((order: any) => (
                                            <TableRow key={order._id}>
                                                <TableCell className="font-mono text-xs dark:text-gray-300">{order._id.slice(-6).toUpperCase()}</TableCell>
                                                <TableCell className="text-xs font-bold dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-sm font-bold dark:text-white">
                                                    {order.shippingAddress?.name || 'Unknown'}
                                                </TableCell>
                                                <TableCell className="text-xs text-gray-500 font-bold">
                                                    {order.items?.length} items
                                                </TableCell>
                                                <TableCell className="text-sm font-black dark:text-white">₹{order.finalAmount.toLocaleString()}</TableCell>
                                                <TableCell className="text-sm font-bold text-green-500">
                                                    -₹{(order.discountAmount || 0).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Link href={`/admin/orders/${order._id}`} className="text-blue-500 hover:underline text-xs font-bold uppercase">View</Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {ordersTotalPages > 1 && (
                                    <div className="mt-4 flex justify-end">
                                        <Pagination
                                            currentPage={ordersPage}
                                            totalPages={ordersTotalPages}
                                            onPageChange={(p) => setOrdersPage(p)}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Coupon"
                message="Are you sure you want to delete this coupon? This action cannot be undone."
                confirmText="Delete"
                type="danger"
                isLoading={actionLoading}
            />
        </div>
    );
}
