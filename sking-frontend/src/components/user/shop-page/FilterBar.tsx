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

    // Filter States
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

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

    // Mock Categories (In a real app, these should be passed as props or fetched)
    const categoryOptions = ["Skincare", "Makeup", "Haircare", "Fragrance", "Makeup Tools", "Bath & Body", "Oral Care"];

    const handleCategoryChange = (category: string) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleRatingChange = (rating: number) => {
        if (selectedRatings.includes(rating)) {
            setSelectedRatings(selectedRatings.filter(r => r !== rating));
        } else {
            setSelectedRatings([...selectedRatings, rating]);
        }
    };

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6 mb-6 relative z-40" ref={dropdownRef}>
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-500 mr-2">Sort by</span>

                {/* CATEGORY DROPDOWN */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown("Category")}
                        className={`flex items-center gap-2 border px-4 py-2 text-sm font-medium transition-colors rounded-md ${openDropdown === "Category" ? 'border-sking-pink text-sking-pink bg-pink-50/10' : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'}`}
                    >
                        Category <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === "Category" ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === "Category" && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 shadow-sm z-50 p-3 animate-in fade-in duration-200">
                            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                                {categoryOptions.map((option) => (
                                    <label key={option} className="flex items-center gap-3 px-1 py-1 cursor-pointer group">
                                        <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedCategories.includes(option) ? 'bg-white border-sking-pink' : 'bg-white border-gray-400 group-hover:border-sking-pink'}`}>
                                            {selectedCategories.includes(option) && <div className="w-2 h-2 bg-sking-pink"></div>}
                                        </div>
                                        <span className={`text-sm ${selectedCategories.includes(option) ? 'text-black' : 'text-gray-700'}`}>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* PRICE RANGE DROPDOWN */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown("Price Range")}
                        className={`flex items-center gap-2 border px-4 py-2 text-sm font-medium transition-colors rounded-md ${openDropdown === "Price Range" ? 'border-sking-pink text-sking-pink bg-pink-50/10' : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'}`}
                    >
                        Price Range <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === "Price Range" ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === "Price Range" && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 shadow-sm z-50 p-5 animate-in fade-in duration-200">
                            <form onSubmit={(e) => { e.preventDefault(); toggleDropdown("Price Range"); }} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-sm text-gray-700">Min Price</span>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={priceRange.min ? `₹${priceRange.min}` : ''}
                                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value.replace('₹', '') })}
                                                className="w-full border border-gray-300 rounded px-2 py-3 text-sm focus:outline-none bg-white text-gray-700 shadow-sm"
                                                placeholder="₹0"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-sm text-gray-700">Max Price</span>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={priceRange.max ? `₹${priceRange.max}` : ''}
                                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value.replace('₹', '') })}
                                                className="w-full border border-gray-300 rounded px-2 py-3 text-sm focus:outline-none bg-white text-gray-700 shadow-sm"
                                                placeholder="₹1000"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-sking-pink text-white font-bold uppercase text-sm py-3 rounded-md hover:brightness-110 transition-all shadow-sm">
                                    Apply
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* REVIEW DROPDOWN */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown("Review")}
                        className={`flex items-center gap-2 border px-4 py-2 text-sm font-medium transition-colors rounded-md ${openDropdown === "Review" ? 'border-sking-pink text-sking-pink bg-pink-50/10' : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'}`}
                    >
                        Review <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === "Review" ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === "Review" && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 shadow-sm z-50 p-3 animate-in fade-in duration-200">
                            <div className="flex flex-col gap-3">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <label key={rating} className="flex items-center gap-3 px-1 py-1 cursor-pointer group">
                                        <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedRatings.includes(rating) ? 'bg-white border-sking-pink' : 'bg-white border-gray-400 group-hover:border-sking-pink'}`}>
                                            {selectedRatings.includes(rating) && <div className="w-2 h-2 bg-sking-pink"></div>}
                                        </div>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-4 h-4 ${i < rating ? 'fill-sking-pink text-sking-pink' : 'fill-gray-300 text-gray-300'}`} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                            ))}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
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
