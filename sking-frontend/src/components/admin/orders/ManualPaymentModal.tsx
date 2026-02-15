"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, MessageSquare, CreditCard, CheckCircle2 } from 'lucide-react';
import Button from '../ui/button/Button';

interface ManualPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: { upiTransactionId?: string }) => void;
    isLoading?: boolean;
    orderAmount: number;
}

export const ManualPaymentModal: React.FC<ManualPaymentModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    orderAmount,
}) => {
    const [upiId, setUpiId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({ upiTransactionId: upiId });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl overflow-hidden z-10 border border-transparent dark:border-white/[0.05]"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />

                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight text-black dark:text-white">Confirm Manual Payment</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">WhatsApp Order Verification</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors text-gray-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="bg-gray-50 dark:bg-white/[0.02] rounded-3xl p-6 mb-8 border border-gray-100 dark:border-white/[0.05]">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Verify Amount Received</span>
                                <div className="text-3xl font-black text-black dark:text-white italic">₹{orderAmount.toLocaleString()}</div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">
                                        UPI Transaction ID
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. 523410987321"
                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.08] rounded-2xl text-sm font-bold placeholder:text-gray-300 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none uppercase tracking-widest"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                    />
                                    <p className="mt-2 text-[9px] text-gray-400 font-medium px-1 italic">
                                        Enter the 12-digit UPI reference number from the customer's payment screenshot.
                                    </p>
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
                                        disabled={isLoading}
                                        className="flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-[10px]"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading || upiId.length < 8}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                        Verify & Confirm
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
