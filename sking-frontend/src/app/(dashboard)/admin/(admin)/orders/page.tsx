"use client";
import React, { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { debounce } from "@/utils/debounce";
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
    ChevronRight,
    LayoutGrid,
    List
} from "lucide-react";
import Pagination from "@/components/admin/tables/Pagination";
import { toast } from "sonner";
import FormSelect from "@/components/admin/form/FormSelect";

function OrdersContent() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshing, setRefreshing] = useState(false);

    // URL Persistence for Filters
    const [filters, setFilters] = useUrlState({
        page: 1,
        status: "all",
        search: "",
        sort: "desc"
    });

    const [view, setView] = useState<'grid' | 'list'>('grid');

    // Load view preference on mount
    useEffect(() => {
        const savedView = localStorage.getItem('admin-orders-view');
        if (savedView === 'grid' || savedView === 'list') {
            setView(savedView);
        }
    }, []);

    const toggleView = (newView: 'grid' | 'list') => {
        setView(newView);
        localStorage.setItem('admin-orders-view', newView);
    };

    const fetchOrders = useCallback(async (currentFilters: any) => {
        try {
            setLoading(true);
            const res = await adminOrderService.getOrders({
                page: currentFilters.page,
                limit: 10,
                search: currentFilters.search,
                status: currentFilters.status,
                sort: currentFilters.sort
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
    }, []);

    useEffect(() => {
        fetchOrders(filters);
    }, [filters, fetchOrders]);

    const handleSearch = useMemo(() =>
        debounce((val: string) => {
            setFilters({ search: val, page: 1 });
        }, 500)
        , [setFilters]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchOrders(filters);
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
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen bg-transparent space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight dark:text-white flex items-center gap-3">
                        <Package className="w-8 h-8 text-sking-pink" />
                        Orders
                    </h1>
                    <p className="text-sm text-gray-500 font-medium mt-1 uppercase tracking-widest">Manage customer orders & fulfillment</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-white/5 p-1.5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                    <button
                        onClick={() => toggleView('grid')}
                        className={`p-2 rounded-xl transition-all ${view === 'grid' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                        title="Grid View"
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        onClick={() => toggleView('list')}
                        className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'text-gray-400 hover:text-black dark:hover:text-white'}`}
                        title="List View"
                    >
                        <List size={18} />
                    </button>
                    <div className="w-px h-4 bg-gray-100 dark:bg-white/10 mx-1" />
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="p-2 text-gray-400 hover:text-sking-pink transition-all"
                        title="Refresh"
                    >
                        <RefreshCcw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-white/5 rounded-[30px] p-6 border border-gray-100 dark:border-white/10 shadow-sm flex flex-col lg:flex-row gap-4">
                <div className="flex-grow">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-sking-pink transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="SEARCH BY ORDER ID, CUSTOMER..."
                            defaultValue={filters.search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-black/50 border-none rounded-2xl focus:ring-2 focus:ring-sking-pink/50 text-sm font-bold uppercase tracking-wide transition-all"
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <FormSelect
                        value={filters.status}
                        onChange={(value) => {
                            setFilters({ status: value, page: 1 });
                        }}
                        options={[
                            { value: "all", label: "All Status" },
                            { value: "payment_pending", label: "Pending Payment" },
                            { value: "processing", label: "Processing" },
                            { value: "shipped", label: "Shipped" },
                            { value: "delivered", label: "Delivered" },
                            { value: "cancelled", label: "Cancelled" }
                        ]}
                        className="min-w-[180px]"
                    />
                    <FormSelect
                        value={filters.sort}
                        onChange={(value) => setFilters({ sort: value })}
                        options={[
                            { value: "desc", label: "Newest First" },
                            { value: "asc", label: "Oldest First" }
                        ]}
                        className="min-w-[180px]"
                    />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sking-pink"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Package size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight dark:text-white">No orders found</h3>
                    <p className="text-gray-500 font-medium">Orders will appear here once customers start purchasing</p>
                </div>
            ) : view === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order: any) => (
                        <div key={order._id} className="group relative bg-white dark:bg-white/5 rounded-[35px] p-6 border border-gray-100 dark:border-white/10 hover:border-sking-pink/50 transition-all duration-300 hover:shadow-2xl hover:shadow-sking-pink/5 flex flex-col overflow-hidden">
                            {/* Decorative Background Pattern */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sking-pink/10 to-transparent rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-black/5 dark:bg-white/10 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                                        <span className="font-black text-xs uppercase tracking-wider font-mono">#{order._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                    <Badge color={getStatusColor(order.orderStatus)} size="sm" className="bg-white dark:bg-black text-[10px] uppercase font-black tracking-widest">
                                        {order.orderStatus.replace('_', ' ')}
                                    </Badge>
                                </div>

                                <div className="space-y-4 mb-6 flex-grow">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 bg-gray-50 dark:bg-black/50 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-500 relative overflow-hidden border border-gray-100 dark:border-white/[0.05]">
                                            {order.items?.[0]?.product?.images?.[0] ? (
                                                <Image
                                                    src={order.items[0].product.images[0]}
                                                    alt="order product"
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <Package size={24} />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-500 text-[10px] uppercase tracking-widest mb-1">Items</h3>
                                            <p className="font-black dark:text-white text-sm">
                                                {order.items?.length || 0} {order.items?.length === 1 ? 'Product' : 'Products'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-bold text-gray-500 text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1"><User size={10} /> Customer</h4>
                                            <p className="font-black dark:text-white text-xs truncate">
                                                {order.shippingAddress?.name || 'Unknown'}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-500 text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar size={10} /> Ordered</h4>
                                            <p className="font-black dark:text-white text-xs truncate">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-500 text-[10px] uppercase tracking-widest mb-1">Total Amount</h3>
                                        <p className="text-2xl font-black dark:text-white text-sking-pink">
                                            ₹{order.finalAmount?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
                                    <Link href={`/admin/orders/${order._id}`} className="flex-grow">
                                        <button className="w-full flex items-center justify-center gap-2 px-6 h-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black uppercase text-[10px] tracking-widest hover:bg-sking-pink dark:hover:bg-sking-pink dark:hover:text-white transition-all shadow-lg hover:shadow-sking-pink/30">
                                            <Eye size={14} /> View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-white/5 rounded-[35px] border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Order Information</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {orders.map((order: any) => (
                                    <tr key={order._id} className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 dark:bg-black/50 rounded-xl flex items-center justify-center text-gray-400 relative overflow-hidden border border-gray-100 dark:border-white/5">
                                                    {order.items?.[0]?.product?.images?.[0] ? (
                                                        <Image
                                                            src={order.items[0].product.images[0]}
                                                            alt="order product"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <Package size={16} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-black text-xs uppercase tracking-tight dark:text-white">#{order._id.slice(-8).toUpperCase()}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                                        <Calendar size={10} /> {new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black dark:text-white uppercase">{order.shippingAddress?.name}</span>
                                                <span className="text-[10px] text-gray-400 font-medium">{order.shippingAddress?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge color={getStatusColor(order.orderStatus)} size="sm" className="bg-transparent border border-current text-[9px] uppercase font-black tracking-widest">
                                                {order.orderStatus.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-right font-black text-sm dark:text-white">
                                            ₹{order.finalAmount?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Link href={`/admin/orders/${order._id}`}>
                                                <button className="p-2 text-gray-400 hover:text-sking-pink transition-colors">
                                                    <Eye size={18} />
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center">
                    <Pagination
                        currentPage={filters.page}
                        totalPages={totalPages}
                        onPageChange={(p) => setFilters({ page: p })}
                    />
                </div>
            )}
        </div>
    );
}

export default function OrdersPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sking-pink"></div>
            </div>
        }>
            <OrdersContent />
        </Suspense>
    );
}
