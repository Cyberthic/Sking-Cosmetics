"use client";
import React from "react";
import { X, Star, Calendar, User, ShoppingBag, ShieldAlert, CheckCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";

interface ReviewDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    review: any;
    onBlock: (duration: string) => void;
    onUnblock: () => void;
    onDelete?: () => void;
}

const ReviewDetailsModal: React.FC<ReviewDetailsModalProps> = ({ isOpen, onClose, review, onBlock, onUnblock, onDelete }) => {
    if (!review) return null;

    const [blockDuration, setBlockDuration] = React.useState("day");
    const [showBlockOptions, setShowBlockOptions] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDelete = async () => {
        if (!onDelete) return;
        setIsDeleting(true);
        await onDelete();
        setIsDeleting(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 sticky top-0 z-10">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Review Details</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Review ID: {review._id}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Side: User & Product */}
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Customer</h4>
                                        <Link href={`/admin/customers/${review.user?._id}`} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-100 dark:border-gray-700 group">
                                            <div className="w-10 h-10 rounded-full overflow-hidden relative border border-gray-200 dark:border-gray-600">
                                                <Image
                                                    src={review.user?.profilePicture || '/images/user/user-01.png'}
                                                    alt={review.user?.username}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-sking-pink transition-colors">{review.user?.username}</p>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400">{review.user?.email}</p>
                                            </div>
                                        </Link>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Product</h4>
                                        <Link href={`/admin/products/${review.product?._id}`} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-gray-100 dark:border-gray-700 group">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-gray-200 dark:border-gray-600">
                                                <Image
                                                    src={review.product?.images?.[0] || '/images/product/product-01.png'}
                                                    alt={review.product?.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-sking-pink transition-colors">{review.product?.name}</p>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400">Slug: {review.product?.slug}</p>
                                            </div>
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Rating</p>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-200 dark:text-gray-700"}
                                                    />
                                                ))}
                                                <span className="ml-1 text-sm font-bold text-gray-900 dark:text-white">{review.rating}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Date</p>
                                            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-200">
                                                <Calendar size={14} className="text-gray-400 dark:text-gray-500" />
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Comment & Media */}
                                <div className="space-y-6">
                                    <div className="space-y-3 font-medium">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">The Review</h4>
                                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 max-h-[300px] overflow-y-auto text-sm text-gray-700 dark:text-gray-300 leading-relaxed custom-scrollbar">
                                            {review.comment}
                                        </div>
                                    </div>

                                    {review.images && review.images.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Media</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {review.images.map((img: string, i: number) => (
                                                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                                                        <Image src={img} alt={`Media ${i}`} fill className="object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {review.isBlocked && (
                                        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 space-y-2">
                                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                                <ShieldAlert size={16} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Blocked</span>
                                            </div>
                                            {review.blockedUntil && (
                                                <p className="text-[11px] text-red-500 dark:text-red-400/80">
                                                    Until: {new Date(review.blockedUntil).toLocaleDateString()} {new Date(review.blockedUntil).toLocaleTimeString()}
                                                </p>
                                            )}
                                            {review.blockReason && (
                                                <p className="text-[11px] text-red-500 dark:text-red-400/80 italic">"{review.blockReason}"</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                {review.isBlocked ? (
                                    <button
                                        onClick={onUnblock}
                                        className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-600/20"
                                    >
                                        <CheckCircle size={14} />
                                        Unblock Review
                                    </button>
                                ) : (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowBlockOptions(!showBlockOptions)}
                                            className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-600/20"
                                        >
                                            <ShieldAlert size={14} />
                                            Block Review
                                        </button>

                                        <AnimatePresence>
                                            {showBlockOptions && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute bottom-full left-0 mb-3 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col p-2 z-20"
                                                >
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 p-2 border-b border-gray-50 dark:border-gray-700 mb-1">Select Duration</p>
                                                    {['day', 'week', 'month', 'permanent'].map((d) => (
                                                        <button
                                                            key={d}
                                                            onClick={() => onBlock(d)}
                                                            className="text-left px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 rounded-lg capitalize transition-all"
                                                        >
                                                            {d}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {onDelete && (
                                    <button
                                        onClick={() => setIsDeleting(true)}
                                        className="px-6 py-2.5 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex items-center gap-2"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
            <ConfirmationModal
                isOpen={isDeleting}
                onClose={() => setIsDeleting(false)}
                onConfirm={handleDelete}
                title="Delete Review"
                message="Are you sure you want to delete this review? This action cannot be undone."
                confirmText="Delete"
                type="danger"
            />
        </AnimatePresence>
    );
};

export default ReviewDetailsModal;
