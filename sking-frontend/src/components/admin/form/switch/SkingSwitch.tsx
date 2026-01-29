"use client";
import React from "react";

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

const SkingSwitch: React.FC<SwitchProps> = ({
    checked,
    onChange,
    disabled = false,
}) => {
    return (
        <div
            onClick={() => !disabled && onChange(!checked)}
            className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sking-pink/20 focus:ring-offset-2
        ${checked ? "bg-sking-pink" : "bg-gray-200 dark:bg-white/10"}
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
      `}
        >
            <span
                className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
          ${checked ? "translate-x-5" : "translate-x-0"}
        `}
            />
        </div>
    );
};

export default SkingSwitch;
