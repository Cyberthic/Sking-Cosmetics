"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { addToGuestCart, setDrawerOpen, updateCartLocally } from "@/redux/features/cartSlice";
import { toggleWishlist, toggleGuestWishlist } from "@/redux/features/wishlistSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { userCartService } from "@/services/user/userCartApiService";
import { toast } from "sonner";

interface NewInStoreProps {
    products: any[];
}

const NewInStore = ({ products }: NewInStoreProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const handleToggleWishlist = async (productId: string) => {
        if (!isAuthenticated) {
            dispatch(toggleGuestWishlist(productId));
            const isInWishlistNow = wishlistItems.includes(productId);
            toast.success(!isInWishlistNow ? "Added to wishlist" : "Removed from wishlist");
            return;
        }
        try {
            await dispatch(toggleWishlist(productId)).unwrap();
            const isInWishlistNow = wishlistItems.includes(productId);
            toast.success(!isInWishlistNow ? "Added to wishlist" : "Removed from wishlist");
        } catch (error: any) {
            toast.error("Failed to update wishlist");
        }
    };

    const handleAddToCart = async (product: any) => {
        const finalPrice = product.offerPercentage > 0
            ? product.price - (product.price * (product.offerPercentage / 100))
            : product.price;

        if (!isAuthenticated) {
            dispatch(addToGuestCart({
                product: {
                    _id: product._id,
                    name: product.name,
                    price: finalPrice,
                    images: product.images
                },
                quantity: 1,
                price: finalPrice,
                variantName: undefined
            }));
            dispatch(setDrawerOpen(true));
            toast.success("Added to Bag (Guest)");
            return;
        }

        try {
            const response = await userCartService.addToCart(product._id, undefined, 1);
            if (response.success) {
                dispatch(updateCartLocally(response.cart));
                dispatch(setDrawerOpen(true));
                toast.success("Added to Bag");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to add to bag");
        }
    };

    useEffect(() => {
        // Auto-slide for mobile
        const autoSlide = setInterval(() => {
            if (scrollRef.current && window.innerWidth < 1024) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const maxScroll = scrollWidth - clientWidth;
                if (scrollLeft >= maxScroll - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollBy({ left: clientWidth * 0.8, behavior: 'smooth' });
                }
            }
        }, 7000);

        return () => clearInterval(autoSlide);
    }, []);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 20);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.clientWidth * 0.8;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const displayProducts = products.length > 0 ? products.slice(0, 6) : [];
    const featuredProduct = products.length > 6 ? products[6] : (products.length > 0 ? products[0] : null);

    if (!displayProducts.length) return null;

    return (
        <section className="py-24 bg-gray-50/50 overflow-hidden">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                            NEW IN <span className="text-sking-pink italic">STORE</span>
                        </h2>
                        <p className="text-gray-500 mt-2 font-medium">Discover our latest arrivals and fresh additions.</p>
                    </div>
                    <Link href="/shop" className="text-sking-pink font-black text-lg hover:underline underline-offset-8">
                        View All Collections
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left Grid (2/3 width) Slider */}
                    <div className="flex-1 relative group/slider">
                        {/* Navigation Arrows */}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-2 -right-2 flex justify-between items-center z-10 pointer-events-none lg:hidden">
                            <AnimatePresence>
                                {canScrollLeft && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={() => scroll('left')}
                                        className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-black pointer-events-auto hover:bg-sking-pink hover:text-white transition-all border border-gray-100"
                                    >
                                        <ChevronLeft size={20} />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                            <AnimatePresence>
                                {canScrollRight && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={() => scroll('right')}
                                        className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-black pointer-events-auto hover:bg-sking-pink hover:text-white transition-all border border-gray-100"
                                    >
                                        <ChevronRight size={20} />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        <div
                            ref={scrollRef}
                            onScroll={checkScroll}
                            className="flex lg:grid lg:grid-cols-3 gap-x-8 gap-y-12 overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory pb-6 lg:pb-0"
                        >
                            {displayProducts.map((product) => (
                                <Link href={`/product/${product.slug}`} key={product._id} className="min-w-[200px] sm:min-w-[240px] lg:min-w-0 group flex flex-col snap-center">
                                    <div className="relative h-64 w-full bg-white rounded-[2rem] overflow-hidden mb-5 p-6 flex items-center justify-center border border-gray-100 group-hover:shadow-2xl transition-all duration-500">
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {product.offerPercentage > 0 && (
                                            <div className="absolute top-4 left-4 bg-sking-pink text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                                                -{product.offerPercentage}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 px-1">
                                        <span className="text-[10px] text-sking-pink font-black uppercase tracking-widest">{product.category?.name || "SKING"}</span>
                                        <h3 className="font-bold text-base text-gray-900 line-clamp-2 leading-tight h-10 group-hover:text-sking-pink transition-colors">{product.name}</h3>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex flex-col">
                                                <span className="font-black text-xl text-gray-900">₹{product.offerPercentage > 0 ? Math.round(product.price * (1 - product.offerPercentage / 100)) : product.price}</span>
                                                {product.offerPercentage > 0 && <span className="text-xs text-gray-400 line-through font-medium">₹{product.price}</span>}
                                            </div>
                                            <div className="flex text-sking-pink">
                                                <Star size={10} fill="currentColor" />
                                                <Star size={10} fill="currentColor" />
                                                <Star size={10} fill="currentColor" />
                                                <Star size={10} fill="currentColor" />
                                                <Star size={10} fill="currentColor" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Featured Card (1/3 width) */}
                    {featuredProduct && (
                        <div className="w-full lg:w-[450px] bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 p-8 flex flex-col hover:shadow-sking-pink/5 transition-all duration-500 z-10">

                            <div className="flex items-center justify-between mb-8">
                                <span className="bg-gray-900 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">Editor&apos;s Pick</span>
                                <button
                                    onClick={() => handleToggleWishlist(featuredProduct._id)}
                                    className={`transition-colors ${wishlistItems.includes(featuredProduct._id) ? 'text-sking-pink' : 'text-gray-400 hover:text-sking-pink'}`}
                                >
                                    <Heart size={24} fill={wishlistItems.includes(featuredProduct._id) ? "currentColor" : "none"} />
                                </button>
                            </div>

                            {/* Main Image */}
                            <div className="relative w-full h-80 mb-8 p-10 bg-gray-50 rounded-[2.5rem] overflow-hidden group/feat">
                                <Image
                                    src={featuredProduct.images[0]}
                                    alt={featuredProduct.name}
                                    fill
                                    className="object-contain p-8 group-hover/feat:scale-110 transition-transform duration-700"
                                />
                            </div>

                            {/* Product Details */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <span className="text-xs font-black text-sking-pink uppercase tracking-[0.2em]">{featuredProduct.category?.name || "PREMIUM"}</span>
                                    <h3 className="text-3xl font-black text-gray-900 leading-tight">{featuredProduct.name}</h3>
                                    <div className="flex items-center gap-4 pt-2">
                                        <span className="text-4xl font-black text-gray-900">₹{featuredProduct.offerPercentage > 0 ? Math.round(featuredProduct.price * (1 - featuredProduct.offerPercentage / 100)) : featuredProduct.price}</span>
                                        {featuredProduct.offerPercentage > 0 && <span className="text-lg text-gray-400 line-through font-bold">₹{featuredProduct.price}</span>}
                                    </div>
                                </div>

                                {/* Stock & Info */}
                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                                    {featuredProduct.shortDescription || "Experience the pinnacle of skincare excellence with our latest premium selection. Crafted for perfection and glowing results."}
                                </p>

                                {/* Actions */}
                                <div className="pt-4 space-y-4">
                                    <button
                                        onClick={() => handleAddToCart(featuredProduct)}
                                        className="w-full py-5 bg-gray-900 text-white font-black text-sm uppercase rounded-[2rem] hover:bg-sking-pink transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                                    >
                                        <ShoppingBag size={20} /> ADD TO BAG
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => handleToggleWishlist(featuredProduct._id)}
                                            className="py-4 border border-gray-100 rounded-2xl font-bold text-xs uppercase hover:bg-gray-50 transition-all"
                                        >
                                            {wishlistItems.includes(featuredProduct._id) ? 'In Wishlist' : 'Add to Wishlist'}
                                        </button>
                                        <Link
                                            href={`/product/${featuredProduct.slug}`}
                                            className="py-4 border border-gray-100 rounded-2xl font-bold text-xs uppercase hover:bg-gray-50 transition-all flex items-center justify-center"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    );
};

export default NewInStore;

