"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronLeft, ArrowLeft, Filter } from "lucide-react";
import { userReviewApiService } from "@/services/user/userReviewApiService";
import { userProductService } from "@/services/user/userProductApiService";
import { toast } from "sonner";

export default function AllReviewsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [reviewsData, setReviewsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("newest");
    const limit = 10;

    useEffect(() => {
        if (id) {
            fetchProduct();
            fetchReviews();
        }
    }, [id, page, sort]);

    const fetchProduct = async () => {
        try {
            const res = await userProductService.getProductById(id as string);
            if (res.success) setProduct(res.product);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await userReviewApiService.getProductReviews(id as string, page, limit, sort);
            if (res.success) {
                setReviewsData(res.data);
            }
        } catch (err) {
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    if (!product && loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center hover:border-black transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-black">Customer Reviews</h1>
                    <p className="text-sm text-gray-500 uppercase font-bold tracking-widest">{product?.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Summary */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                    <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
                        <div className="text-6xl font-black text-black mb-2">
                            {reviewsData?.averageRating || 0}<span className="text-2xl text-gray-400 font-medium ml-1">/5</span>
                        </div>
                        <div className="flex text-sking-pink mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={24}
                                    fill={i < Math.round(reviewsData?.averageRating || 0) ? "currentColor" : "none"}
                                    className={i < Math.round(reviewsData?.averageRating || 0) ? "" : "text-gray-200"}
                                />
                            ))}
                        </div>
                        <p className="text-gray-500 font-bold mb-8 uppercase tracking-widest text-xs">Based on {reviewsData?.totalReviews || 0} Reviews</p>

                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = reviewsData?.ratingBreakdown[star] || 0;
                                const percentage = reviewsData?.totalReviews ? (count / reviewsData.totalReviews) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-4 text-xs font-bold text-gray-500">
                                        <div className="flex items-center gap-1 w-8">
                                            <span>{star}</span>
                                            <Star size={12} fill="currentColor" className="text-gray-400" />
                                        </div>
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-sking-pink rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="w-8 text-right font-black text-black">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right: Reviews List */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Controls */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                        <h2 className="text-lg font-bold text-black uppercase tracking-tight">Reviews ({reviewsData?.totalReviews || 0})</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sort by:</span>
                            <select
                                value={sort}
                                onChange={(e) => {
                                    setSort(e.target.value);
                                    setPage(1);
                                }}
                                className="text-xs font-black uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer text-sking-pink"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="rating_high">Highest Rating</option>
                                <option value="rating_low">Lowest Rating</option>
                            </select>
                        </div>
                    </div>

                    {/* List */}
                    {loading && page === 1 ? (
                        <div className="space-y-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse flex gap-6">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full" />
                                    <div className="flex-1 space-y-4">
                                        <div className="h-4 bg-gray-100 w-1/4 rounded" />
                                        <div className="h-20 bg-gray-100 w-full rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : reviewsData?.reviews.length > 0 ? (
                        <div className="space-y-10">
                            {reviewsData.reviews.map((review: any) => (
                                <div key={review.id} className="flex gap-6 group">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 overflow-hidden flex-shrink-0 relative">
                                        {review.user.profileImage ? (
                                            <Image src={review.user.profileImage} alt={review.user.name} fill className="object-cover" />
                                        ) : (
                                            <span className="font-bold text-sm">{review.user.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h4 className="font-bold text-black flex items-center gap-2">
                                                    {review.user.name}
                                                    {review.isVerified && (
                                                        <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[8px] font-black uppercase tracking-tighter rounded-full border border-green-100">Verified Buyer</span>
                                                    )}
                                                </h4>
                                                <div className="flex text-sking-pink mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={12}
                                                            fill={i < review.rating ? "currentColor" : "none"}
                                                            className={i < review.rating ? "" : "text-gray-200"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed text-sm mb-4">{review.comment}</p>

                                        {review.images && review.images.length > 0 && (
                                            <div className="flex gap-3 mt-4">
                                                {review.images.map((img: string, idx: number) => (
                                                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100">
                                                        <Image src={img} alt="Review" fill className="object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Pagination */}
                            {reviewsData.totalPages > 1 && (
                                <div className="flex justify-center gap-2 pt-8">
                                    {[...Array(reviewsData.totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setPage(i + 1)}
                                            className={`w-10 h-10 rounded-xl font-bold transition-all ${page === i + 1 ? "bg-black text-white" : "bg-white border border-gray-100 text-gray-500 hover:border-black"}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-gray-100 border-dashed">
                            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest">No reviews yet</h3>
                            <p className="text-xs text-gray-500 font-medium">Be the first to share your experience!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
