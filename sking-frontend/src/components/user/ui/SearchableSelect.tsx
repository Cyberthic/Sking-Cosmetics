"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, X, Check } from 'lucide-react';

interface Option {
    label: string;
    value: string;
    subLabel?: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    label?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
    dropdownAlign?: 'left' | 'right';
    dropdownWidth?: string;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder,
    label,
    error,
    className,
    disabled,
    dropdownAlign = 'left',
    dropdownWidth = 'w-full'
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.subLabel?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative flex flex-col gap-1 ${className}`} ref={containerRef}>
            {label && <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>}

            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full flex items-center justify-between px-2.5 py-3 bg-gray-50 border rounded-lg transition-all font-medium text-sm ${isOpen ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-black'
                    } ${error ? 'border-red-500' : ''} ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
            >
                <span className={`truncate ${selectedOption ? 'text-black' : 'text-gray-400'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute z-[1200] top-full ${dropdownAlign === 'left' ? 'left-0' : 'right-0'} ${dropdownWidth} mt-2 bg-white border border-gray-100 shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[300px]`}
                    >
                        <div className="p-3 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black"
                                    onClick={(e) => e.stopPropagation()}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                        <X className="w-3 h-3 text-gray-400" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="overflow-y-auto py-2">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <button
                                        key={`${option.value}-${option.subLabel || option.label}`}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                            setSearchQuery('');
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${value === option.value ? 'bg-black text-white' : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-bold">{option.label}</span>
                                            {option.subLabel && (
                                                <span className={`text-[10px] uppercase tracking-wider ${value === option.value ? 'text-gray-300' : 'text-gray-400'
                                                    }`}>
                                                    {option.subLabel}
                                                </span>
                                            )}
                                        </div>
                                        {value === option.value && <Check className="w-4 h-4" />}
                                    </button>
                                ))
                            ) : (
                                <div className="px-4 py-8 text-center text-gray-400 text-sm">
                                    No results found
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    );
}
