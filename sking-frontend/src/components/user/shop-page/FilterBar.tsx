import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, LayoutGrid, List } from 'lucide-react';

interface FilterBarProps {
    totalResults: number;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ totalResults, viewMode, setViewMode }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filters = [
        { name: "Category", options: ["Skincare", "Makeup", "Haircare", "Body", "Fragrance"] },
        { name: "Price Range", options: ["Under $25", "$25 - $50", "$50 - $100", "$100+"] },
        { name: "Review", options: ["4 Stars & Up", "3 Stars & Up", "2 Stars & Up", "1 Star & Up"] }
    ];

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6 mb-6 relative z-40" ref={dropdownRef}>
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-500 mr-2">Sort by</span>

                {filters.map((filter) => (
                    <div key={filter.name} className="relative">
                        <button
                            onClick={() => toggleDropdown(filter.name)}
                            className={`flex items-center gap-2 border px-4 py-2 text-sm font-medium transition-colors rounded-sm ${openDropdown === filter.name
                                    ? 'border-sking-pink text-sking-pink bg-pink-50/10'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {filter.name}
                            <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === filter.name ? 'rotate-180' : ''}`} />
                        </button>

                        {openDropdown === filter.name && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-lg z-50 p-2 animate-in fade-in zoom-in-95 duration-200">
                                <div className="flex flex-col">
                                    {filter.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            className="text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-sking-pink rounded-md transition-colors"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between gap-6 md:justify-end">
                <p className="text-sm text-gray-500">
                    Showing 1 - 16 of {totalResults} results
                </p>

                <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 transition-colors ${viewMode === 'grid' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 transition-colors ${viewMode === 'list' ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
