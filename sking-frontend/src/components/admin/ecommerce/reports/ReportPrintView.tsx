import React from "react";
import { DashboardStats } from "@/services/admin/adminDashboardApiService";
import { EyeIcon } from "@/icons";

interface ReportPrintViewProps {
    data: DashboardStats | null;
    startDate: string | null;
    endDate: string | null;
}

export const ReportPrintView = React.forwardRef<HTMLDivElement, ReportPrintViewProps>(
    ({ data, startDate, endDate }, ref) => {
        if (!data) return null;

        const formatDate = (dateString: string | null) => {
            if (!dateString) return "N/A";
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        };

        return (
            <div ref={ref} className="p-10 bg-white text-black font-sans min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-end border-b-2 border-brand-500 pb-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-brand-900 uppercase tracking-wide">
                            Sales & Performance Report
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Sking Cosmetics Admin Dashboard</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Report Period</p>
                        <p className="font-bold text-lg">
                            {formatDate(startDate)} - {formatDate(endDate)}
                        </p>
                    </div>
                </div>

                {/* Global Stats Grid */}
                <div className="grid grid-cols-3 gap-8 mb-12">
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm break-inside-avoid">
                        <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider mb-2">Total Orders</p>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                            {data.orderStats.totalOrders.toLocaleString()}
                        </h2>
                        <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${data.orderStats.isGrowthPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {data.orderStats.isGrowthPositive ? '+' : '-'}{Math.abs(data.orderStats.growthPercentage)}% Growth
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm break-inside-avoid">
                        <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider mb-2">Total Customers</p>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                            {data.customerStats.totalCustomers.toLocaleString()}
                        </h2>
                        <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${data.customerStats.isGrowthPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {data.customerStats.isGrowthPositive ? '+' : '-'}{Math.abs(data.customerStats.growthPercentage)}% Growth
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 shadow-sm break-inside-avoid">
                        <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider mb-2">Total Revenue</p>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">
                            ₹{data.monthlyTarget.revenue.toLocaleString()}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">Based on current period data</p>
                    </div>
                </div>

                {/* Sales Breakdown Table */}
                <div className="mb-12 break-inside-avoid">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-brand-500 pl-4">
                        Sales Breakdown
                    </h3>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Time Period</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Orders</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.monthlySales.map((item, index) => (
                                    (item.sales > 0 || item.orders > 0) && (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.month}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.orders}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-right">₹{item.sales.toLocaleString()}</td>
                                        </tr>
                                    )
                                ))}
                                {data.monthlySales.every(i => i.sales === 0 && i.orders === 0) && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No sales data available for breakdown in this period.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Orders Snapshot */}
                {data.recentOrders && data.recentOrders.length > 0 && (
                    <div className="mb-12 break-inside-avoid">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 border-l-4 border-brand-500 pl-4">
                            Recent Transactions
                        </h3>
                        <div className="overflow-hidden rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Customer</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Amount</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.recentOrders.slice(0, 10).map((order) => (
                                        <tr key={order._id}>
                                            <td className="px-4 py-3 text-sm text-gray-900">#{order.displayId}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{order.customerName}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">₹{order.amount.toLocaleString()}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-auto pt-10 border-t border-gray-200 text-center text-gray-400 text-sm">
                    <p>Sking Cosmetics &copy; {new Date().getFullYear()} - Confidential Report</p>
                </div>
            </div>
        );
    }
);

ReportPrintView.displayName = "ReportPrintView";
