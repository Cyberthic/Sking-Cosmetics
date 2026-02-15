"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, LayoutGrid, List } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { userCategoryService } from "@/services/user/userCategoryApiService";

interface FilterBarProps {
    totalResults: number;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

const sortOptions = [
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Most Popular', value: 'popularity' },
    { label: 'Top Rated', value: 'rating' },
];

const FilterBar: React.FC<FilterBarProps> = ({ totalResults, viewMode, setViewMode }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    // Derived State from URL
    const selectedCategory = searchParams.get('category') || '';
    const currentSort = searchParams.get('sort') || 'newest';
    const currentRating = searchParams.get('rating') || '';
    const minP = searchParams.get('minPrice') || '';
    const maxP = searchParams.get('maxPrice') || '';

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await userCategoryService.getCategories();
                if (data.success) {
                    setCategories(data.categories);
                }
            } catch (error) {
                console.error("Failed to fetch categories");
            }
        };
        fetchCategories();
    }, []);

    const updateUrl = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        // Reset page on filter change
        params.delete('page');
        router.push(`/shop?${params.toString()}`);
    };

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6 mb-6 relative z-40" ref={dropdownRef}>
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-500 mr-2">Filters</span>

                {/* CATEGORY DROPDOWN */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown("Category")}
                        className={`flex items-center gap-2 border px-4 py-2 text-sm font-medium transition-colors rounded-md ${selectedCategory ? 'border-sking-pink text-sking-pink bg-pink-50/10' : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'}`}
                    >
                        {categories.find(c => c._id === selectedCategory)?.name || 'All Categories'} <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === "Category" ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === "Category" && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 shadow-xl z-50 p-3 animate-in fade-in duration-200 rounded-xl overflow-hidden">
                            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto custom-scrollbar">
                                <button
                                    onClick={() => { updateUrl({ category: null }); setOpenDropdown(null); }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${!selectedCategory ? 'bg-sking-pink/10 text-sking-pink font-extrabold' : 'hover:bg-gray-50 text-gray-700'}`}
                                >
                                    All Products
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => { updateUrl({ category: cat._id }); setOpenDropdown(null); }}
                                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${selectedCategory === cat._id ? 'bg-sking-pink/10 text-sking-pink font-extrabold' : 'hover:bg-gray-50 text-gray-700'}`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* PRICE RANGE DROPDOWN */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown("Price Range")}
                        className={`flex items-center gap-2 border px-4 py-2 text-sm font-medium transition-colors rounded-md ${(minP || maxP) ? 'border-sking-pink text-sking-pink bg-pink-50/10' : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'}`}
                    >
                        Price Range <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === "Price Range" ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === "Price Range" && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 shadow-xl z-50 p-5 animate-in fade-in duration-200 rounded-xl">
                            <form onSubmit={(e: any) => {
                                e.preventDefault();
                                const min = e.target.minPrice.value.replace('₹', '');
                                const max = e.target.maxPrice.value.replace('₹', '');
                                updateUrl({ minPrice: min, maxPrice: max });
                                setOpenDropdown(null);
                            }} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Min</span>
                                        <input
                                            name="minPrice"
                                            type="text"
                                            defaultValue={minP}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-sking-pink outline-none bg-gray-50 font-bold"
                                            placeholder="₹0"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Max</span>
                                        <input
                                            name="maxPrice"
                                            type="text"
                                            defaultValue={maxP}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-sking-pink outline-none bg-gray-50 font-bold"
                                            placeholder="₹5000"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-black text-white font-black uppercase text-[10px] tracking-widest py-3 rounded-lg hover:bg-sking-pink transition-all shadow-lg active:scale-95">
                                    Apply Filter
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* REVIEW DROPDOWN */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown("Review")}
                        className={`flex items-center gap-2 border px-4 py-2 text-sm font-medium transition-colors rounded-md ${currentRating ? 'border-sking-pink text-sking-pink bg-pink-50/10' : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'}`}
                    >
                        Review {currentRating ? `(${currentRating}+)` : ''} <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === "Review" ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === "Review" && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl z-50 p-2 animate-in fade-in duration-200 rounded-xl">
                            <div className="flex flex-col">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => { updateUrl({ rating: rating.toString() }); setOpenDropdown(null); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors flex items-center gap-3 ${currentRating === rating.toString() ? 'bg-black text-white font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                                    >
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-current text-sking-pink' : 'fill-gray-200 text-gray-200'}`} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                            ))}
                                        </div>
                                        <span className="text-xs">{rating}+</span>
                                    </button>
                                ))}
                                <button
                                    onClick={() => { updateUrl({ rating: null }); setOpenDropdown(null); }}
                                    className="w-full text-center py-2 text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors border-t border-gray-50 mt-1"
                                >
                                    Clear Rating
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* SORT DROPDOWN */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown("Sort")}
                        className={`flex items-center gap-2 border px-4 py-2 text-sm font-medium transition-colors rounded-md ${currentSort !== 'newest' ? 'border-sking-pink text-sking-pink bg-pink-50/10' : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'}`}
                    >
                        {sortOptions.find(o => o.value === currentSort)?.label || 'Sort By'} <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === "Sort" ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === "Sort" && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 shadow-xl z-50 p-2 animate-in fade-in duration-200 rounded-xl">
                            <div className="flex flex-col">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => { updateUrl({ sort: option.value }); setOpenDropdown(null); }}
                                        className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors ${currentSort === option.value ? 'bg-black text-white font-bold' : 'hover:bg-gray-50 text-gray-700'}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Clear All */}
                {(selectedCategory || minP || maxP || currentRating || currentSort !== 'newest') && (
                    <button
                        onClick={() => router.push('/shop')}
                        className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-sking-red transition-colors ml-2 underline underline-offset-4"
                    >
                        Reset All
                    </button>
                )}
            </div>

            <div className="flex items-center justify-between gap-6 md:justify-end">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {totalResults} Products found
                </p>

                <div className="flex items-center gap-1 border-l border-gray-200 pl-4">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 transition-colors ${viewMode === 'grid' ? 'text-sking-pink' : 'text-gray-300 hover:text-black'}`}
                    >
                        <LayoutGrid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 transition-colors ${viewMode === 'list' ? 'text-sking-pink' : 'text-gray-300 hover:text-black'}`}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
