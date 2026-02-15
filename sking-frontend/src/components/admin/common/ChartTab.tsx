import React, { useState } from "react";

interface ChartTabProps {
  onSelect?: (option: "Monthly" | "Quarterly" | "Annually") => void;
  defaultSelected?: "Monthly" | "Quarterly" | "Annually";
}

const ChartTab: React.FC<ChartTabProps> = ({ onSelect, defaultSelected = "Monthly" }) => {
  const [selected, setSelected] = useState<"Monthly" | "Quarterly" | "Annually">(defaultSelected);

  const handleSelect = (option: "Monthly" | "Quarterly" | "Annually") => {
    setSelected(option);
    if (onSelect) {
      onSelect(option);
    }
  };

  const getButtonClass = (option: "Monthly" | "Quarterly" | "Annually") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => handleSelect("Monthly")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "Monthly"
        )}`}
      >
        Monthly
      </button>

      <button
        onClick={() => handleSelect("Quarterly")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "Quarterly"
        )}`}
      >
        Quarterly
      </button>

      <button
        onClick={() => handleSelect("Annually")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "Annually"
        )}`}
      >
        Annually
      </button>
    </div>
  );
};

export default ChartTab;
