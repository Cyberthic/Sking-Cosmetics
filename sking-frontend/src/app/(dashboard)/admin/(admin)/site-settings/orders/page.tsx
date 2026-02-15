"use client";

import React, { useEffect, useState } from "react";
import PageBreadCrumb from "@/components/admin/common/PageBreadCrumb";
import { adminOrderSettingsService, OrderSettings } from "@/services/admin/adminOrderSettingsApiService";
import { toast } from "sonner";
import {
    Settings2,
    Save,
    MessageSquare,
    ShieldCheck,
    AlertCircle,
    Check
} from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSettingsPage() {
    const [settings, setSettings] = useState<OrderSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await adminOrderSettingsService.getSettings();
            if (res.success) {
                setSettings(res.data);
            }
        } catch (error) {
            toast.error("Failed to fetch settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!settings) return;

        setIsSaving(true);
        try {
            const res = await adminOrderSettingsService.updateSettings(settings);
            if (res.success) {
                toast.success("Order settings updated successfully");
            }
        } catch (error) {
            toast.error("Failed to update settings");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 animate-pulse">
                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
                    <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <PageBreadCrumb pageTitle="Order Configuration" />

            <div className="mt-10 max-w-5xl">
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-8 md:p-12 shadow-2xl shadow-brand-500/5">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Checkout Logic</h2>
                            <p className="text-gray-500 mt-2 font-medium">Configure payment & ordering methods available for users.</p>
                        </div>
                        <button
                            onClick={handleUpdate}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-500/20 disabled:opacity-50"
                        >
                            {isSaving ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Online Payment Card */}
                        <div
                            onClick={() => setSettings(s => s ? { ...s, isOnlinePaymentEnabled: !s.isOnlinePaymentEnabled } : null)}
                            className={`group relative p-8 rounded-[2rem] border-2 transition-all cursor-pointer ${settings?.isOnlinePaymentEnabled ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/5' : 'border-gray-100 dark:border-white/5 hover:border-gray-200'}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 ${settings?.isOnlinePaymentEnabled ? 'bg-brand-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">Online Payment</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">Enable secure checkout via Razorpay (UPI, Cards, Netbanking).</p>

                            <div className="flex items-center justify-between mt-auto">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${settings?.isOnlinePaymentEnabled ? 'text-brand-500' : 'text-gray-400'}`}>
                                    {settings?.isOnlinePaymentEnabled ? 'Operational' : 'Disabled'}
                                </span>
                                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${settings?.isOnlinePaymentEnabled ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-800'}`}>
                                    <div className={`aspect-square h-full bg-white rounded-full transition-transform ${settings?.isOnlinePaymentEnabled ? 'translate-x-4' : ''}`} />
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp Ordering Card */}
                        <div
                            onClick={() => setSettings(s => s ? { ...s, isWhatsappOrderingEnabled: !s.isWhatsappOrderingEnabled } : null)}
                            className={`group relative p-8 rounded-[2rem] border-2 transition-all cursor-pointer ${settings?.isWhatsappOrderingEnabled ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5' : 'border-gray-100 dark:border-white/5 hover:border-gray-200'}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 ${settings?.isWhatsappOrderingEnabled ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                <MessageSquare size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">WhatsApp Flow</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-6">Users can place orders by redirecting to your WhatsApp chat with order details.</p>

                            <div className="flex items-center justify-between mt-auto">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${settings?.isWhatsappOrderingEnabled ? 'text-emerald-500' : 'text-gray-400'}`}>
                                    {settings?.isWhatsappOrderingEnabled ? 'Operational' : 'Disabled'}
                                </span>
                                <div className={`w-10 h-6 rounded-full p-1 transition-colors ${settings?.isWhatsappOrderingEnabled ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-800'}`}>
                                    <div className={`aspect-square h-full bg-white rounded-full transition-transform ${settings?.isWhatsappOrderingEnabled ? 'translate-x-4' : ''}`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Number Config */}
                    <div className="mt-12 p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 flex items-center justify-center text-emerald-500">
                                <AlertCircle size={20} />
                            </div>
                            <h4 className="text-lg font-bold uppercase tracking-tight">Support Endpoint</h4>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Target WhatsApp Number</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={settings?.whatsappNumber || ""}
                                    onChange={(e) => setSettings(s => s ? { ...s, whatsappNumber: e.target.value } : null)}
                                    placeholder="+91 000 000 0000"
                                    className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Active</div>
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium pl-1 italic">Include country code (e.g., +91). This number will receive order details when WhatsApp flow is used.</p>
                        </div>
                    </div>

                    {/* Warning Section */}
                    {(!settings?.isOnlinePaymentEnabled && !settings?.isWhatsappOrderingEnabled) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-8 p-6 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-start gap-4"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center text-red-500 shadow-sm shrink-0">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-red-600 uppercase tracking-tight text-sm">Critical Warning</h4>
                                <p className="text-xs text-red-500/80 font-medium mt-1">Both ordering methods are disabled. Users will not be able to complete checkouts!</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
