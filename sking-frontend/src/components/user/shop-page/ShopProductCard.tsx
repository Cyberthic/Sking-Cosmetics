import { useState } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Loader2 } from "lucide-react";
import { userCartService } from "@/services/user/userCartApiService";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { updateCartLocally, setDrawerOpen, addToGuestCart } from "@/redux/features/cartSlice";
import { userWishlistService } from "@/services/user/userWishlistApiService"; // Still keep for direct if needed, but we'll use thunk
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { toggleWishlist, toggleGuestWishlist } from "@/redux/features/wishlistSlice";

export interface ShopProduct {
    id: string;
    slug?: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    image: string;
    isNew?: boolean;
    isFlashSale?: boolean;
    isFeatured?: boolean;
    isCombo?: boolean;
    offerPercentage?: number;
}

interface ShopProductCardProps {
    product: ShopProduct;
    viewMode?: 'grid' | 'list';
}

const ShopProductCard: React.FC<ShopProductCardProps> = ({ product, viewMode = 'grid' }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
    const isInWishlist = wishlistItems.includes(product.id);

    const [isCartLoading, setIsCartLoading] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);

    const discountPercentage = product.offerPercentage || (product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0);

    const renderTag = () => {
        if (product.isFlashSale) return <div className="absolute top-3 right-3 bg-sking-pink text-white text-[9px] font-black px-2 py-1 rounded-sm uppercase tracking-wider z-20 shadow-sm shadow-sking-pink/30">Flash Sale</div>;
        if (product.isFeatured) return <div className="absolute top-3 right-3 bg-gray-900 text-white text-[9px] font-black px-2 py-1 rounded-sm uppercase tracking-wider z-20 shadow-sm">Featured</div>;
        if (product.isCombo) return <div className="absolute top-3 right-3 bg-purple-600 text-white text-[9px] font-black px-2 py-1 rounded-sm uppercase tracking-wider z-20 shadow-sm">Includes in Combo</div>;
        if (product.isNew) return <div className="absolute top-3 right-3 bg-green-600 text-white text-[9px] font-black px-2 py-1 rounded-sm uppercase tracking-wider z-20 shadow-sm">New</div>;
        return null;
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isCartLoading) return;

        if (!isAuthenticated) {
            dispatch(addToGuestCart({
                product: {
                    _id: product.id,
                    name: product.name,
                    price: product.price,
                    images: [product.image]
                },
                quantity: 1,
                price: product.price,
                variantName: undefined
            }));
            dispatch(setDrawerOpen(true));
            toast.success("Added to Bag (Guest)");
            return;
        }

        setIsCartLoading(true);
        try {
            const response = await userCartService.addToCart(product.id, undefined, 1);
            if (response.success) {
                dispatch(updateCartLocally(response.cart));
                dispatch(setDrawerOpen(true));
                toast.success("Added to Bag");
            }
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to add to bag";
            toast.error(message);
        } finally {
            setIsCartLoading(false);
        }
    };

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isWishlistLoading) return;

        if (!isAuthenticated) {
            dispatch(toggleGuestWishlist(product.id));
            toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
            return;
        }

        setIsWishlistLoading(true);
        try {
            await dispatch(toggleWishlist(product.id)).unwrap();
            toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
        } catch (error: any) {
            toast.error("Failed to update wishlist");
        } finally {
            setIsWishlistLoading(false);
        }
    };

    if (viewMode === 'list') {
        return (
            <div className="group relative flex w-full bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Image Section */}
                <div className="relative w-1/3 min-w-[120px] sm:min-w-[180px] aspect-[4/3] sm:aspect-square overflow-hidden bg-gray-50">
                    <Link href={`/product/${product.slug || product.id}`}>
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 30vw, 20vw"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                                No Image
                            </div>
                        )}
                    </Link>

                    {/* Tags */}
                    {renderTag()}

                    {/* Discount Badge */}
                    {discountPercentage > 0 && (
                        <div className="absolute top-3 left-3 bg-sking-pink px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm rounded-full z-20">
                            -{discountPercentage}%
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                        {product.brand}
                    </span>

                    <Link href={`/product/${product.slug || product.id}`}>
                        <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-2 line-clamp-2 hover:text-sking-pink transition-colors">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="flex items-baseline gap-3 mb-3">
                        <span className="text-lg sm:text-2xl font-bold text-gray-900">
                            ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-400 line-through">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>

                    {/* Rating & Reviews */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <div className="flex text-sking-pink">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={14}
                                    className={star <= Math.round(product.rating) ? "fill-current" : "text-gray-200 fill-gray-200"}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-400">
                            ({product.rating}/5) | {product.reviewCount} Reviews
                        </span>
                    </div>

                    {/* Action Buttons (Visible on hover or mobile) */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddToCart}
                            disabled={isCartLoading}
                            className="bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isCartLoading ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <ShoppingBag size={14} />
                            )}
                            {isCartLoading ? "Adding..." : "Add to Bag"}
                        </button>
                        <button
                            onClick={handleToggleWishlist}
                            disabled={isWishlistLoading}
                            className={`p-2 border transition-colors disabled:opacity-50 ${isInWishlist ? 'bg-sking-pink text-white border-sking-pink' : 'bg-white text-gray-400 border-gray-200 hover:text-sking-pink hover:border-sking-pink'}`}
                        >
                            {isWishlistLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Heart size={16} fill={isInWishlist ? "currentColor" : "none"} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative flex flex-col bg-white">
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 rounded-sm">
                <Link href={`/product/${product.slug || product.id}`}>
                    {/* Main Image */}
                    <div className="relative h-full w-full">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain object-center transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                                No Image
                            </div>
                        )}
                    </div>
                </Link>

                {/* Tags */}
                {renderTag()}

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 bg-white px-2 py-1 text-xs font-bold uppercase tracking-widest text-black shadow-sm z-20">
                        -{discountPercentage}%
                    </div>
                )}

                {/* Wishlist Button */}
                <div className={`absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 flex gap-2 z-10 ${isCartLoading || isWishlistLoading ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}>
                    <button
                        onClick={handleAddToCart}
                        disabled={isCartLoading}
                        className="flex-1 bg-sking-pink text-white hover:bg-pink-700 h-10 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest shadow-md transition-colors disabled:opacity-50"
                    >
                        {isCartLoading ? (
                            <Loader2 size={14} className="animate-spin mb-0.5" />
                        ) : (
                            <ShoppingBag size={14} className="mb-0.5" />
                        )}
                        {isCartLoading ? "Adding..." : "Add to Bag"}
                    </button>
                    <button
                        onClick={handleToggleWishlist}
                        disabled={isWishlistLoading}
                        className={`h-10 w-10 flex items-center justify-center shadow-md transition-all border border-gray-100 disabled:opacity-50 ${isInWishlist ? 'bg-sking-pink text-white border-sking-pink' : 'bg-white text-gray-800 hover:text-sking-pink'}`}
                    >
                        {isWishlistLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Heart size={18} fill={isInWishlist ? "currentColor" : "none"} />
                        )}
                    </button>
                </div>
            </div>

            {/* Product Details */}
            <div className="mt-4 flex flex-col items-start gap-1">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    {product.brand}
                </span>
                <Link href={`/product/${product.slug || product.id}`} className="block w-full">
                    <h3 className="truncate text-base font-normal text-gray-900 transition-colors group-hover:text-sking-pink">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-lg font-bold text-gray-900">
                        ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                    )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1">
                    <div className="flex text-sking-pink">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={12}
                                className={star <= Math.round(product.rating) ? "fill-current" : "text-gray-300 fill-gray-300"}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-400 ml-1">
                        ({product.reviewCount} Reviews)
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ShopProductCard;
