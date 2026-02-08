"use client";

import React, { useState, useEffect, Suspense } from 'react';
import FilterBar from '@/components/user/shop-page/FilterBar';
import ShopProductCard, { ShopProduct } from '@/components/user/shop-page/ShopProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { userProductService } from '@/services/user/userProductApiService';
import { useSearchParams, useRouter } from 'next/navigation';

const ShopContent = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [products, setProducts] = useState<ShopProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const searchParams = useSearchParams();
    const router = useRouter();

    // Fetch Products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const page = parseInt(searchParams.get('page') || '1');
            const category = searchParams.get('category') || undefined;
            // You can add more filters here like minPrice, maxPrice, sort, etc., when FilterBar supports them via URL

            setCurrentPage(page);

            const data = await userProductService.getProducts({ page, limit: 12, category });

            if (data.success) {
                // Map API response to ShopProduct interface if needed, or ensure backend matches
                // Backend returns: _id, name, price, images, etc.
                // ShopProduct expects: id, name, price, image, etc.
                const mappedProducts = data.products.map((p: any) => ({
                    id: p._id,
                    slug: p.slug,
                    name: p.name,
                    brand: p.brand || 'Sking Cosmetics', // Default brand if missing
                    price: p.finalPrice || p.price, // Use effective price
                    originalPrice: p.price !== p.finalPrice ? p.price : undefined,
                    rating: 5.0, // Mock rating or fetch if available
                    reviewCount: 0, // Mock count or fetch if available
                    image: p.images?.[0] || '',
                    offerPercentage: p.offerPercentage || 0
                }));

                setProducts(mappedProducts);
                setTotalResults(data.total);
                setTotalPages(data.pages);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 pb-20 pt-10">
            {/* Filter Bar */}
            <FilterBar
                totalResults={totalResults}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            {/* Product Grid */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Skeletons */}
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-100 aspect-[3/4] rounded-sm mb-4"></div>
                            <div className="h-4 bg-gray-100 w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-100 w-1/4"></div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    No products found.
                </div>
            ) : (
                <div className={`grid gap-x-3 gap-y-6 md:gap-x-6 md:gap-y-10 ${viewMode === 'grid'
                    ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1 md:grid-cols-2'
                    }`}>
                    {products.map((product) => (
                        <div key={product.id}>
                            <ShopProductCard product={product} viewMode={viewMode} />
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-sking-pink hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === page
                                        ? 'bg-sking-pink text-white shadow-md'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="flex h-10 w-10 items-center justify-center text-gray-400">...</span>;
                        }
                        return null;
                    })}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-sking-pink hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

const ShopPage = () => {
    return (
        <Suspense fallback={
            <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 pb-20 pt-10">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-100 aspect-[3/4] rounded-sm mb-4"></div>
                            <div className="h-4 bg-gray-100 w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-100 w-1/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
};

export default ShopPage;

