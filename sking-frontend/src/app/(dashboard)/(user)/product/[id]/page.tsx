"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
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
import { Star, Heart, ChevronLeft, ChevronRight, Share2, MessageCircle, Copy, Check, Info, Ticket, ExternalLink } from "lucide-react";

const REVIEWS_SUMMARY = {
    total: 143,
    average: 4.5,
    breakdown: [50, 83, 10, 0, 0] // 5, 4, 3, 2, 1 stars
};

const MOCK_REVIEWS = [
    {
        id: 1,
        user: "Emma Beauty",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
        rating: 5,
        date: "March 23, 2024",
        comment: "I absolutely adore the Rosewater Hydrating Mist! It's become an essential part of my skincare routine. The mist is so refreshing and leaves my skin feeling instantly hydrated. The subtle rose scent is divine!"
    },
    {
        id: 2,
        user: "Mark",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
        rating: 5,
        date: "March 10, 2024",
        comment: "I've tried numerous facial mists, but the Glowify Rosewater Hydrating Mist is on another level. It's incredibly soothing and gives my skin an instant boost of hydration."
    }
];

export default function ProductDetail() {
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

    useEffect(() => {
        if (id) fetchData(id as string);
    }, [id]);

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
                    <div className="flex items-center justify-center gap-4">
                        <button className="text-gray-400 hover:text-black"><ChevronLeft /></button>
                        <div className="flex gap-4">
                            {product.images?.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setMainImage(img)}
                                    className={`relative w-20 h-20 bg-white border rounded-lg overflow-hidden p-2 transition-all ${mainImage === img ? "border-sking-pink ring-1 ring-sking-pink" : "border-gray-200 hover:border-gray-400"}`}
                                >
                                    <Image src={img} alt={`View ${idx}`} fill className="object-contain p-1" />
                                </button>
                            ))}
                        </div>
                        <button className="text-gray-400 hover:text-black"><ChevronRight /></button>
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
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" className="text-gray-300" />
                        </div>
                        <span className="text-gray-500 font-medium">(4.5/5)</span>
                        <span className="w-px h-4 bg-gray-300"></span>
                        <span className="text-black font-bold border-b border-black cursor-pointer">143 Reviews</span>
                        <span className="text-gray-500">2.3K Sold</span>
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
                            <button className="flex-1 bg-sking-pink text-white font-bold uppercase tracking-widest text-sm rounded hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200">
                                Buy Now
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
                <div className="flex gap-8 border-b border-gray-200 mb-8 bg-gray-50 px-4 rounded-t-lg">
                    {['Description', 'Ingredients', 'How to Use'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`py-4 font-bold text-sm uppercase relative ${activeTab === tab.toLowerCase() ? "text-sking-pink" : "text-gray-500 hover:text-black"}`}
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
                <div className="border-t border-gray-100 pt-10">
                    <h3 className="text-2xl font-bold text-black mb-8">Reviews</h3>
                    <div className="flex flex-col md:flex-row gap-12 mb-12">
                        {/* Summary */}
                        <div className="w-full md:w-1/3">
                            <div className="text-6xl font-black text-black mb-4">4.5<span className="text-3xl text-gray-400 font-medium">/5</span></div>
                            <div className="flex text-sking-pink mb-2">
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" className="text-gray-300" />
                            </div>
                            <p className="text-gray-500 text-sm mb-6">143 Reviews</p>

                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((star, idx) => (
                                    <div key={star} className="flex items-center gap-3 text-xs text-gray-500">
                                        <span className="w-2">{star}</span>
                                        <Star size={10} fill="#9CA3AF" className="text-gray-400" />
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-sking-pink rounded-full"
                                                style={{ width: `${(REVIEWS_SUMMARY.breakdown[idx] / 143) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="w-6 text-right">{REVIEWS_SUMMARY.breakdown[idx]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* List */}
                        <div className="w-full md:w-2/3 space-y-8">
                            <div className="flex justify-end border-b border-gray-100 pb-4">
                                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-black">
                                    Sort by Newest Rating <ChevronRight size={14} className="rotate-90" />
                                </button>
                            </div>

                            {MOCK_REVIEWS.map(review => (
                                <div key={review.id} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 relative">
                                        <Image src={review.avatar} alt={review.user} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-bold text-sm text-black">{review.user}</h4>
                                            <span className="text-xs text-gray-400">{review.date}</span>
                                        </div>
                                        <div className="flex text-sking-pink mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                                            ))}
                                            <span className="text-xs text-gray-400 ml-2">({review.rating}/5)</span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                                    </div>
                                </div>
                            ))}

                            <button className="px-6 py-2 bg-sking-pink text-white text-xs font-bold uppercase rounded hover:bg-pink-600 transition-colors">
                                View More
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* RELATED PRODUCTS */}
            {related.length > 0 && (
                <section className="border-t border-gray-200 pt-16">
                    <div className="flex justify-between items-end mb-8">
                        <h2 className="text-2xl font-bold text-black">Related Products</h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {related.map(p => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}
