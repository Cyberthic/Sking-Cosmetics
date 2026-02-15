"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchSummary, setMetricsPeriods } from "@/redux/features/adminDashboardSlice";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon, MoreDotIcon } from "@/icons";
import { DashboardPeriod } from "@/services/admin/adminDashboardApiService";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export const EcommerceMetrics = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { customerStats, orderStats, loading, customerPeriod, orderPeriod } = useSelector((state: RootState) => state.adminDashboard.summary);

  // Dropdown states
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);

  // Initial fetch handled by DashboardInit

  const handleCustomerPeriodChange = (period: DashboardPeriod) => {
    dispatch(setMetricsPeriods({ customerPeriod: period, orderPeriod }));
    dispatch(fetchSummary({ customerPeriod: period, orderPeriod }));
    setIsCustomerDropdownOpen(false);
  };

  const handleOrderPeriodChange = (period: DashboardPeriod) => {
    dispatch(setMetricsPeriods({ customerPeriod, orderPeriod: period }));
    dispatch(fetchSummary({ customerPeriod, orderPeriod: period }));
    setIsOrderDropdownOpen(false);
  };

  const periods: { label: string; value: DashboardPeriod }[] = [
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "quarterly" },
    { label: "Yearly", value: "yearly" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Customer Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
              className="dropdown-toggle flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {periods.find((p) => p.value === customerPeriod)?.label}
              <MoreDotIcon className="size-5" />
            </button>
            <Dropdown
              isOpen={isCustomerDropdownOpen}
              onClose={() => setIsCustomerDropdownOpen(false)}
              className="w-32"
            >
              {periods.map((p) => (
                <DropdownItem
                  key={p.value}
                  onClick={() => handleCustomerPeriodChange(p.value)}
                  className={customerPeriod === p.value ? "bg-gray-50 dark:bg-white/5" : ""}
                >
                  {p.label}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : customerStats?.totalCustomers.toLocaleString()}
            </h4>
          </div>
          {!loading && customerStats && (
            <div className="flex flex-col items-end gap-1">
              <Badge color={customerStats.isGrowthPositive ? "success" : "error"}>
                {customerStats.isGrowthPositive ? <ArrowUpIcon /> : <ArrowDownIcon className="text-error-500" />}
                {Math.abs(customerStats.growthPercentage)}%
              </Badge>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                vs last {customerPeriod.replace('ly', '')}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* <!-- Customer Metric Item End --> */}

      {/* <!-- Order Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 dark:text-white/90" />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsOrderDropdownOpen(!isOrderDropdownOpen)}
              className="dropdown-toggle flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {periods.find((p) => p.value === orderPeriod)?.label}
              <MoreDotIcon className="size-5" />
            </button>
            <Dropdown
              isOpen={isOrderDropdownOpen}
              onClose={() => setIsOrderDropdownOpen(false)}
              className="w-32"
            >
              {periods.map((p) => (
                <DropdownItem
                  key={p.value}
                  onClick={() => handleOrderPeriodChange(p.value)}
                  className={orderPeriod === p.value ? "bg-gray-50 dark:bg-white/5" : ""}
                >
                  {p.label}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : orderStats?.totalOrders.toLocaleString()}
            </h4>
          </div>

          {!loading && orderStats && (
            <div className="flex flex-col items-end gap-1">
              <Badge color={orderStats.isGrowthPositive ? "success" : "error"}>
                {orderStats.isGrowthPositive ? <ArrowUpIcon /> : <ArrowDownIcon className="text-error-500" />}
                {Math.abs(orderStats.growthPercentage)}%
              </Badge>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                vs last {orderPeriod.replace('ly', '')}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* <!-- Order Metric Item End --> */}
    </div>
  );
};
