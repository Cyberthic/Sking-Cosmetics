"use client";

import React, { useState } from "react";
import { Star, X, Camera, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { userReviewApiService } from "@/services/user/userReviewApiService";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    productName: string;
    orderId: string;
    onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
    isOpen,
    onClose,
    productId,
    productName,
    orderId,
    onSuccess
}) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (comment.trim().length < 10) {
            toast.error("Comment must be at least 10 characters long");
            return;
        }

        setLoading(true);
        try {
            const res = await userReviewApiService.createReview({
                productId,
                orderId,
                rating,
                comment
            });
            if (res.success) {
                toast.success("Review submitted successfully!");
                onSuccess();
                onClose();
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden"
                >
                    <div className="p-8 md:p-12">
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block">Share your experience</span>
                            <h2 className="text-3xl font-black text-black uppercase tracking-tight leading-none mb-2">Write a Review</h2>
                            <p className="text-sm text-gray-500 font-medium">For: <span className="text-sking-pink font-bold">{productName}</span></p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Rating */}
                            <div className="flex flex-col items-center gap-4 py-8 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">How would you rate it?</span>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                            className="transition-transform active:scale-90"
                                        >
                                            <Star
                                                size={40}
                                                fill={(hover || rating) >= star ? "#FF1493" : "none"}
                                                className={`transition-colors ${(hover || rating) >= star ? "text-sking-pink" : "text-gray-300"}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <span className="text-sm font-black text-black uppercase tracking-widest min-h-[20px]">
                                    {rating === 1 && "Poor"}
                                    {rating === 2 && "Fair"}
                                    {rating === 3 && "Good"}
                                    {rating === 4 && "Great"}
                                    {rating === 5 && "Excellent"}
                                </span>
                            </div>

                            {/* Comment */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Your Feedback</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us what you liked or disliked about the product..."
                                    rows={5}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-6 text-sm text-black focus:outline-none focus:ring-2 focus:ring-sking-pink/5 focus:border-sking-pink transition-all resize-none placeholder:text-gray-400 font-medium"
                                />
                                <div className="flex justify-between px-2">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Min. 10 characters</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${comment.length < 10 ? 'text-orange-400' : 'text-green-500'}`}>
                                        {comment.length} characters
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-black text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : "Submit Review"}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
