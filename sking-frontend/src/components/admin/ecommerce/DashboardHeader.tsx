"use client";
import React, { useState } from "react";
import { StatisticsReportModal } from "@/components/admin/ecommerce/reports/StatisticsReportModal";
import { FileText, Download } from "lucide-react";

export const DashboardHeader = () => {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-title-md2 font-bold text-black dark:text-white">
                Dashboard Overview
            </h2>

            <button
                onClick={() => setIsReportModalOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-brand-500 px-6 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-6"
            >
                <span>
                    <FileText className="h-5 w-5" />
                </span>
                Statistics Reports
            </button>

            <StatisticsReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
            />
        </div>
    );
};
