"use client";
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/admin/common/PageBreadCrumb";
import { adminReviewService } from "@/services/admin/adminReviewApiService";
import { toast } from "sonner";
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    ShieldAlert,
    ShieldCheck,
    Star,
    MessageSquare,
    User,
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Trash2,
    Pin,
    Plus
} from "lucide-react";
import Image from "next/image";
import ReviewDetailsModal from "@/components/admin/reviews/ReviewDetailsModal";
import AddReviewModal from "@/components/admin/reviews/AddReviewModal";
import { motion, AnimatePresence } from "framer-motion";

const ReviewsPage = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all"); // all, active, blocked
    const [selectedReview, setSelectedReview] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await adminReviewService.getAllReviews({
                page,
                limit: 10,
                search,
                status: status === 'all' ? undefined : status,
                sortBy: 'isPinned', // Sort by pinned first
                sortOrder: 'desc'
            });
            setReviews(data.reviews);
            setTotal(data.total);
            setTotalPages(data.totalPages);
        } catch (error) {
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [page, status]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchReviews();
    };

    const handleBlock = async (duration: string) => {
        if (!selectedReview) return;
        try {
            await adminReviewService.blockReview({
                reviewId: selectedReview._id,
                duration,
                reason: "Administrative block"
            });
            toast.success(`Review blocked for ${duration}`);
            fetchReviews();
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Failed to block review");
        }
    };

    const handleUnblock = async (reviewId?: string) => {
        const id = reviewId || selectedReview?._id;
        if (!id) return;
        try {
            await adminReviewService.unblockReview(id);
            toast.success("Review unblocked");
            fetchReviews();
            if (selectedReview) setIsModalOpen(false);
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
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Failed to delete review");
        }
    };

    const handlePin = async () => {
        if (!selectedReview) return;
        try {
            await adminReviewService.togglePin(selectedReview._id);
            toast.success(selectedReview.isPinned ? "Review unpinned" : "Review pinned");
            fetchReviews();
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Failed to toggle pin status");
        }
    };

    const openDetails = (review: any) => {
        setSelectedReview(review);
        setIsModalOpen(true);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-gray-50/50 dark:bg-gray-900/50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageBreadcrumb pageTitle="Product Reviews" />
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-sking-pink text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-sking-pink/20 hover:bg-sking-pink/90 transition-all"
                >
                    <Plus size={16} />
                    Add Review
                </button>
            </div>

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex bg-white dark:bg-gray-800 p-1 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm w-fit">
                    {['all', 'active', 'blocked'].map((s) => (
                        <button
                            key={s}
                            onClick={() => { setStatus(s); setPage(1); }}
                            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${status === s
                                ? "bg-sking-pink text-white shadow-lg shadow-sking-pink/20"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSearch} className="relative group w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sking-pink/5 focus:border-sking-pink/30 shadow-sm group-hover:shadow-md transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-sking-pink transition-colors" size={18} />
                </form>
            </div>

            {/* Content Card */}
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50 dark:border-gray-700">
                                <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Reviewer</th>
                                <th className="text-left px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Product</th>
                                <th className="text-left px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Rating</th>
                                <th className="text-left px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Comment</th>
                                <th className="text-left px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Date</th>
                                <th className="text-left px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Status</th>
                                <th className="text-right px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-24">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="relative">
                                                <div className="w-12 h-12 border-4 border-sking-pink/20 border-t-sking-pink rounded-full animate-spin"></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Loader2 className="animate-spin text-sking-pink" size={16} />
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Loading Reviews...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-24">
                                        <div className="space-y-3">
                                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                                                <MessageSquare size={32} className="text-gray-300 dark:text-gray-600" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-400 dark:text-gray-500">No reviews found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review: any) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={review._id}
                                        className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors group ${review.isPinned ? "bg-sking-pink/5 dark:bg-sking-pink/5" : ""}`}
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden relative border border-gray-100 dark:border-gray-600 group-hover:scale-105 transition-transform">
                                                    <Image
                                                        src={review.user?.profilePicture || '/images/user/user-01.png'}
                                                        alt={review.user?.username}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1">
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{review.user?.username}</p>
                                                        {review.isPinned && <Pin size={12} className="text-sking-pink fill-current" />}
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{review.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 overflow-hidden relative border border-gray-100 dark:border-gray-600 group-hover:rotate-3 transition-transform">
                                                    <Image
                                                        src={review.product?.images?.[0] || '/images/product/product-01.png'}
                                                        alt={review.product?.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white max-w-[150px] truncate">{review.product?.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1">
                                                <Star size={14} className="text-yellow-400 fill-current" />
                                                <span className="text-sm font-black italic text-gray-900 dark:text-white">{review.rating}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs text-gray-600 dark:text-gray-300 max-w-[250px] line-clamp-2 leading-relaxed font-medium">
                                                {review.comment}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                <span className="text-[9px] text-gray-400 dark:text-gray-500">{new Date(review.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {review.isBlocked ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20">
                                                    <ShieldAlert size={10} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Blocked</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20">
                                                    <ShieldCheck size={10} />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => openDetails(review)}
                                                className="p-2 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg rounded-xl transition-all text-gray-400 dark:text-gray-500 hover:text-sking-pink dark:hover:text-sking-pink border border-transparent hover:border-gray-100 dark:hover:border-gray-600"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && total > 0 && (
                    <div className="p-8 border-t border-gray-50 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/10 dark:bg-gray-900/10">
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            Showing <span className="text-gray-900 dark:text-white">{(page - 1) * 10 + 1} - {Math.min(page * 10, total)}</span> of {total} reviews
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:text-sking-pink dark:hover:text-sking-pink hover:border-sking-pink/30 hover:shadow-lg transition-all disabled:opacity-30 disabled:hover:shadow-none"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${page === i + 1
                                        ? "bg-sking-pink text-white shadow-lg shadow-sking-pink/20"
                                        : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-sking-pink/30 hover:text-sking-pink shadow-sm"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={page === totalPages}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:text-sking-pink dark:hover:text-sking-pink hover:border-sking-pink/30 hover:shadow-lg transition-all disabled:opacity-30 disabled:hover:shadow-none"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ReviewDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                review={selectedReview}
                onBlock={handleBlock}
                onUnblock={() => handleUnblock()}
                onPin={handlePin}
                onDelete={handleDeleteReview}
            />

            <AddReviewModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchReviews}
                preselectedProductId="" // Or pass selected product if we contextually add review from product details
            />
        </div>
    );
};
export default ReviewsPage;
