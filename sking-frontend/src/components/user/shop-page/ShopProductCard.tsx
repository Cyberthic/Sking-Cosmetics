import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";

export interface ShopProduct {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    image: string;
    isNew?: boolean;
}

interface ShopProductCardProps {
    product: ShopProduct;
}

const ShopProductCard: React.FC<ShopProductCardProps> = ({ product }) => {
    const discountPercentage = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="group relative flex flex-col bg-white">
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 rounded-sm">
                <Link href={`/product/${product.id}`}>
                    {/* Main Image */}
                    <div className="relative h-full w-full">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                                No Image
                            </div>
                        )}
                    </div>
                </Link>

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                    <div className="absolute top-3 left-3 bg-white px-2 py-1 text-xs font-bold uppercase tracking-widest text-black shadow-sm">
                        -{discountPercentage}%
                    </div>
                )}

                {/* Wishlist Button (Always visible or on hover? Reference shows heart next to Add to Cart on hover, but mostly clear image. Let's place it top right or with actions) */}
                {/* Reference Image 3 shows Add to Bag and Heart appearing on hover at the bottom of the image area */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 flex gap-2 z-10">
                    <button className="flex-1 bg-sking-pink text-white hover:bg-pink-700 h-10 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest shadow-md transition-colors">
                        <ShoppingBag size={14} className="mb-0.5" />
                        Add to Bag
                    </button>
                    <button className="h-10 w-10 bg-white text-gray-800 hover:text-sking-pink flex items-center justify-center shadow-md transition-colors border border-gray-100">
                        <Heart size={18} />
                    </button>
                </div>
            </div>

            {/* Product Details */}
            <div className="mt-4 flex flex-col items-start gap-1">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    {product.brand}
                </span>
                <Link href={`/product/${product.id}`} className="block w-full">
                    <h3 className="truncate text-base font-normal text-gray-900 transition-colors group-hover:text-sking-pink">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-lg font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                            ${product.originalPrice.toFixed(2)}
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
