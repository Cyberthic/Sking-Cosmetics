"use client";

import React, { useState } from 'react';
import FilterBar from '@/components/user/shop-page/FilterBar';
import ShopProductCard, { ShopProduct } from '@/components/user/shop-page/ShopProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Mock Data matching the reference images
const MOCK_PRODUCTS: ShopProduct[] = [
    {
        id: '1',
        brand: 'GLOWIFY BEAUTY',
        name: 'Rosewater Hydrating Mist',
        price: 19.99,
        rating: 4.5,
        reviewCount: 143,
        image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=2572&auto=format&fit=crop',
    },
    {
        id: '2',
        brand: 'LUXE LASHES',
        name: 'Silk Lash Extensions',
        price: 24.99,
        rating: 4.0,
        reviewCount: 215,
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2535&auto=format&fit=crop',
    },
    {
        id: '3',
        brand: 'PURE GLOW',
        name: 'Charcoal Detoxifying Mask',
        price: 14.99,
        originalPrice: 18.99,
        rating: 5.0,
        reviewCount: 251,
        image: 'https://images.unsplash.com/photo-1596704017382-30575d32dc8b?q=80&w=2592&auto=format&fit=crop',
    },
    {
        id: '4',
        brand: 'RADIANT SKINCARE',
        name: 'Vitamin C Serum',
        price: 29.99,
        rating: 4.5,
        reviewCount: 371,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2574&auto=format&fit=crop',
    },
    {
        id: '5',
        brand: 'HAIR LUX',
        name: 'Argan Oil Hair Serum',
        price: 12.99,
        originalPrice: 13.99,
        rating: 4.0,
        reviewCount: 281,
        image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2680&auto=format&fit=crop',
    },
    {
        id: '6',
        brand: 'LUMINA BEAUTY',
        name: 'Dewy Finish Foundation',
        price: 39.99,
        rating: 4.5,
        reviewCount: 187,
        image: 'https://images.unsplash.com/photo-1580870055505-6a17277685a7?q=80&w=2572&auto=format&fit=crop',
    },
    {
        id: '7',
        brand: 'ARTISTRY',
        name: 'Pro-Blend Makeup',
        price: 29.99,
        rating: 4.8,
        reviewCount: 211,
        image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=2670&auto=format&fit=crop',
    },
    {
        id: '8',
        brand: 'PUREGLOW NATURALS',
        name: 'Organic Facial Cleanser',
        price: 19.99,
        rating: 4.3,
        reviewCount: 293,
        image: 'https://images.unsplash.com/photo-1556228720-1957be83f364?q=80&w=2535&auto=format&fit=crop',
    },
    {
        id: '9',
        brand: 'SILK & SHINE',
        name: 'Nourishing Hair Mask',
        price: 24.99,
        rating: 4.7,
        reviewCount: 221,
        image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=2670&auto=format&fit=crop',
    },
    {
        id: '10',
        brand: 'CHROMA COSMETICS',
        name: 'Bold Matte Lipstick',
        price: 14.99,
        originalPrice: 15.25,
        rating: 4.6,
        reviewCount: 285,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=2630&auto=format&fit=crop',
    },
    {
        id: '11',
        brand: 'GLOWIFY BEAUTY',
        name: 'Enchanted Perfume',
        price: 39.99,
        rating: 4.8,
        reviewCount: 96,
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2604&auto=format&fit=crop',
    },
    {
        id: '12',
        brand: 'URBAN VIBE',
        name: 'Matte Clay Paste',
        price: 18.99,
        rating: 4.2,
        reviewCount: 150,
        image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=2574&auto=format&fit=crop',
    }
];

const ShopPage = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <div className="min-h-screen bg-white pb-20 pt-10">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                {/* Page Title (Optional, not in quick view) */}
                {/* <h1 className="text-3xl font-bold mb-8">Shop</h1> */}

                {/* Filter Bar */}
                <FilterBar
                    totalResults={98}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />

                {/* Product Grid */}
                <div className={`grid gap-x-3 gap-y-6 md:gap-x-6 md:gap-y-10 ${viewMode === 'grid'
                    ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                    }`}>
                    {MOCK_PRODUCTS.map((product) => (
                        <div key={product.id} className={viewMode === 'list' ? 'flex gap-6' : ''}>
                            <ShopProductCard product={product} />
                        </div>
                    ))}
                    {/* Repeat mock data to fill page if needed */}
                    {MOCK_PRODUCTS.slice(0, 4).map((product) => (
                        <div key={`dup-${product.id}`} className={viewMode === 'list' ? 'flex gap-6' : ''}>
                            <ShopProductCard product={{ ...product, id: `dup-${product.id}` }} />
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-16 flex items-center justify-center gap-2">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full text-sking-pink hover:bg-gray-50 transition-colors">
                        <ChevronLeft size={20} />
                    </button>

                    <button className="flex h-10 w-10 items-center justify-center rounded-md bg-sking-pink text-white text-sm font-medium shadow-md">
                        1
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:bg-gray-50 hover:text-black transition-colors text-sm font-medium">
                        2
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:bg-gray-50 hover:text-black transition-colors text-sm font-medium">
                        3
                    </button>
                    <span className="flex h-10 w-10 items-center justify-center text-gray-400">...</span>
                    <button className="flex h-10 w-10 items-center justify-center rounded-md text-gray-500 hover:bg-gray-50 hover:text-black transition-colors text-sm font-medium">
                        8
                    </button>

                    <button className="flex h-10 w-10 items-center justify-center rounded-full text-sking-pink hover:bg-gray-50 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ShopPage;
