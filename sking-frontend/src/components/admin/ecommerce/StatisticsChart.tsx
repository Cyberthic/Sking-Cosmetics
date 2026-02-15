"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import ChartTab from "../common/ChartTab";
import { CalenderIcon } from "@/icons/index";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchPerformanceChart, setPerformanceRange } from "@/redux/features/adminDashboardSlice";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function StatisticsChart() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: stats, loading, startDate, endDate, period } = useSelector((state: RootState) => state.adminDashboard.performanceChart);
  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const range = startDate && endDate ? { startDate, endDate } : undefined;
    dispatch(fetchPerformanceChart(range));
  }, [dispatch, startDate, endDate]);

  const handlePeriodChange = (selectedPeriod: "Monthly" | "Quarterly" | "Annually") => {
    const now = new Date();
    let start = new Date();
    const end = new Date(now);

    if (selectedPeriod === "Monthly") {
      start = new Date(now.getFullYear(), 0, 1);
    } else if (selectedPeriod === "Quarterly") {
      // Last 4 quarters
      start = new Date(now.getFullYear(), now.getMonth() - 9, 1);
    } else if (selectedPeriod === "Annually") {
      // Last 3 years
      start = new Date(now.getFullYear() - 2, 0, 1);
    }

    dispatch(setPerformanceRange({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      period: selectedPeriod
    }));
  };

  useEffect(() => {
    if (!datePickerRef.current) return;

    // Default dates for initialization if state is empty, or use state
    const today = new Date();
    const defaultStart = new Date();
    defaultStart.setDate(today.getDate() - 30);

    const initialStart = startDate ? new Date(startDate) : defaultStart;
    const initialEnd = endDate ? new Date(endDate) : today;

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate: [initialStart, initialEnd],
      clickOpens: true,
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          // Use 'Monthly' as default period placeholder if custom range selected, 
          // or we could add a 'Custom' type to the slice. Keeping it simple for now.
          dispatch(setPerformanceRange({
            startDate: selectedDates[0].toISOString(),
            endDate: selectedDates[1].toISOString(),
            period: period // Keep current period highlight or maybe clear it?
          }));
        }
      },
      prevArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 15L7.5 10L12.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    });

    return () => {
      fp.destroy();
    };
  }, [dispatch]); // Only run once on mount to setup flatpickr, or we re-init if we want to sync perfectly bi-directionally.
  // Ideally flatpickr should be updated if startDate/endDate changes externally, but for now this is fine.

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      x: {
        show: true
      },
      y: {
        formatter: (val: number) => `${val} Orders`,
      },
    },
    xaxis: {
      type: "category",
      categories: stats?.customerPerformance.map(p => p.month) || [],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Acquisition (New)",
      data: stats?.customerPerformance.map(p => p.acquisition) || [],
    },
    {
      name: "Retention (Returning)",
      data: stats?.customerPerformance.map(p => p.retention) || [],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Customer Performance
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Acquisition (New Orders) vs Retention (Repeat Orders)
          </p>
        </div>
        <div className="flex items-center gap-3 sm:justify-end">
          <ChartTab onSelect={handlePeriodChange} defaultSelected={period} />
          <div className="relative inline-flex items-center">
            <CalenderIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-3 lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2  text-gray-500 dark:text-gray-400 pointer-events-none z-10" />
            <input
              ref={datePickerRef}
              className="h-10 w-10 lg:w-40 lg:h-auto  lg:pl-10 lg:pr-3 lg:py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-transparent lg:text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:lg:text-gray-300 cursor-pointer"
              placeholder="Select date range"
            />
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          {loading ? (
            <div className="flex h-[310px] items-center justify-center">
              <p className="text-gray-500">Loading statistics...</p>
            </div>
          ) : (
            <Chart options={options} series={series} type="area" height={310} />
          )}
        </div>
      </div>
    </div>
  );
}