import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { userWishlistService } from "@/services/user/userWishlistApiService";
import { toast } from "sonner";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { toggleWishlist, toggleGuestWishlist } from "@/redux/features/wishlistSlice";

interface ProductCardProps {
    product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
    const isInWishlist = wishlistItems.includes(product._id);

    const finalPrice = product.offerPercentage > 0
        ? product.price - (product.price * (product.offerPercentage / 100))
        : product.price;

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            dispatch(toggleGuestWishlist(product._id));
            toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
            return;
        }

        try {
            await dispatch(toggleWishlist(product._id)).unwrap();
            toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
        } catch (error: any) {
            toast.error("Failed to update wishlist");
        }
    };

    return (
        <div className="group relative h-full">
            <Link href={`/product/${product.slug || product._id}`} className="block h-full">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 border border-gray-100">
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
                        <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-black px-2 py-1 uppercase tracking-widest shadow-sm">
                            -{product.offerPercentage}%
                        </span>
                    )}

                    {/* Wishlist Button Overlay */}
                    <button
                        onClick={handleToggleWishlist}
                        className={`absolute top-3 right-3 h-9 w-9 backdrop-blur-sm rounded-full flex items-center justify-center transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 shadow-sm ${isInWishlist ? 'bg-sking-pink text-white' : 'bg-white/80 text-gray-400 hover:text-sking-red'}`}
                    >
                        <Heart size={18} fill={isInWishlist ? "currentColor" : "none"} />
                    </button>
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
        </div>
    )
}

export default ProductCard;
