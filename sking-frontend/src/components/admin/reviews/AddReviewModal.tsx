"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Upload, Loader2, Search } from "lucide-react";
import { SearchableSelect } from "@/components/user/ui/SearchableSelect";
import { adminProductService } from "@/services/admin/adminProductApiService";
import { adminCustomerService } from "@/services/admin/adminCustomerApiService";
import { adminReviewService } from "@/services/admin/adminReviewApiService";
import { toast } from "sonner";
import Image from "next/image";

interface AddReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    preselectedProductId?: string;
}

export default function AddReviewModal({ isOpen, onClose, onSuccess, preselectedProductId }: AddReviewModalProps) {
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [isPostingAsAdmin, setIsPostingAsAdmin] = useState(true);

    const [formData, setFormData] = useState({
        productId: preselectedProductId || "",
        userId: "",
        rating: 5,
        comment: "",
        images: [] as string[],
    });

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ ...prev, productId: preselectedProductId || "" }));
            fetchInitialData();
        }
    }, [isOpen, preselectedProductId]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [productsData, usersData] = await Promise.all([
                adminProductService.getProducts(1, 100), // Get enough products
                adminCustomerService.getAllUsers(1, 100) // Get enough users
            ]);

            if (productsData?.products) {
                setProducts(productsData.products.map((p: any) => ({
                    label: p.name,
                    value: p._id,
                    subLabel: `Price: $${p.price}`
                })));
            }

            if (usersData?.data?.users) {
                setUsers(usersData.data.users.map((u: any) => ({
                    label: u.name || u.username,
                    value: u._id,
                    subLabel: u.email
                })));
            }
        } catch (error) {
            console.error("Failed to fetch initial data", error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.productId || !formData.rating || !formData.comment) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!isPostingAsAdmin && !formData.userId) {
            toast.error("Please select a user for the review");
            return;
        }

        try {
            setSubmitting(true);

            await adminReviewService.createReview({
                ...formData,
                userId: isPostingAsAdmin ? "" : formData.userId,
                isPinned: false
            });

            toast.success("Review added successfully");
            onSuccess?.();
            onClose();
            // Reset form
            setFormData({
                productId: "",
                userId: "",
                rating: 5,
                comment: "",
                images: []
            });
            setIsPostingAsAdmin(true);
        } catch (error: any) {
            console.error("Failed to create review", error);
            toast.error(error.response?.data?.message || "Failed to create review");
        } finally {
            setSubmitting(false);
        }
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
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-black border border-gray-100 dark:border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="p-8 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">Add Review</h3>
                                <p className="text-sm text-gray-500 font-medium">Create a new review for a product</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                            <form id="add-review-form" onSubmit={handleSubmit} className="space-y-8">
                                <div className="p-1 bg-gray-100 dark:bg-white/5 rounded-xl flex gap-1 w-fit">
                                    <button
                                        type="button"
                                        onClick={() => setIsPostingAsAdmin(true)}
                                        className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${isPostingAsAdmin
                                                ? "bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm"
                                                : "text-gray-500 hover:text-black dark:hover:text-white"
                                            }`}
                                    >
                                        Post as Admin
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsPostingAsAdmin(false)}
                                        className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${!isPostingAsAdmin
                                                ? "bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm"
                                                : "text-gray-500 hover:text-black dark:hover:text-white"
                                            }`}
                                    >
                                        Post as User
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 pl-1">Product</label>
                                        <div className="relative">
                                            <SearchableSelect
                                                options={products}
                                                value={formData.productId}
                                                onChange={(val) => setFormData({ ...formData, productId: val })}
                                                placeholder="Select Product"
                                                disabled={loading || !!preselectedProductId}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    {!isPostingAsAdmin && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="space-y-3"
                                        >
                                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 pl-1">User</label>
                                            <SearchableSelect
                                                options={users}
                                                value={formData.userId}
                                                onChange={(val) => setFormData({ ...formData, userId: val })}
                                                placeholder="Select User"
                                                disabled={loading}
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 pl-1">Rating</label>
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 w-fit">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, rating: star })}
                                                    className="transition-transform hover:scale-110 focus:outline-none"
                                                >
                                                    <Star
                                                        size={24}
                                                        className={star <= formData.rating ? "text-sking-pink fill-current" : "text-gray-200 dark:text-gray-700"}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <div className="h-6 w-[1px] bg-gray-200 dark:bg-white/10"></div>
                                        <span className="text-lg font-black text-gray-900 dark:text-white">{formData.rating}.0</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Review Comment</label>
                                    <textarea
                                        value={formData.comment}
                                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                        placeholder="Write review description..."
                                        rows={4}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-sking-pink/50 text-sm"
                                        required
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={submitting}
                                className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="add-review-form"
                                disabled={submitting}
                                className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-sking-pink text-white shadow-lg shadow-sking-pink/20 hover:bg-sking-pink/90 transition-all flex items-center gap-2"
                            >
                                {submitting && <Loader2 size={14} className="animate-spin" />}
                                {submitting ? "Saving..." : "Add Review"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
