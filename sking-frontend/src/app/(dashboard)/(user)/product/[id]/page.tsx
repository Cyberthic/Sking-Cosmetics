"use client";
import React, { useEffect, useState, useRef, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { userProductService } from "@/services/user/userProductApiService";
import { userCouponApiService } from "@/services/user/userCouponApiService";
import ProductCard from "@/components/user/ProductCard";
import { userCartService } from "@/services/user/userCartApiService";
import { userWishlistService } from "@/services/user/userWishlistApiService";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { updateCartLocally, setDrawerOpen } from "@/redux/features/cartSlice";
import { toggleWishlist } from "@/redux/features/wishlistSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { Star, Heart, ChevronLeft, ChevronRight, Share2, MessageCircle, Copy, Check, Info, Ticket, ExternalLink, Loader2 } from "lucide-react";
import { userReviewApiService } from "@/services/user/userReviewApiService";
import { useSearchParams } from "next/navigation";

function ProductDetailContent() {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [related, setRelated] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [mainImage, setMainImage] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [zoomed, setZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [hasAddedToCart, setHasAddedToCart] = useState(false);

    // Reviews State
    const [reviewsData, setReviewsData] = useState<any>(null);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [canReview, setCanReview] = useState(false);
    const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const [orderIdParam, setOrderIdParam] = useState<string | null>(null);
    const [writeReviewParam, setWriteReviewParam] = useState<string | null>(null);

    // Inline Review States
    const [inlineRating, setInlineRating] = useState(0);
    const [inlineHover, setInlineHover] = useState(0);
    const [inlineComment, setInlineComment] = useState("");
    const [inlineSubmitting, setInlineSubmitting] = useState(false);

    useEffect(() => {
        setOrderIdParam(searchParams.get("orderId"));
        setWriteReviewParam(searchParams.get("writeReview"));
    }, [searchParams]);

    const handleInlineSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inlineRating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (inlineComment.trim().length < 10) {
            toast.error("Comment must be at least 10 characters long");
            return;
        }

        setInlineSubmitting(true);
        try {
            const res = await userReviewApiService.createReview({
                productId: (product as any)._id,
                orderId: activeOrderId || "",
                rating: inlineRating,
                comment: inlineComment
            });
            if (res.success) {
                toast.success("Review submitted successfully!");
                setInlineComment("");
                setInlineRating(0);
                fetchReviews(id as string);
                if (orderIdParam) checkUserCanReview(id as string, orderIdParam);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to submit review");
        } finally {
            setInlineSubmitting(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchData(id as string);
            fetchReviews(id as string);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            checkUserCanReview(id as string, orderIdParam || undefined);
        }
    }, [id, orderIdParam]);

    useEffect(() => {
        if (canReview && writeReviewParam === 'true') {
            const element = document.getElementById('reviews-form');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [canReview, writeReviewParam]);

    const fetchReviews = async (productId: string) => {
        setReviewsLoading(true);
        try {
            const res = await userReviewApiService.getProductReviews(productId, 1, 4, 'newest');
            if (res.success) setReviewsData(res.data);
        } catch (err) {
            console.error("Failed to fetch reviews", err);
        } finally {
            setReviewsLoading(false);
        }
    };

    const checkUserCanReview = async (productId: string, orderId?: string) => {
        try {
            const res = await userReviewApiService.checkCanReview(productId, orderId);
            if (res.success) {
                setCanReview(res.data.canReview);
                if (res.data.orderId) setActiveOrderId(res.data.orderId);
            }
        } catch (err) {
            console.error("Failed to check review eligibility", err);
        }
    };

    const fetchData = async (productId: string) => {
        setLoading(true);
        try {
            const [productRes, couponRes] = await Promise.all([
                userProductService.getProductById(productId),
                userCouponApiService.getMyCoupons()
            ]);

            if (productRes.success) {
                setProduct(productRes.product);
                setRelated(productRes.related || []);
                if (productRes.product.images?.length > 0) setMainImage(productRes.product.images[0]);
                if (productRes.product.variants?.length > 0) setSelectedVariant(productRes.product.variants[0]);
            }

            if (couponRes.success) {
                const allVouchers = couponRes.data.active || [];
                // Filter and Prioritize
                const filtered = allVouchers.filter((v: any) => {
                    if (v.couponType === 'specific_products') {
                        return v.specificProducts?.some((p: any) => p._id === productId || p === productId);
                    }
                    return true;
                });

                const sorted = filtered.sort((a: any, b: any) => {
                    const priority = { 'specific_products': 1, 'specific_users': 2, 'new_users': 3, 'registered_after': 4, 'all': 5 };
                    // @ts-ignore
                    return (priority[a.couponType] || 99) - (priority[b.couponType] || 99);
                });

                setVouchers(sorted);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success("Coupon code copied!");
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const dispatch = useDispatch<AppDispatch>();
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
    const isInWishlist = product ? wishlistItems.includes(product._id) : false;

    const handleBuyNow = async () => {
        if (hasAddedToCart) {
            router.push('/cart');
            return;
        }

        if (!product) return;
        try {
            const response = await userCartService.addToCart(product._id, selectedVariant?.size, quantity);
            if (response.success) {
                dispatch(updateCartLocally(response.cart));
                toast.success("Added to Cart");
                setHasAddedToCart(true);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to add to cart");
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;
        try {
            const response = await userCartService.addToCart(product._id, selectedVariant?.size, quantity);
            if (response.success) {
                dispatch(updateCartLocally(response.cart));
                dispatch(setDrawerOpen(true));
                toast.success("Added to Cart");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to add to cart");
        }
    };

    const handleAddToWishlist = async () => {
        if (!product) return;
        try {
            await dispatch(toggleWishlist(product._id)).unwrap();
            toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
        } catch (err: any) {
            toast.error("Failed to update wishlist");
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePos({ x, y });
    };

    if (loading) return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-sking-pink border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold tracking-widest uppercase text-sm">Loading Product...</p>
            </div>
        </div>
    );
    if (!product) return <div className="min-h-screen bg-white text-black flex items-center justify-center font-bold uppercase tracking-widest">Product not found</div>;

    const currentPrice = selectedVariant ? selectedVariant.price : product.price;
    const finalPrice = product.offerPercentage > 0
        ? currentPrice - (currentPrice * (product.offerPercentage / 100))
        : currentPrice;

    return (
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <Link href="/" className="hover:text-black">Home</Link>
                <span>/</span>
                <Link href="/shop" className="hover:text-black">Shop</Link>
                <span>/</span>
                <span className="text-black font-medium">Details</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">

                {/* LEFT COLUMN: Images */}
                <div className="space-y-6">
                    {/* Main Image with Zoom */}
                    <div
                        className="relative aspect-[4/5] bg-white rounded-none overflow-hidden cursor-crosshair group border border-gray-100"
                        onMouseEnter={() => setZoomed(true)}
                        onMouseLeave={() => setZoomed(false)}
                        onMouseMove={handleMouseMove}
                    >
                        <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            className="object-contain p-8 md:p-12 transition-transform duration-200"
                            style={{
                                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                                transform: zoomed ? "scale(2)" : "scale(1)"
                            }}
                        />
                        {product.offerPercentage > 0 && (
                            <span className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                                {product.offerPercentage}% OFF
                            </span>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="flex items-center gap-2 md:gap-4 max-w-full overflow-hidden">
                        <button className="flex-shrink-0 text-gray-400 hover:text-black transition-colors hidden sm:block"><ChevronLeft /></button>
                        <div className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-none pb-2 px-1 snap-x snap-proximity">
                            {product.images?.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`relative w-16 h-16 md:w-20 md:h-20 bg-white border rounded-lg overflow-hidden p-1.5 transition-all flex-shrink-0 snap-center ${mainImage === img ? "border-sking-pink ring-1 ring-sking-pink shadow-md" : "border-gray-200 hover:border-gray-300"}`}
                                >
                                    <Image src={img} alt={`View ${idx}`} fill className="object-contain p-1" />
                                </button>
                            ))}
                        </div>
                        <button className="flex-shrink-0 text-gray-400 hover:text-black transition-colors hidden sm:block"><ChevronRight /></button>
                    </div>

                    {/* Share Icons */}
                    <div className="flex items-center gap-4 pt-4">
                        <span className="text-xs font-bold text-gray-900">Share</span>
                        <div className="flex gap-3">
                            <button className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-xs hover:bg-black transition-colors">X</button>
                            <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:brightness-110 transition-colors"><MessageCircle size={14} /></button>
                            <button className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:brightness-110 transition-colors"><Share2 size={14} /></button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Details */}
                <div className="flex flex-col h-full">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        {typeof product.category === 'object' ? product.category.name : 'Brand Name'}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                    {/* Ratings */}
                    <div className="flex items-center gap-4 mb-6 text-sm">
                        <div className="flex text-sking-pink">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    fill={i < Math.round(reviewsData?.averageRating || 0) ? "currentColor" : "none"}
                                    className={i < Math.round(reviewsData?.averageRating || 0) ? "" : "text-gray-300"}
                                />
                            ))}
                        </div>
                        <span className="text-gray-500 font-medium">({reviewsData?.averageRating || 0}/5)</span>
                        <span className="w-px h-4 bg-gray-300"></span>
                        <span className="text-black font-bold border-b border-black cursor-pointer">
                            {reviewsData?.totalReviews || 0} Reviews
                        </span>
                        <span className="text-gray-500">{product.soldCount || 0} Sold</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-end gap-3 mb-8">
                        <span className="text-4xl font-bold text-sking-pink">
                            ₹{finalPrice.toFixed(2)}
                        </span>
                        {product.offerPercentage > 0 && (
                            <>
                                <span className="bg-purple-600 text-white text-xs font-bold px-1 py-0.5 rounded mb-2">
                                    {product.offerPercentage}%
                                </span>
                                <span className="text-gray-400 line-through text-lg mb-1">
                                    ₹{currentPrice.toFixed(2)}
                                </span>
                            </>
                        )}
                    </div>

                    <div className="w-full h-px bg-gray-200 mb-8" />

                    <div className="space-y-6 mb-8 text-sm text-gray-600">
                        <div className="grid grid-cols-[120px_1fr] gap-4">
                            <span className="font-bold text-black">Brief Description</span>
                            <p className="leading-relaxed">{product.shortDescription || product.description?.substring(0, 150)}...</p>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-4">
                            <span className="font-bold text-black">Size</span>
                            <p>{selectedVariant ? selectedVariant.size : "Select Variant"}</p>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-4">
                            <span className="font-bold text-black">Stock</span>
                            <p>{selectedVariant ? selectedVariant.stock : product.variants?.reduce((acc: number, v: any) => acc + v.stock, 0) || 0}</p>
                        </div>
                    </div>

                    {/* Variants Selection */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-black mb-2">Select Variant</label>
                            <div className="flex gap-3">
                                {product.variants.map((variant: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`px-4 py-2 border rounded transition-colors ${selectedVariant?.size === variant.size ? "border-sking-pink bg-pink-50 text-sking-pink font-bold" : "border-gray-200 hover:border-gray-400"}`}
                                    >
                                        {variant.size} - ₹{variant.price}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Vouchers */}
                    {vouchers.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-3 text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="p-1 bg-gray-200 rounded-full font-bold text-[10px]">%</span>
                                    <span className="text-xs font-bold text-black uppercase tracking-tight">Active Offers</span>
                                    <span className="text-[10px] font-medium font-mono bg-gray-100 px-1.5 py-0.5 rounded uppercase">Applicable</span>
                                </div>
                                <Link
                                    href="/coupons"
                                    className="text-[10px] font-black uppercase tracking-widest text-sking-pink hover:underline flex items-center gap-1"
                                >
                                    View More <ExternalLink size={10} />
                                </Link>
                            </div>
                            <div className="flex flex-col gap-3">
                                {vouchers.slice(0, 2).map((voucher, idx) => (
                                    <div
                                        key={idx}
                                        className={`relative overflow-hidden flex items-center justify-between p-4 rounded-2xl border transition-all ${voucher.couponType === 'specific_products' || voucher.couponType === 'specific_users'
                                            ? "bg-pink-50/50 border-pink-100 shadow-sm"
                                            : "bg-gray-50 border-gray-100"
                                            }`}
                                    >
                                        {/* Decorative side punch hole */}
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-white border border-l-0 border-pink-100/50 rounded-r-full" />

                                        <div className="pl-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xl font-black text-black italic">
                                                    {voucher.discountType === 'percentage' ? `${voucher.discountValue}%` : `₹${voucher.discountValue}`}
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-sking-pink">OFF</span>
                                                {(voucher.couponType === 'specific_products' || voucher.couponType === 'specific_users') && (
                                                    <span className="px-1.5 py-0.5 bg-sking-pink text-white text-[8px] font-black uppercase tracking-tighter rounded">Exclusive</span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider line-clamp-1">{voucher.description}</p>
                                        </div>

                                        <div className="flex flex-col items-end gap-1 px-3 border-l border-gray-200 border-dashed ml-4">
                                            <span className="text-[10px] font-mono font-black text-black uppercase tracking-widest">{voucher.code}</span>
                                            <button
                                                onClick={() => copyToClipboard(voucher.code)}
                                                className="p-1.5 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-sking-pink"
                                                title="Copy Code"
                                            >
                                                {copiedCode === voucher.code ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500 uppercase">Quantity</span>
                            <div className="flex items-center border border-gray-300 rounded">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 hover:bg-gray-100 text-gray-600"
                                >
                                    -
                                </button>
                                <span className="px-4 py-2 font-medium w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => {
                                        if (quantity >= 10) {
                                            toast.error("maximum 10 per product");
                                        } else {
                                            setQuantity(quantity + 1);
                                        }
                                    }}
                                    className="px-4 py-2 hover:bg-gray-100 text-gray-600"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3 h-12">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 border border-sking-pink text-sking-pink font-bold uppercase tracking-widest text-sm rounded hover:bg-pink-50 transition-colors flex items-center justify-center gap-2"
                            >
                                Add to Bag
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className={`flex-1 font-bold uppercase tracking-widest text-sm rounded transition-all shadow-lg ${hasAddedToCart
                                    ? "bg-black text-white hover:bg-gray-900 shadow-gray-200"
                                    : "bg-sking-pink text-white hover:bg-pink-600 shadow-pink-200"}`}
                            >
                                {hasAddedToCart ? "View In Cart" : "Buy Now"}
                            </button>
                            <button
                                onClick={handleAddToWishlist}
                                className={`w-12 h-12 border rounded flex items-center justify-center transition-all ${isInWishlist ? 'bg-sking-pink border-sking-pink text-white' : 'border-sking-pink text-sking-pink hover:bg-pink-50'}`}
                            >
                                <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* TABS & REVIEWS */}
            <div className="mb-20">
                <div className="flex gap-6 md:gap-8 border-b border-gray-200 mb-8 bg-gray-50 px-4 rounded-t-lg overflow-x-auto scrollbar-none">
                    {['Description', 'Ingredients', 'How to Use'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`py-4 font-bold text-sm uppercase relative whitespace-nowrap transition-colors ${activeTab === tab.toLowerCase() ? "text-sking-pink" : "text-gray-500 hover:text-black"}`}
                        >
                            {tab}
                            {activeTab === tab.toLowerCase() && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sking-pink"></span>}
                        </button>
                    ))}
                </div>

                <div className="space-y-6 text-gray-600 leading-relaxed mb-16 px-4">
                    {activeTab === 'description' && (
                        <p>{product.description}</p>
                    )}
                    {activeTab === 'ingredients' && (
                        product.ingredients && product.ingredients.length > 0 ? (
                            <ul className="space-y-4">
                                {product.ingredients.map((ing: any, idx: number) => (
                                    <li key={idx}>
                                        <span className="font-bold text-black block">{ing.name}</span>
                                        {ing.description}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Ingredients detailed on packaging.</p>
                        )
                    )}
                    {activeTab === 'how to use' && (
                        product.howToUse && product.howToUse.length > 0 ? (
                            <ol className="list-decimal pl-5 space-y-2">
                                {product.howToUse.map((step: string, idx: number) => (
                                    <li key={idx}>{step}</li>
                                ))}
                            </ol>
                        ) : (
                            <p>Instructions detailed on packaging.</p>
                        )
                    )}
                </div>

                {/* REVIEWS SECTION */}
                <div id="reviews" className="border-t border-gray-100 pt-10">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-2xl font-black text-black uppercase tracking-tight">Customer Reviews</h3>
                    </div>

                    {/* Inline Review Form (Enhanced UI) */}
                    {canReview && (
                        <div id="reviews-form" className="mb-16 bg-white border border-gray-100/50 rounded-[40px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.02]">
                            <div className="flex flex-col md:flex-row gap-12">
                                <div className="md:w-1/3">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sking-pink mb-2 block">Share your experience</span>
                                    <h4 className="text-2xl font-black text-black uppercase tracking-tight mb-4">You've tried this product!</h4>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                                        Your feedback helps other shoppers make better choices. Rate and review your purchase below.
                                    </p>
                                </div>
                                <div className="flex-1">
                                    <form onSubmit={handleInlineSubmit} className="space-y-6">
                                        <div className="flex flex-col gap-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Rating</span>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setInlineRating(star)}
                                                        onMouseEnter={() => setInlineHover(star)}
                                                        onMouseLeave={() => setInlineHover(0)}
                                                        className="transition-transform active:scale-90"
                                                    >
                                                        <Star
                                                            size={32}
                                                            fill={(inlineHover || inlineRating) >= star ? "#FF1493" : "none"}
                                                            className={`transition-colors ${(inlineHover || inlineRating) >= star ? "text-sking-pink" : "text-gray-300"}`}
                                                        />
                                                    </button>
                                                ))}
                                                {inlineRating > 0 && (
                                                    <span className="ml-4 text-[10px] font-black uppercase tracking-widest self-center text-black">
                                                        {inlineRating === 1 && "Poor"}
                                                        {inlineRating === 2 && "Fair"}
                                                        {inlineRating === 3 && "Good"}
                                                        {inlineRating === 4 && "Great"}
                                                        {inlineRating === 5 && "Excellent"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Review</span>
                                            <div className="relative">
                                                <textarea
                                                    value={inlineComment}
                                                    onChange={(e) => setInlineComment(e.target.value)}
                                                    placeholder="What did you like or dislike? How does it feel on your skin?"
                                                    className="w-full bg-white border border-gray-100 rounded-3xl p-6 text-sm text-black focus:outline-none focus:ring-2 focus:ring-sking-pink/5 focus:border-sking-pink transition-all min-h-[120px] resize-none font-medium placeholder:text-gray-300 shadow-sm"
                                                />
                                                <div className="absolute bottom-4 right-6 flex items-center gap-2">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${inlineComment.length < 10 ? 'text-orange-400' : 'text-green-500'}`}>
                                                        {inlineComment.length} chars
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={inlineSubmitting}
                                            className="bg-black text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-neutral-800 transition-all shadow-xl shadow-black/10 flex items-center gap-3 disabled:opacity-50"
                                        >
                                            {inlineSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />}
                                            Submit Review
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-12 mb-12">
                        {/* Summary */}
                        <div className="w-full md:w-1/3">
                            <div className="text-6xl font-black text-black mb-4">
                                {reviewsData?.averageRating || 0}<span className="text-3xl text-gray-400 font-medium ml-1">/5</span>
                            </div>
                            <div className="flex text-sking-pink mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={20}
                                        fill={i < Math.round(reviewsData?.averageRating || 0) ? "currentColor" : "none"}
                                        className={i < Math.round(reviewsData?.averageRating || 0) ? "" : "text-gray-300"}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-10">
                                Based on {reviewsData?.totalReviews || 0} Reviews
                            </p>

                            <div className="space-y-3">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = reviewsData?.ratingBreakdown?.[star] || 0;
                                    const percentage = reviewsData?.totalReviews ? (count / reviewsData.totalReviews) * 100 : 0;
                                    return (
                                        <div key={star} className="flex items-center gap-4 text-[10px] font-bold text-gray-400">
                                            <div className="flex items-center gap-1 w-6">
                                                <span>{star}</span>
                                                <Star size={10} fill="currentColor" className="text-gray-300" />
                                            </div>
                                            <div className="flex-1 h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-sking-pink rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="w-6 text-right font-black text-black">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* List */}
                        <div className="w-full md:w-2/3 space-y-10">
                            {reviewsLoading ? (
                                <div className="space-y-8">
                                    {[1, 2].map(i => (
                                        <div key={i} className="animate-pulse flex gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-full" />
                                            <div className="flex-1 space-y-3">
                                                <div className="h-4 bg-gray-100 w-1/4 rounded" />
                                                <div className="h-10 bg-gray-100 w-full rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : reviewsData?.reviews?.length > 0 ? (
                                <>
                                    <div className="space-y-8">
                                        {reviewsData.reviews.map((review: any) => (
                                            <div key={review.id} className="flex gap-4 group">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 overflow-hidden flex-shrink-0 relative">
                                                    {review.user.profileImage ? (
                                                        <Image src={review.user.profileImage} alt={review.user.name} fill className="object-cover" />
                                                    ) : (
                                                        <span className="font-bold text-xs">{review.user.name.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-bold text-sm text-black flex items-center gap-2">
                                                            {review.user.name}
                                                            {review.isVerified && (
                                                                <span className="px-1.5 py-0.5 bg-green-50 text-green-600 text-[7px] font-black uppercase tracking-tighter rounded-full border border-green-100">Verified Buyer</span>
                                                            )}
                                                        </h4>
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex text-sking-pink mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={10}
                                                                fill={i < review.rating ? "currentColor" : "none"}
                                                                className={i < review.rating ? "" : "text-gray-200"}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{review.comment}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {reviewsData.totalReviews > 4 && (
                                        <button
                                            onClick={() => router.push(`/product/${id}/reviews`)}
                                            className="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-800 transition-all shadow-lg shadow-black/5"
                                        >
                                            View All {reviewsData.totalReviews} Reviews
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-gray-100 border-dashed">
                                    <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest">No reviews yet</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Be the first to share your experience!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RELATED PRODUCTS */}
                {related.length > 0 && (
                    <section className="border-t border-gray-200 pt-16 mt-16">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-2xl font-black text-black uppercase tracking-tight">Related Products</h2>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {related.map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

export default function ProductDetail() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white text-black flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-sking-pink border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-bold tracking-widest uppercase text-sm">Loading Product...</p>
                </div>
            </div>
        }>
            <ProductDetailContent />
        </Suspense>
    );
}
