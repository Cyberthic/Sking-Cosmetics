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

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Product not found</div>;

    const currentPrice = selectedVariant ? selectedVariant.price : product.price;
    const finalPrice = product.offer > 0
        ? currentPrice - (currentPrice * (product.offer / 100))
        : currentPrice;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <Navbar />
            <main className="pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-900 border border-gray-800">
                            {mainImage && <Image src={mainImage} alt={product.name} fill className="object-cover" />}
                            {product.offer > 0 && (
                                <span className="absolute top-4 left-4 bg-white text-black font-bold px-3 py-1 rounded-full">
                                    -{product.offer}% OFF
                                </span>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {product.images?.map((img: string, idx: number) => (
                                <button key={idx} onClick={() => setMainImage(img)} className={`relative aspect-square rounded-lg overflow-hidden border-2 ${mainImage === img ? "border-white" : "border-transparent"}`}>
                                    <Image src={img} alt={`View ${idx}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-2">{product.name}</h1>
                            <p className="text-gray-400">{typeof product.category === 'object' ? product.category.name : ''}</p>
                        </div>

                        <div className="flex items-end gap-4">
                            <div className="text-4xl font-bold">₹{Math.floor(finalPrice)}</div>
                            {product.offer > 0 && (
                                <div className="text-xl text-gray-500 line-through mb-1">₹{currentPrice}</div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Volume</label>
                            <div className="flex flex-wrap gap-3">
                                {product.variants?.map((v: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedVariant(v)}
                                        className={`px-6 py-3 rounded-full border transition-all ${selectedVariant === v ? "bg-white text-black border-white" : "bg-transparent text-white border-gray-700 hover:border-gray-500"}`}
                                    >
                                        {v.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <p className="text-gray-300 leading-relaxed text-lg font-light">
                            {product.description}
                        </p>

                        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={submitting || (selectedVariant ? selectedVariant.stock <= 0 : product.stock <= 0)}
                                className="flex-1 md:flex-none px-12 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Adding..." : `Add to Cart — ₹${Math.floor(finalPrice)}`}
                            </button>
                            <button
                                onClick={handleAddToWishlist}
                                className="px-6 py-4 border border-gray-700 rounded-full hover:bg-gray-800 transition-colors"
                            >
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </button>
                        </div>
                        <p className="mt-4 text-center md:text-left text-sm text-gray-500">
                            {(selectedVariant ? selectedVariant.stock : product.stock) > 0 ? "In Stock" : "Out of Stock"}
                        </p>
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <section className="pt-16 border-t border-gray-900">
                        <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {related.map(p => (
                                <ProductCard key={p._id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <footer className="py-12 w-full text-center text-neutral-600 text-xs tracking-widest uppercase border-t border-gray-900">
                <p>&copy; {new Date().getFullYear()} Sking Cosmetics &bull; All Rights Reserved</p>
            </footer>
        </div>
    );
}
