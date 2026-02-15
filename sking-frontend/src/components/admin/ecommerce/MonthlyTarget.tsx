"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import { adminDashboardApiService, MonthlyTarget as IMonthlyTarget } from "@/services/admin/adminDashboardApiService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchMonthlyTarget } from "@/redux/features/adminDashboardSlice";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTarget() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: targetData, loading } = useSelector((state: RootState) => state.adminDashboard.monthlyTarget);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTarget, setNewTarget] = useState<string>("");
  const [updating, setUpdating] = useState(false);

  // Initial fetch handled by DashboardInit

  // Sync local state with Redux state
  useEffect(() => {
    if (targetData) {
      setNewTarget(targetData.target.toString());
    }
  }, [targetData]);

  const handleUpdateTarget = async () => {
    if (!newTarget) return;
    setUpdating(true);
    try {
      await adminDashboardApiService.updateMonthlyTarget(Number(newTarget));
      dispatch(fetchMonthlyTarget());
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating target:", error);
    } finally {
      setUpdating(false);
    }
  };

  const series = [targetData?.progressPercentage || 0];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Monthly Target
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Target you’ve set for each month
            </p>
          </div>
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
            >
              Set Monthly Target
            </button>
          </div>
        </div>
        <div className="relative ">
          <div className="max-h-[330px]">
            {loading ? (
              <div className="flex h-[330px] items-center justify-center">
                <p className="text-gray-500">Loading target...</p>
              </div>
            ) : (
              <ReactApexChart
                options={options}
                series={series}
                type="radialBar"
                height={330}
              />
            )}
          </div>

          {!loading && targetData && (
            <span className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium ${targetData.growthFromLastMonth >= 0 ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500' : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'}`}>
              {targetData.growthFromLastMonth >= 0 ? '+' : ''}{targetData.growthFromLastMonth}%
            </span>
          )}
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          {targetData && targetData.todayRevenue > 0 ? (
            `You earn ₹${targetData.todayRevenue.toLocaleString()} today. Keep up your good work!`
          ) : (
            "Start making sales to reach your monthly target!"
          )}
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Target
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {loading ? "..." : formatCurrency(targetData?.target || 0)}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Revenue
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {loading ? "..." : formatCurrency(targetData?.revenue || 0)}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Today
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {loading ? "..." : formatCurrency(targetData?.todayRevenue || 0)}
          </p>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[400px] p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-bold text-gray-800 dark:text-white/90">Set Monthly Target</h4>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update your target revenue for the current month.</p>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Target Amount (₹)
            </label>
            <input
              type="number"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              placeholder="Enter target amount"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateTarget}
              disabled={updating}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {updating ? "Updating..." : "Update Target"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
