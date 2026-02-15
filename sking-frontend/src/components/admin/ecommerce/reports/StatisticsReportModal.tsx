"use client";
import React, { useState, useRef, useEffect } from "react";
import { Modal } from "@/components/admin/ui/modal";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchReport, clearReport } from "@/redux/features/adminDashboardSlice";
import { ReportPrintView } from "./ReportPrintView";
import { Loader2, PrinterIcon, RefreshCw, FileText } from "lucide-react";

interface StatisticsReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const StatisticsReportModal: React.FC<StatisticsReportModalProps> = ({
    isOpen,
    onClose,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { data: reportData, loading, startDate: reportStart, endDate: reportEnd } = useSelector((state: RootState) => state.adminDashboard.report);

    const componentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Sking-Cosmetics-Report-${new Date().toISOString().split('T')[0]}`,
    });

    const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly" | "yearly" | "custom">("monthly");

    // Date states
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState<string>(today);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: today, end: today });

    // Reset report data when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            dispatch(clearReport());
        }
    }, [isOpen, dispatch]);

    const handleGenerate = () => {
        let start: Date;
        let end: Date;

        if (reportType === "daily") {
            start = new Date(selectedDate);
            end = new Date(selectedDate);
            end.setHours(23, 59, 59, 999);
        } else if (reportType === "weekly") {
            // Current week containing selected date
            const d = new Date(selectedDate);
            const day = d.getDay(); // 0 (Sun) to 6 (Sat)
            const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
            start = new Date(d.setDate(diff));
            start.setHours(0, 0, 0, 0);
            end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
        } else if (reportType === "monthly") {
            start = new Date(selectedYear, selectedMonth, 1);
            end = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59, 999);
        } else if (reportType === "yearly") {
            start = new Date(selectedYear, 0, 1);
            end = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
        } else { // custom
            start = new Date(dateRange.start);
            end = new Date(dateRange.end);
            end.setHours(23, 59, 59, 999);
        }

        dispatch(fetchReport({
            startDate: start.toISOString(),
            endDate: end.toISOString()
        }));
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
                <div className="p-6">
                    <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-800">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                            Generate Statistics Report
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Select a period to generate a detailed performance report.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Report Type</label>
                            <select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value as any)}
                                className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                            >
                                <option value="daily">Daily Report</option>
                                <option value="weekly">Weekly Report</option>
                                <option value="monthly">Monthly Report</option>
                                <option value="yearly">Yearly Report</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>

                        {/* Conditional Inputs */}
                        <div>
                            {(reportType === "daily" || reportType === "weekly") && (
                                <>
                                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Select Date</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </>
                            )}

                            {reportType === "monthly" && (
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Month</label>
                                        <select
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        >
                                            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                                        </select>
                                    </div>
                                    <div className="w-24">
                                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
                                        <input
                                            type="number"
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                            )}

                            {reportType === "yearly" && (
                                <>
                                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Year</label>
                                    <input
                                        type="number"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </>
                            )}

                            {reportType === "custom" && (
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                                        <input
                                            type="date"
                                            value={dateRange.start}
                                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                                        <input
                                            type="date"
                                            value={dateRange.end}
                                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                            className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                        >
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
                            Generate Data
                        </button>

                        <button
                            onClick={() => handlePrint()}
                            disabled={!reportData || loading}
                            className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-300 dark:bg-brand-600 dark:hover:bg-brand-700 dark:focus:ring-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PrinterIcon className="h-4 w-4" />
                            Print / Save PDF
                        </button>
                    </div>

                    {/* Preview Area (Optional) */}
                    {reportData && (
                        <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                            <p className="flex items-center gap-2 font-medium">
                                <FileText className="h-4 w-4" />
                                Report generated successfully! Ready to print.
                            </p>
                            <p className="text-sm mt-1 ml-6">
                                Contains data for {reportData.orderStats.totalOrders} orders.
                            </p>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Hidden Print Component */}
            <div style={{ display: "none" }}>
                <ReportPrintView
                    ref={componentRef}
                    data={reportData}
                    startDate={reportStart}
                    endDate={reportEnd}
                />
            </div>
        </>
    );
};
