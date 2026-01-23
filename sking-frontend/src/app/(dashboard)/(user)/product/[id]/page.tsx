"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/user/Navbar";
import { userProductService } from "@/services/user/userProductApiService";
import ProductCard from "@/components/user/ProductCard";
import { userCartService } from "@/services/user/userCartApiService";
import { userWishlistService } from "@/services/user/userWishlistApiService";
import { toast } from "react-hot-toast";

import Footer from "@/components/user/Footer";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [related, setRelated] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [mainImage, setMainImage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id) fetchData(id as string);
    }, [id]);

    const fetchData = async (productId: string) => {
        setLoading(true);
        try {
            const data = await userProductService.getProductById(productId);
            if (data.success) {
                setProduct(data.product);
                setRelated(data.related || []);
                if (data.product.images?.length > 0) setMainImage(data.product.images[0]);
                if (data.product.variants?.length > 0) setSelectedVariant(data.product.variants[0]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!product) return;
        setSubmitting(true);
        try {
            await userCartService.addToCart(product._id, selectedVariant?.name, 1);
            toast.success("Added to Cart");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to add to cart");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddToWishlist = async () => {
        if (!product) return;
        try {
            await userWishlistService.toggleWishlist(product._id);
            toast.success("Updated Wishlist");
        } catch (err: any) {
            toast.error("Failed to update wishlist");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-sking-black border-t-sking-red rounded-full animate-spin"></div>
                <p className="font-bold tracking-widest uppercase text-sm">Loading Product...</p>
            </div>
        </div>
    );
    if (!product) return <div className="min-h-screen bg-white text-black flex items-center justify-center font-bold uppercase tracking-widest">Product not found</div>;

    const currentPrice = selectedVariant ? selectedVariant.price : product.price;
    const finalPrice = product.offer > 0
        ? currentPrice - (currentPrice * (product.offer / 100))
        : currentPrice;

    return (
        <div className="min-h-screen bg-white text-black selection:bg-sking-pink selection:text-white flex flex-col">
            <Navbar />

            {/* Compact Dark Header for Product Page */}
            <div className="relative h-[30vh] min-h-[200px] w-full bg-sking-black flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-neutral-900" />
                <div className="relative z-10 text-center space-y-2 px-4 mt-12">
                    <p className="text-gray-400 font-bold tracking-widest uppercase text-xs md:text-sm">
                        {typeof product.category === 'object' ? product.category.name : 'Shop'}
                    </p>
                    <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter truncate max-w-4xl mx-auto">
                        {product.name}
                    </h1>
                </div>
            </div>

            <main className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-16 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Images */}
                    <div className="space-y-4 top-24 self-start sticky">
                        <div className="relative aspect-square bg-gray-50 overflow-hidden">
                            {mainImage && <Image src={mainImage} alt={product.name} fill className="object-cover" />}
                            {product.offer > 0 && (
                                <span className="absolute top-4 left-4 bg-black text-white text-sm font-bold px-3 py-1 uppercase tracking-widest">
                                    -{product.offer}% OFF
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {product.images?.map((img: string, idx: number) => (
                                <button key={idx} onClick={() => setMainImage(img)} className={`relative aspect-square bg-gray-50 overflow-hidden border-2 transition-all ${mainImage === img ? "border-black" : "border-transparent hover:border-gray-200"}`}>
                                    <Image src={img} alt={`View ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-10 lg:pl-8">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 leading-none">{product.name}</h2>
                            <div className="flex items-center gap-4">
                                <div className="text-3xl font-bold">₹{Math.floor(finalPrice)}</div>
                                {product.offer > 0 && (
                                    <div className="text-xl text-gray-400 line-through">₹{currentPrice}</div>
                                )}
                            </div>
                        </div>

                        <div className="prose prose-lg text-gray-600 font-light leading-relaxed">
                            <p>{product.description}</p>
                        </div>

                        <div className="space-y-6">
                            <label className="text-xs font-bold text-black uppercase tracking-widest">Select Variant</label>
                            <div className="flex flex-wrap gap-3">
                                {product.variants?.map((v: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedVariant(v)}
                                        className={`px-8 py-3 border transition-all uppercase text-sm font-bold tracking-wider ${selectedVariant === v ? "bg-black text-white border-black" : "bg-white text-black border-gray-200 hover:border-black"}`}
                                    >
                                        {v.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={submitting || (selectedVariant ? selectedVariant.stock <= 0 : product.stock <= 0)}
                                className="flex-1 px-12 py-5 bg-sking-red text-white font-bold tracking-widest uppercase hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Adding..." : "Add to Cart"}
                            </button>
                            <button
                                onClick={handleAddToWishlist}
                                className="px-6 py-5 border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all text-black"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </button>
                        </div>

                        {/* Additional Info / Stock */}
                        <div className="flex items-center gap-2 text-sm uppercase tracking-widest font-bold">
                            <div className={`w-2 h-2 rounded-full ${(selectedVariant ? selectedVariant.stock : product.stock) > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
                            <span>{(selectedVariant ? selectedVariant.stock : product.stock) > 0 ? "In Stock" : "Out of Stock"}</span>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <section className="pt-20 border-t border-gray-100">
                        <h2 className="text-3xl md:text-4xl font-black text-center mb-12 tracking-tighter uppercase relative">
                            You May Also Like
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {related.map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
}
