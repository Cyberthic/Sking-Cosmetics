import React from 'react';
import { ChevronDown, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
    totalResults: number;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ totalResults, viewMode, setViewMode }) => {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6 mb-6">
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-500 mr-2">Sort by</span>

                {/* Filter Dropdowns - These would ideally be Headless UI / Radix UI Popovers */}
                <div className="relative group">
                    <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors rounded-sm">
                        Category
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>
                    {/* Dropdown content would go here */}
                </div>

                <div className="relative group">
                    <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors rounded-sm">
                        Brands
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>
                </div>

                <div className="relative group">
                    <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors rounded-sm">
                        Price Range
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>
                </div>

                <div className="relative group">
                    <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors rounded-sm">
                        Review
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>
                </div>

                <div className="relative group">
                    <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors rounded-sm">
                        Skin Type
                        <ChevronDown size={14} className="text-gray-400" />
                    </button>
                </div>
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
