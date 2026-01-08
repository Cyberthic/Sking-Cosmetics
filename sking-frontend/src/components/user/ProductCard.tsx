import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
    product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const finalPrice = product.offer > 0
        ? product.price - (product.price * (product.offer / 100))
        : product.price;

    return (
        <Link href={`/product/${product._id}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                {product.images?.[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}

                {product.offer > 0 && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-black text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                        -{product.offer}%
                    </span>
                )}
            </div>
            <div className="mt-4 space-y-1">
                <h3 className="font-medium text-lg text-white group-hover:text-purple-300 transition-colors">{product.name}</h3>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-white">₹{Math.floor(finalPrice)}</span>
                    {product.offer > 0 && (
                        <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                    )}
                </div>
                {product.category && (
                    <p className="text-xs text-gray-400">{typeof product.category === 'object' ? product.category.name : ''}</p>
                )}
            </div>
        </Link>
    )
}

export default ProductCard;
