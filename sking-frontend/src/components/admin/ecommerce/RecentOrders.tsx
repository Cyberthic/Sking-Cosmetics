"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

export default function RecentOrders() {
  const { data: orders, loading } = useSelector((state: RootState) => state.adminDashboard.recentOrders);

  // Initial fetch handled by DashboardInit

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('delivered') || s.includes('shipped') || s.includes('processing')) return 'success';
    if (s.includes('pending') || s.includes('payment_pending')) return 'warning';
    if (s.includes('cancelled') || s.includes('failed')) return 'error';
    return 'warning';
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Orders
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Latest five transactions in your store
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            See all
          </Link>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Products
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Customer
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Amount
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-gray-500">
                  Loading recent orders...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-gray-500">
                  No recent orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-md bg-gray-100 flex-shrink-0 relative">
                        {order.productImage ? (
                          <Image
                            width={50}
                            height={50}
                            src={order.productImage}
                            className="h-full w-full object-cover"
                            alt={`Order ${order.displayId}`}
                            unoptimized={true} // Bypasses Next.js image optimization for Cloudinary if needed, or if URLs are tricky
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          #{order.displayId}
                        </span>
                        <span className="text-gray-500 text-[10px] dark:text-gray-400">
                          {formatDate(order.date)}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-col">
                      <span className="text-gray-800 text-theme-sm dark:text-white/90">
                        {order.customerName}
                      </span>
                      <span className="text-gray-500 text-[10px] dark:text-gray-400">
                        {order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    ₹{order.amount.toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      size="sm"
                      color={getStatusColor(order.status)}
                    >
                      {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.replace('_', ' ').slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
