"use client";
import React, { useState, useRef, useEffect, forwardRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Tooltip from "../ui/tooltip/Tooltip";

interface Option {
    value: string;
    label: string;
}

interface FormSelectProps {
    label?: string;
    options: Option[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
    tooltip?: string;
}

const FormSelect = forwardRef<HTMLDivElement, FormSelectProps>(({
    label,
    options,
    value,
    onChange,
    placeholder = "Select an option",
    error,
    className = "",
    disabled = false,
    tooltip,
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val: string) => {
        if (disabled) return;
        onChange?.(val);
        setIsOpen(false);
    };

    return (
        <div className={`relative w-full ${className}`} ref={containerRef}>
            {label && (
                <label className="flex items-center text-xs font-black uppercase text-gray-900 dark:text-gray-100 mb-2 tracking-widest">
                    {label}
                    {tooltip && <Tooltip content={tooltip} />}
                </label>
            )}

            <div
                ref={ref}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
          flex items-center justify-between h-12 w-full rounded-2xl border px-4 py-2.5 text-sm cursor-pointer transition-all duration-300
          ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300 dark:bg-gray-800 dark:border-gray-700" :
                        error ? "border-red-500 text-red-900 focus:ring-red-500/10 dark:text-red-400" :
                            "bg-gray-50 dark:bg-black/50 text-gray-800 dark:text-white/90 border-transparent focus:border-brand-500 dark:focus:border-brand-800"}
          ${isOpen ? "ring-2 ring-sking-pink/20 border-sking-pink shadow-lg shadow-sking-pink/5" : "hover:border-sking-pink/30"}
        `}
            >
                <span className={`font-bold uppercase tracking-wide ${!selectedOption ? "text-gray-400" : ""}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-sking-pink" : ""}`}
                />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-50 w-full mt-2 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/20 max-h-60 overflow-hidden flex flex-col"
                    >
                        <div className="overflow-y-auto p-2 space-y-1">
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`
                    flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all
                    ${value === option.value ? "bg-sking-pink text-white shadow-lg shadow-sking-pink/20" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"}
                  `}
                                >
                                    <span>{option.label}</span>
                                    {value === option.value && <Check className="w-4 h-4" />}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <p className="mt-1.5 text-xs text-red-500 font-bold uppercase tracking-wider">{error}</p>
            )}
        </div>
    );
});

FormSelect.displayName = "FormSelect";

export default FormSelect;
