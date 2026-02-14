"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon, MoreDotIcon } from "@/icons";
import { adminDashboardApiService, DashboardStats, DashboardPeriod } from "@/services/admin/adminDashboardApiService";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export const EcommerceMetrics = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Periods
  const [customerPeriod, setCustomerPeriod] = useState<DashboardPeriod>("weekly");
  const [orderPeriod, setOrderPeriod] = useState<DashboardPeriod>("weekly");

  // Dropdown states
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await adminDashboardApiService.getDashboardStats(customerPeriod, orderPeriod);
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [customerPeriod, orderPeriod]);

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
                  onClick={() => {
                    setCustomerPeriod(p.value);
                    setIsCustomerDropdownOpen(false);
                  }}
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
              {loading ? "..." : stats?.customerStats.totalCustomers.toLocaleString()}
            </h4>
          </div>
          {!loading && stats && (
            <div className="flex flex-col items-end gap-1">
              <Badge color={stats.customerStats.isGrowthPositive ? "success" : "error"}>
                {stats.customerStats.isGrowthPositive ? <ArrowUpIcon /> : <ArrowDownIcon className="text-error-500" />}
                {Math.abs(stats.customerStats.growthPercentage)}%
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
                  onClick={() => {
                    setOrderPeriod(p.value);
                    setIsOrderDropdownOpen(false);
                  }}
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
              {loading ? "..." : stats?.orderStats.totalOrders.toLocaleString()}
            </h4>
          </div>

          {!loading && stats && (
            <div className="flex flex-col items-end gap-1">
              <Badge color={stats.orderStats.isGrowthPositive ? "success" : "error"}>
                {stats.orderStats.isGrowthPositive ? <ArrowUpIcon /> : <ArrowDownIcon className="text-error-500" />}
                {Math.abs(stats.orderStats.growthPercentage)}%
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
