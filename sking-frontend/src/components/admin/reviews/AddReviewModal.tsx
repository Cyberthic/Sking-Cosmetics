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
            toast.error("Failed to load products or users");
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

        try {
            setSubmitting(true);
            // If userId is empty, it might be an admin review without specific user, 
            // but schema requires user. 
            // If admin doesn't select user, we might need to handle it. 
            // For now, let's require user selection or pick the first one (admin?) 
            // Assuming admin selects a user for testimonial. 
            // If no user selected, we can't submit unless we have a default admin user ID.

            if (!formData.userId) {
                toast.error("Please select a user for the review");
                return;
            }

            await adminReviewService.createReview({
                ...formData,
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
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Review</h3>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <form id="add-review-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Product</label>
                                        <SearchableSelect
                                            options={products}
                                            value={formData.productId}
                                            onChange={(val) => setFormData({ ...formData, productId: val })}
                                            placeholder="Select Product"
                                            disabled={loading || !!preselectedProductId}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">User</label>
                                        <SearchableSelect
                                            options={users}
                                            value={formData.userId}
                                            onChange={(val) => setFormData({ ...formData, userId: val })}
                                            placeholder="Select User"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Rating</label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, rating: star })}
                                                className="transition-transform hover:scale-110 focus:outline-none"
                                            >
                                                <Star
                                                    size={28}
                                                    className={star <= formData.rating ? "text-yellow-400 fill-current" : "text-gray-200 dark:text-gray-700"}
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-2 text-lg font-bold text-gray-700 dark:text-gray-300">{formData.rating} Stars</span>
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
