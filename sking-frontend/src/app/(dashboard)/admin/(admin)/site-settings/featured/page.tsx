"use client";
import React, { useState, useEffect } from "react";
import PageBreadCrumb from "@/components/admin/common/PageBreadCrumb";
import { adminFeaturedApiService } from "@/services/admin/adminFeaturedApiService";
import { adminProductService } from "@/services/admin/adminProductApiService";
import { Star, Search, Save, Trash2, Plus, Info, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FeaturedProductsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const res = await adminFeaturedApiService.getFeaturedProducts();
            if (res.success && res.data) {
                setSelectedProducts(res.data.products || []);
            }
        } catch (error) {
            console.error("Error fetching featured products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const res = await adminProductService.getProducts(1, 5, searchQuery);
            if (res.success) {
                setSearchResults(res.products);
            }
        } catch (error) {
            toast.error("Failed to search products");
        } finally {
            setSearching(false);
        }
    };

    const addProduct = (product: any) => {
        if (selectedProducts.find((p) => p._id === product._id)) {
            toast.error("Product already added");
            return;
        }
        setSelectedProducts([...selectedProducts, product]);
        setSearchResults([]);
        setSearchQuery("");
    };

    const removeProduct = (productId: string) => {
        setSelectedProducts(selectedProducts.filter((p) => p._id !== productId));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const data = {
                products: selectedProducts.map((p) => p._id),
            };
            const res = await adminFeaturedApiService.updateFeaturedProducts(data);
            if (res.success) {
                toast.success("Featured products updated successfully");
                if (res.data) {
                    setSelectedProducts(res.data.products || []);
                }
            } else {
                toast.error(res.error || "Failed to update featured products");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to update featured products");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 text-gray-500 hover:text-purple-500 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <PageBreadCrumb
                    pageTitle="Featured Products"
                    parentPage="Site Settings"
                    parentHref="/admin/site-settings"
                />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Info & Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
                            <Star className="text-purple-500" size={24} />
                            Featured Setup
                        </h3>

                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            Curate the top products that appear in the "Featured" section on the home page.
                        </p>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {saving ? "Saving..." : <><Save size={20} /> Save Changes</>}
                        </button>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-3xl p-6 border border-purple-100 dark:border-purple-500/10">
                        <h4 className="font-bold text-purple-800 dark:text-purple-400 flex items-center gap-2 mb-2">
                            <Info size={18} />
                            Pro Tip
                        </h4>
                        <p className="text-sm text-purple-700 dark:text-purple-500/80 leading-relaxed">
                            Use featured products to showcase seasonal bestsellers or new launches. These products stay featured until manually changed.
                        </p>
                    </div>
                </div>

                {/* Right Column: Product Selection */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-white/5">
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-8 text-gray-900 dark:text-white">
                            <Plus className="text-purple-500" size={24} />
                            Manage Collection ({selectedProducts.length} Products)
                        </h3>

                        {/* Selection Search */}
                        <div className="relative mb-8">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search products to feature..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 dark:bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold"
                                >
                                    Search
                                </button>
                            </div>

                            {/* Search Results Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                                    {searchResults.map((product) => (
                                        <div
                                            key={product._id}
                                            className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b last:border-none border-gray-100 dark:border-white/5"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">{product.name}</p>
                                                    <p className="text-xs text-brand-500">₹{product.price}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => addProduct(product)}
                                                className="bg-brand-500 text-white p-2 rounded-xl hover:bg-brand-600 transition-all"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedProducts.length === 0 ? (
                                <div className="col-span-full py-12 text-center text-gray-400 flex flex-col items-center gap-4 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-3xl">
                                    <Star size={48} className="opacity-10" />
                                    <p>No products currently featured</p>
                                </div>
                            ) : (
                                selectedProducts.map((product) => (
                                    <div key={product._id} className="group relative flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-transparent hover:border-purple-500/30 transition-all">
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white">
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white truncate">{product.name}</p>
                                            <p className="text-sm text-brand-500 font-bold">₹{product.price}</p>
                                        </div>
                                        <button
                                            onClick={() => removeProduct(product._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
