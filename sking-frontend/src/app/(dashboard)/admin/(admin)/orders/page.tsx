"use client";
import React, { useEffect, useState } from "react";
import { adminOrderService } from "@/services/admin/adminOrderApiService";
import Badge from "@/components/admin/ui/badge/Badge";
import Button from "@/components/admin/ui/button/Button";
import Link from "next/link";
import Image from "next/image";
import {
    Search,
    Filter,
    RefreshCcw,
    Eye,
    MoreVertical,
    Package,
    User,
    Calendar,
    ChevronRight
} from "lucide-react";
import Pagination from "@/components/admin/tables/Pagination";
import { toast } from "sonner";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        fetchOrders();
    }, [currentPage, selectedStatus, sortOrder]);

    // Debounced search
    useEffect(() => {
        const delay = setTimeout(() => {
            if (currentPage === 1) {
                fetchOrders();
            } else {
                setCurrentPage(1);
            }
        }, 500);
        return () => clearTimeout(delay);
    }, [searchTerm]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await adminOrderService.getOrders({
                page: currentPage,
                limit: 10,
                search: searchTerm,
                status: selectedStatus,
                sort: sortOrder
            });
            if (res.success) {
                setOrders(res.orders);
                setTotalPages(res.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'success';
            case 'processing': return 'info';
            case 'shipped': return 'info';
            case 'payment_pending': return 'warning';
            case 'cancelled': return 'error';
            default: return 'warning';
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50 dark:bg-transparent">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-black dark:text-white uppercase tracking-tight italic">
                        Order <span className="text-sking-red">Management.</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-widest flex items-center gap-2">
                        Total {orders.length} orders found
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="p-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105"
                        title="Refresh"
                    >
                        <RefreshCcw className={`w-5 h-5 text-gray-400 ${refreshing ? 'animate-spin text-sking-red' : ''}`} />
                    </button>
                    {/* Additional actions could go here */}
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative col-span-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Customer Name or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm font-medium dark:text-gray-200"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-xs font-black uppercase tracking-widest appearance-none cursor-pointer dark:text-gray-200"
                    >
                        <option value="all">All Statuses</option>
                        <option value="payment_pending">Payment Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-xs font-black uppercase tracking-widest appearance-none cursor-pointer dark:text-gray-200"
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-white/[0.03] rounded-[40px] border border-gray-50 dark:border-white/[0.05] shadow-sm overflow-hidden mb-8">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-white/[0.02]">
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order Information</th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Amount</th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                                <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/[0.05]">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-5 py-6">
                                            <div className="h-10 bg-gray-100 dark:bg-white/5 rounded-2xl w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-24 text-center">
                                        <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No orders found</p>
                                    </td>
                                </tr>
                            ) : orders.map((order: any) => (
                                <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-5 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:shadow-lg transition-all relative overflow-hidden border border-gray-100 dark:border-white/[0.05]">
                                                {order.items?.[0]?.product?.images?.[0] ? (
                                                    <Image
                                                        src={order.items[0].product.images[0]}
                                                        alt="order product"
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <Package size={20} />
                                                )}
                                                {order.items?.length > 1 && (
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                        <span className="text-[10px] font-black text-white">+{order.items.length - 1}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-black text-black dark:text-white text-sm uppercase">#{order._id.slice(-8).toUpperCase()}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                                                    <Calendar size={10} />
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-black dark:text-white">{order.shippingAddress.name}</div>
                                                <div className="text-[10px] text-gray-400 font-medium truncate max-w-[150px]">{order.shippingAddress.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-6 text-center font-black text-black dark:text-white text-sm">
                                        ₹{order.finalAmount?.toLocaleString()}
                                    </td>
                                    <td className="px-5 py-6 text-center">
                                        <Badge
                                            size="sm"
                                            color={getStatusColor(order.orderStatus)}
                                            className="uppercase tracking-widest font-black text-[9px]"
                                        >
                                            {order.orderStatus.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-6">
                                        <div className="flex items-center justify-end gap-2 text-right">
                                            <Link href={`./orders/${order._id}`}>
                                                <button className="p-2 text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all" title="View Details">
                                                    <Eye size={18} />
                                                </button>
                                            </Link>
                                            <button className="p-2 text-gray-200 hover:text-gray-400 rounded-xl transition-all">
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}
