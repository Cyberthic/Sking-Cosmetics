
"use client";

import React, { useEffect, useState } from "react";
import PageBreadCrumb from "@/components/admin/common/PageBreadCrumb";
import { adminDeliveryService } from "@/services/admin/adminDeliveryApiService";
import { toast } from "sonner";
import {
    Save,
    Truck,
    Package,
    IndianRupee,
    ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeliverySettingsPage() {
    const [settings, setSettings] = useState<{ deliveryCharge: number | string; freeShippingThreshold: number | string }>({ deliveryCharge: 49, freeShippingThreshold: 1000 });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await adminDeliveryService.getDeliverySettings();
            if (res.success) {
                setSettings(res.settings);
            }
        } catch (error) {
            toast.error("Failed to fetch delivery settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!settings) return;

        setIsSaving(true);
        try {
            const res = await adminDeliveryService.updateDeliverySettings(Number(settings.deliveryCharge), Number(settings.freeShippingThreshold));
            if (res.success) {
                toast.success("Delivery settings updated successfully");
                setSettings(res.settings);
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
                <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <PageBreadCrumb
                    pageTitle="Delivery Configuration"
                    parentPage="Site Settings"
                    parentHref="/admin/site-settings"
                />
            </div>

            <div className="mt-10 max-w-5xl">
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-8 md:p-12 shadow-2xl shadow-brand-500/5">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Shipping Strategy</h2>
                            <p className="text-gray-500 mt-2 font-medium">Configure delivery charges and free shipping thresholds.</p>
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
                        {/* Standard Delivery Charge */}
                        <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Truck size={100} className="text-brand-500" />
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 flex items-center justify-center text-brand-500 shadow-sm">
                                    <Truck size={24} />
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-tight">Standard Delivery</h3>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Base Charge (INR)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={settings.deliveryCharge}
                                        onChange={(e) => setSettings(s => ({ ...s, deliveryCharge: e.target.value }))}
                                        className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 pl-12 font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-sm text-lg"
                                    />
                                    <IndianRupee size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium pl-1 italic">
                                    Applied to orders below the free shipping threshold.
                                </p>
                            </div>
                        </div>

                        {/* Free Shipping Threshold */}
                        <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Package size={100} className="text-emerald-500" />
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 flex items-center justify-center text-emerald-500 shadow-sm">
                                    <Package size={24} />
                                </div>
                                <h3 className="text-xl font-bold uppercase tracking-tight">Free Shipping</h3>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 pl-1">Threshold Amount (INR)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={settings.freeShippingThreshold}
                                        onChange={(e) => setSettings(s => ({ ...s, freeShippingThreshold: e.target.value }))}
                                        className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 pl-12 font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm text-lg"
                                    />
                                    <IndianRupee size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium pl-1 italic">
                                    Orders above this amount will qualify for free delivery.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
