import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
    product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const finalPrice = product.offerPercentage > 0
        ? product.price - (product.price * (product.offerPercentage / 100))
        : product.price;

    return (
        <Link href={`/product/${product._id}`} className="group block h-full">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                {product.images?.[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold uppercase text-xs">No Image</div>
                )}

                {product.offerPercentage > 0 && (
                    <span className="absolute top-3 left-3 bg-white text-black text-xs font-bold px-2 py-1 uppercase tracking-widest shadow-sm">
                        -{product.offerPercentage}%
                    </span>
                )}
            </div>
            <div className="mt-4 space-y-1">
                <h3 className="font-bold text-lg uppercase tracking-tight text-black group-hover:text-sking-red transition-colors truncate">{product.name}</h3>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-black">₹{Math.floor(finalPrice)}</span>
                    {product.offerPercentage > 0 && (
                        <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                    )}
                </div>
                {product.category && (
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{typeof product.category === 'object' ? product.category.name : ''}</p>
                )}
            </div>
        </Link>
    )
}

export default ProductCard;
