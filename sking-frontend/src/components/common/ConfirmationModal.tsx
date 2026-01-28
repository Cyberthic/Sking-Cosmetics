"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Trash2, Info, X, Loader2, CheckCircle2 } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    isLoading?: boolean;
}

const icons = {
    danger: <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />,
    warning: <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
    info: <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    success: <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />,
};

const bgColors = {
    danger: 'bg-red-50 dark:bg-red-500/10',
    warning: 'bg-amber-50 dark:bg-amber-500/10',
    info: 'bg-blue-50 dark:bg-blue-500/10',
    success: 'bg-green-50 dark:bg-green-500/10',
};

const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none',
    warning: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200 dark:shadow-none',
    info: 'bg-black dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-gray-200 shadow-black/20 dark:shadow-none',
    success: 'bg-green-600 hover:bg-green-700 shadow-green-200 dark:shadow-none',
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger',
    isLoading = false,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
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
                        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden z-10 border border-transparent dark:border-white/[0.05]"
                    >
                        {/* Header Decoration */}
                        <div className={`h-2 w-full ${type === 'danger' ? 'bg-red-600' : type === 'warning' ? 'bg-amber-600' : type === 'success' ? 'bg-green-600' : 'bg-black'}`} />

                        <div className="p-8">
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${bgColors[type]}`}>
                                    {icons[type]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-black uppercase tracking-tight text-black dark:text-white">{title}</h3>
                                        <button
                                            onClick={onClose}
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-black dark:hover:text-white"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{message}</p>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-100 dark:border-white/[0.05] font-bold uppercase tracking-wider text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-gray-600 dark:text-gray-400 disabled:opacity-50"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    type="button"
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`flex-1 px-6 py-4 rounded-2xl text-white font-bold uppercase tracking-wider text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${buttonColors[type]}`}
                                >
                                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
