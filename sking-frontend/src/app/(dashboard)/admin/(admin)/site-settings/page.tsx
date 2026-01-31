import type { Metadata } from "next";
import React from "react";
import PageBreadCrumb from "@/components/admin/common/PageBreadCrumb";
import { SiteSettingTiles } from "@/components/admin/site-settings/SiteSettingTiles";

export const metadata: Metadata = {
    title: "Site Settings | Sking Cosmetics Admin",
    description: "Configure and manage various aspects of your storefront.",
};

export default function SiteSettingsPage() {
    return (
        <div className="relative min-h-screen">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-brand-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full" />

            <div className="p-4 md:p-8">
                <PageBreadCrumb pageTitle="Site Settings" />

                <div className="mt-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="max-w-3xl">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                                Control <span className="text-brand-500">Center</span>
                            </h2>
                            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                                Empower your brand with a suite of professional configuration tools.
                                From messaging automation to storefront aesthetics, manage every touchpoint
                                of your digital ecosystem.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[10px] font-bold">
                                        AI
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs font-medium text-gray-500 pr-2">3 Modules Active</span>
                        </div>
                    </div>

                    <SiteSettingTiles />
                </div>

                <footer className="mt-24 border-t border-gray-100 dark:border-white/5 pt-12 pb-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 gap-4">
                    <p>&copy; {new Date().getFullYear()} Sking Cosmetics Management System. Professional Edition.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-brand-500 transition-colors">Documentation</a>
                        <a href="#" className="hover:text-brand-500 transition-colors">Support API</a>
                        <a href="#" className="hover:text-brand-500 transition-colors">System Status</a>
                    </div>
                </footer>
            </div>
        </div>
    );
}
