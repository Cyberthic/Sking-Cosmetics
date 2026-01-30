"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { adminProductService } from "@/services/admin/adminProductApiService";
import Button from "@/components/admin/ui/button/Button";
import Badge from "@/components/admin/ui/badge/Badge";
import { toast } from "sonner";
import { Eye, EyeOff, Package, BarChart, FileText, ShoppingBag, Users, Info, ArrowRight, MessageSquare, Star, Pin, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { adminReviewService } from "@/services/admin/adminReviewApiService";
import ReviewDetailsModal from "@/components/admin/reviews/ReviewDetailsModal";
import AddReviewModal from "@/components/admin/reviews/AddReviewModal";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table";
import Pagination from "@/components/admin/tables/Pagination";

export default function ProductDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    // Orders State
    const [orders, setOrders] = useState<any[]>([]);
    const [ordersPage, setOrdersPage] = useState(1);
    const [ordersTotalPages, setOrdersTotalPages] = useState(1);
    const [ordersLoading, setOrdersLoading] = useState(false);

    // Stats State
    const [stats, setStats] = useState<any>(null);
    const [topCustomers, setTopCustomers] = useState<any[]>([]);
    const [statsLoading, setStatsLoading] = useState(false);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Reviews State
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewsPage, setReviewsPage] = useState(1);
    const [reviewsTotalPages, setReviewsTotalPages] = useState(1);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [selectedReview, setSelectedReview] = useState<any>(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
    const [reviewsStatus, setReviewsStatus] = useState('all');

    useEffect(() => {
        if (id) {
            fetchProduct();
        }
    }, [id]);

    useEffect(() => {
        if (id && activeTab === 'orders') {
            fetchOrders();
        } else if (id && activeTab === 'analytics') {
            fetchStats();
        } else if (id && activeTab === 'reviews') {
            fetchReviews();
        }
    }, [id, activeTab, ordersPage, reviewsPage, reviewsStatus]);

    const fetchProduct = async () => {
        try {
            const data = await adminProductService.getProductById(id);
            if (data.success) {
                setProduct(data.product);
            }
        } catch (error) {
            console.error("Failed to fetch product", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = useCallback(async () => {
        try {
            setOrdersLoading(true);
            const data = await adminProductService.getProductOrders(id, ordersPage, 10);
            if (data.success) {
                setOrders(data.data.orders);
                setOrdersTotalPages(Math.ceil(data.data.total / 10));
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setOrdersLoading(false);
        }
    }, [id, ordersPage]);

    const fetchStats = useCallback(async () => {
        try {
            setStatsLoading(true);
            const data = await adminProductService.getProductStats(id);
            if (data.success) {
                setStats(data.stats);
                setTopCustomers(data.topCustomers);
            }
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setStatsLoading(false);
        }
    }, [id]);

    const fetchReviews = useCallback(async () => {
        try {
            setReviewsLoading(true);
            const data = await adminReviewService.getReviewsByProduct(id, {
                page: reviewsPage,
                limit: 10,
                status: reviewsStatus === 'all' ? undefined : reviewsStatus,
                sortBy: 'product_rank'
            });
            if (data.success) {
                setReviews(data.reviews);
                setReviewsTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setReviewsLoading(false);
        }
    }, [id, reviewsPage, reviewsStatus]);

    const handleBlockReview = async (duration: string) => {
        if (!selectedReview) return;
        try {
            await adminReviewService.blockReview({
                reviewId: selectedReview._id,
                duration,
                reason: "Administrative block"
            });
            toast.success(`Review blocked for ${duration}`);
            fetchReviews();
            setIsReviewModalOpen(false);
        } catch (error) {
            toast.error("Failed to block review");
        }
    };

    const handleUnblockReview = async () => {
        if (!selectedReview) return;
        try {
            await adminReviewService.unblockReview(selectedReview._id);
            toast.success("Review unblocked");
            fetchReviews();
            setIsReviewModalOpen(false);
        } catch (error) {
            toast.error("Failed to unblock review");
        }
    };

    const handleDeleteReview = async () => {
        if (!selectedReview) return;
        try {
            await adminReviewService.deleteReview(selectedReview._id);
            toast.success("Review deleted successfully");
            fetchReviews();
            setIsReviewModalOpen(false);
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    const handlePinReview = async () => {
        if (!selectedReview) return;
        try {
            await adminReviewService.togglePin(selectedReview._id);
            toast.success(selectedReview.isPinned ? "Review unpinned" : "Review pinned");
            fetchReviews();
            setIsReviewModalOpen(false);
        } catch (error) {
            toast.error("Failed to toggle pin status");
        }
    };

    const handleToggleStatus = () => {
        if (!product?._id) return;
        setIsConfirmModalOpen(true);
    };

    const confirmToggle = async () => {
        if (!product?._id) return;
        try {
            setActionLoading(true);
            const res = await adminProductService.toggleProductStatus(product._id);
            if (res.success) {
                toast.success(res.message);
                setProduct(res.product);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to update status");
        } finally {
            setActionLoading(false);
            setIsConfirmModalOpen(false);
        }
    };

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
    );
    if (!product) return <div className="p-6 text-center text-gray-500 font-bold uppercase tracking-widest">Product not found</div>;

    const finalPrice = product.offerPercentage > 0
        ? product.price - (product.price * (product.offerPercentage / 100))
        : product.price;

    const tabs = [
        { id: "overview", label: "Overview", icon: Info },
        { id: "orders", label: "Order History", icon: Package },
        { id: "analytics", label: "Analytics & Customers", icon: BarChart },
        { id: "reviews", label: "Reviews", icon: MessageSquare },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-white/[0.03] p-8 rounded-[40px] border border-gray-50 dark:border-white/[0.05] shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-white/10 flex-shrink-0 bg-gray-50">
                        {product.images?.[0] && (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">{product.name}</h1>
                        <div className="flex items-center gap-3">
                            <Badge color={product.isActive ? "success" : "error"} size="sm" className="font-black uppercase tracking-widest text-[10px]">
                                {product.isActive ? "Active Product" : "Hidden Product"}
                            </Badge>
                            <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-700"></div>
                            <span className="text-xs font-mono text-gray-400">ID: {product._id.slice(-6).toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link href="/admin/products" className="px-6 py-3 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-gray-50 dark:hover:bg-white/20 transition-all flex items-center gap-2">
                        <ArrowRight className="rotate-180" size={16} /> Back
                    </Link>
                    <Button
                        variant="outline"
                        onClick={handleToggleStatus}
                        className={`flex items-center gap-2 font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-xl border ${product.isActive ? 'hover:bg-red-50 hover:text-red-500 border-gray-200' : 'hover:bg-green-50 hover:text-green-500 border-gray-200'} transition-all`}
                    >
                        {product.isActive ? (
                            <><EyeOff size={16} /> Unlist Product</>
                        ) : (
                            <><Eye size={16} /> List Product</>
                        )}
                    </Button>
                    <Link href={`/admin/products/edit/${product._id}`} className="px-6 py-3 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all rounded-xl font-bold uppercase tracking-wider text-xs flex items-center gap-2">
                        <FileText size={16} /> Edit Details
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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Details Column */}
                        <div className="lg:col-span-2 space-y-10">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Price & Offer</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Base Price</div>
                                        <div className="text-2xl font-black text-gray-900 dark:text-white">₹{product.price}</div>
                                    </div>
                                    <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Discount</div>
                                        <div className="text-2xl font-black text-green-500">{product.offerPercentage}% OFF</div>
                                    </div>
                                    <div className="p-6 bg-gray-900 text-white dark:bg-white dark:text-black rounded-2xl shadow-lg transform -translate-y-1">
                                        <div className="text-xs font-bold opacity-60 uppercase tracking-wider mb-2">Final Price</div>
                                        <div className="text-3xl font-black">₹{finalPrice.toFixed(0)}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Product Description</h3>
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">{product.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Ingredients</h3>
                                    {product.ingredients && product.ingredients.length > 0 ? (
                                        <div className="space-y-4">
                                            {product.ingredients.map((ing: any, i: number) => (
                                                <div key={i} className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10">
                                                    <div>
                                                        <div className="font-bold text-sm text-gray-900 dark:text-white">{ing.name}</div>
                                                        <div className="text-xs text-gray-500 mt-1">{ing.description}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <p className="text-sm text-gray-400 italic">No ingredients listed</p>}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Stock Status</h3>
                                    <div className="space-y-3">
                                        {product.variants?.map((v: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-xl">
                                                <span className="font-bold text-sm text-gray-700 dark:text-gray-200">{v.size || v.name}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-bold text-gray-500">₹{v.price}</span>
                                                    <Badge size="sm" color={v.stock > 10 ? "success" : v.stock > 0 ? "warning" : "error"}>
                                                        {v.stock} Items Left
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Images Column */}
                        <div className="lg:col-span-1 space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Gallery</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {product.images?.map((img: string, idx: number) => (
                                    <div key={idx} className="aspect-square relative rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 bg-gray-50">
                                        <Image src={img} alt={`Product ${idx}`} fill className="object-cover hover:scale-110 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                    <div>
                        {ordersLoading ? (
                            <div className="text-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading orders...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <Package size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-bold">No orders found for this product.</p>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Order ID</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Date</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Customer</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Status</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Total Bill</TableCell>
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
                                                <TableCell>
                                                    <Badge size="sm" color={order.orderStatus === 'active' || order.orderStatus === 'delivered' ? 'success' : order.orderStatus === 'cancelled' ? 'error' : 'warning'}>{order.orderStatus}</Badge>
                                                </TableCell>
                                                <TableCell className="text-sm font-black dark:text-white">₹{order.finalAmount.toLocaleString()}</TableCell>
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

                {/* ANALYTICS TAB */}
                {activeTab === 'analytics' && (
                    <div className="space-y-12">
                        {statsLoading ? (
                            <div className="py-20 flex justify-center"><div className="animate-spin h-8 w-8 border-b-2 border-black rounded-full"></div></div>
                        ) : !stats ? (
                            <div className="text-center py-20 text-gray-400">No stats available</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/5 relative overflow-hidden">
                                        <div className="absolute right-0 top-0 p-8 opacity-5">
                                            <ShoppingBag size={120} />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="text-xs font-black uppercase tracking-widest text-sking-pink mb-2">Total Sold</div>
                                            <div className="text-4xl font-black text-gray-900 dark:text-white">{stats.totalUnitsSold} <span className="text-lg text-gray-400 font-medium">units</span></div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/5 relative overflow-hidden">
                                        <div className="absolute right-0 top-0 p-8 opacity-5">
                                            <BarChart size={120} />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="text-xs font-black uppercase tracking-widest text-green-500 mb-2">Gross Revenue</div>
                                            <div className="text-4xl font-black text-gray-900 dark:text-white">₹{stats.totalRevenue.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-white/5 relative overflow-hidden">
                                        <div className="absolute right-0 top-0 p-8 opacity-5">
                                            <Package size={120} />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="text-xs font-black uppercase tracking-widest text-blue-500 mb-2">Orders</div>
                                            <div className="text-4xl font-black text-gray-900 dark:text-white">{stats.totalOrders}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Top Customers</h3>
                                    {topCustomers.length === 0 ? (
                                        <p className="text-gray-400 text-sm italic">No data yet.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {topCustomers.map((customer, idx) => (
                                                <div key={idx} className="flex items-center gap-4 p-4 bg-white dark:bg-black/20 border border-gray-100 dark:border-white/10 rounded-2xl">
                                                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/20 flex items-center justify-center text-lg font-black text-gray-500 overflow-hidden relative">
                                                        {customer.profilePicture ? (
                                                            <Image src={customer.profilePicture} alt="" fill className="object-cover" />
                                                        ) : customer.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-white text-sm">{customer.name}</div>
                                                        <div className="text-xs text-gray-500">{customer.email}</div>
                                                        <div className="flex gap-3 mt-2">
                                                            <div className="text-[10px] font-black uppercase tracking-wider bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                                                                Bought: <span className="text-black dark:text-white">{customer.totalQuantity}</span>
                                                            </div>
                                                            <div className="text-[10px] font-black uppercase tracking-wider bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-600 dark:text-gray-300">
                                                                Spent: <span className="text-black dark:text-white">₹{customer.totalSpent.toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* REVIEWS TAB */}
                {activeTab === 'reviews' && (
                    <div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div className="flex bg-white dark:bg-black/20 p-1 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm w-fit">
                                {['all', 'active', 'blocked', 'pinned'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => { setReviewsStatus(s); setReviewsPage(1); }}
                                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${reviewsStatus === s
                                            ? "bg-black text-white dark:bg-white dark:text-black shadow-md scale-105"
                                            : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <Button
                                onClick={() => setIsAddReviewModalOpen(true)}
                                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <Plus size={14} /> Add Review
                            </Button>
                        </div>
                        {reviewsLoading ? (
                            <div className="text-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading reviews...</p>
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-bold">No reviews posted for this product yet</p>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Reviewer</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Rating</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Comment</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Date</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Status</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Action</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reviews.map((review: any) => (
                                            <TableRow key={review._id} className={review.isPinned ? "bg-sking-pink/5" : ""}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative border border-gray-100 dark:border-gray-700">
                                                            <Image
                                                                src={review.user?.profilePicture || '/images/user/user-01.png'}
                                                                alt={review.user?.username}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-1">
                                                                <p className="text-xs font-bold text-gray-900 dark:text-white leading-none">{review.user?.username}</p>
                                                                {review.isPinned && <Pin size={10} className="text-sking-pink fill-current" />}
                                                            </div>
                                                            <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1">{review.user?.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Star size={12} className="text-yellow-400 fill-current" />
                                                        <span className="text-xs font-black italic text-gray-900 dark:text-white">{review.rating}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-[11px] text-gray-600 dark:text-gray-400 line-clamp-1 max-w-[200px]">{review.comment}</p>
                                                </TableCell>
                                                <TableCell className="text-[11px] font-bold text-gray-500 dark:text-gray-500">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {review.isBlocked ? (
                                                        <Badge color="error" size="sm" className="text-[8px] uppercase tracking-tighter">Blocked</Badge>
                                                    ) : (
                                                        <Badge color="success" size="sm" className="text-[8px] uppercase tracking-tighter">Active</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <button
                                                        onClick={() => { setSelectedReview(review); setIsReviewModalOpen(true); }}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-400 dark:text-gray-500 hover:text-sking-pink"
                                                    >
                                                        <ArrowRight size={14} />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {reviewsTotalPages > 1 && (
                                    <div className="mt-4 flex justify-end">
                                        <Pagination
                                            currentPage={reviewsPage}
                                            totalPages={reviewsTotalPages}
                                            onPageChange={(p) => setReviewsPage(p)}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            <ReviewDetailsModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                review={selectedReview}
                onBlock={handleBlockReview}
                onUnblock={handleUnblockReview}
                onPin={handlePinReview}
                onDelete={handleDeleteReview}
            />

            <AddReviewModal
                isOpen={isAddReviewModalOpen}
                onClose={() => setIsAddReviewModalOpen(false)}
                onSuccess={fetchReviews}
                preselectedProductId={id}
            />

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmToggle}
                title={product?.isActive ? "Unlist Product" : "List Product"}
                message={`Are you sure you want to ${product?.isActive ? 'unlist' : 'list'} "${product?.name}"? ${product?.isActive ? 'It will be hidden from the customer shop.' : 'It will be visible to customers again.'}`}
                confirmText={product?.isActive ? "Unlist" : "List"}
                type={product?.isActive ? "warning" : "success"}
                isLoading={actionLoading}
            />
        </div>
    );
}
