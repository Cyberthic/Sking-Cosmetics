"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { debounce } from "@/utils/debounce";
import Link from "next/link";
import Image from "next/image";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../../../components/admin/ui/table";
import Badge from "../../../../../components/admin/ui/badge/Badge";
import { adminProductService } from "../../../../../services/admin/adminProductApiService";
import { adminCategoryService } from "../../../../../services/admin/adminCategoryApiService";
import Pagination from "../../../../../components/admin/tables/Pagination";
import Button from "../../../../../components/admin/ui/button/Button";
import { ConfirmationModal } from "../../../../../components/common/ConfirmationModal";
import { toast } from "sonner";
import { Eye, EyeOff, Search } from "lucide-react";
import FormSelect from "../../../../../components/admin/form/FormSelect";

interface IProduct {
    _id: string;
    slug?: string;
    name: string;
    price: number;
    finalPrice: number;
    appliedOffer: number;
    images: string[];
    category: {
        _id: string;
        name: string;
    } | string;
    isActive: boolean;
    variants: any[];
}

export default function ProductsPage() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
    const [filters, setFilters] = useUrlState({
        page: 1,
        search: "",
        category: "",
        sortBy: "newest"
    });
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [productToToggle, setProductToToggle] = useState<IProduct | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchProducts = useCallback(async (currentFilters: any) => {
        try {
            setLoading(true);
            const data = await adminProductService.getProducts(currentFilters.page, limit, currentFilters.search, currentFilters.category, currentFilters.sortBy);
            if (data.success) {
                setProducts(data.products);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    const fetchCategories = async () => {
        try {
            const data = await adminCategoryService.getCategories(1, 100);
            if (data.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts(filters);
    }, [filters, fetchProducts]);

    const handleSearch = useMemo(() =>
        debounce((val: string) => {
            setFilters({ search: val, page: 1 });
        }, 500)
        , [setFilters]);

    const handleToggleRequest = (product: IProduct) => {
        setProductToToggle(product);
        setIsConfirmModalOpen(true);
    };

    const confirmToggle = async () => {
        if (!productToToggle) return;
        try {
            setActionLoading(true);
            const res = await adminProductService.toggleProductStatus(productToToggle._id);
            if (res.success) {
                toast.success(res.message);
                fetchProducts(filters);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to update status");
        } finally {
            setActionLoading(false);
            setIsConfirmModalOpen(false);
            setProductToToggle(null);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-8 flex flex-col items-start gap-4">
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight dark:text-white">Products</h1>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-widest mt-1">Manage your product inventory</p>
                    </div>
                    <Button href="/admin/products/add">
                        Add New Product
                    </Button>
                </div>

                <div className="bg-white dark:bg-white/5 p-6 rounded-[30px] border border-gray-100 dark:border-white/10 shadow-sm w-full flex flex-col lg:flex-row gap-4">
                    <div className="flex-grow w-full">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-sking-pink transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="SEARCH PRODUCTS..."
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-black/50 border-none rounded-2xl focus:ring-2 focus:ring-sking-pink/50 text-sm font-bold uppercase tracking-wide transition-all"
                                defaultValue={filters.search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <FormSelect
                            className="w-full sm:w-64"
                            value={filters.category}
                            onChange={(val) => setFilters({ category: val, page: 1 })}
                            options={[
                                { value: "", label: "All Categories" },
                                ...categories.map(cat => ({ value: cat._id, label: cat.name }))
                            ]}
                            placeholder="Filter Category"
                        />
                        <FormSelect
                            className="w-full sm:w-64"
                            value={filters.sortBy}
                            onChange={(val) => setFilters({ sortBy: val, page: 1 })}
                            options={[
                                { value: "newest", label: "Newest First" },
                                { value: "oldest", label: "Oldest First" },
                                { value: "price-asc", label: "Price: Low to High" },
                                { value: "price-desc", label: "Price: High to Low" },
                                { value: "name-asc", label: "Name: A-Z" },
                                { value: "name-desc", label: "Name: Z-A" },
                                { value: "sold-desc", label: "Best Selling" }
                            ]}
                            placeholder="Sort By"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Product</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Category</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Dates</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Price/Offer</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Stock</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Status</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {loading && products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="px-5 py-4 text-center">Loading...</TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="px-5 py-4 text-center">No products found.</TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product._id}>
                                        <TableCell className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <Link href={`./products/${product.slug || product._id}`} className="flex items-center gap-3 group">
                                                    <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded bg-gray-200 relative group-hover:opacity-80 transition-opacity">
                                                        {product.images?.[0] && (
                                                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800 dark:text-white line-clamp-1 group-hover:text-brand-500 transition-colors">{product.name}</p>
                                                        <p className="text-xs text-gray-500">ID: {product._id.slice(-6)}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                                            {typeof product.category === 'object' ? product.category.name : 'Unknown'}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-xs text-nowrap">
                                            Created: {new Date().toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-800 dark:text-white">₹{product.finalPrice}</span>
                                                {product.appliedOffer > 0 ? (
                                                    <span className="text-xs text-green-500">-{product.appliedOffer}% applied</span>
                                                ) : product.price !== product.finalPrice && (
                                                    <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                                            {product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0}
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <Badge color={product.isActive ? "success" : "error"} size="sm">
                                                {product.isActive ? "Active" : "Hidden"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link href={`./products/edit/${product.slug || product._id}`} className="p-2 text-gray-400 hover:text-brand-500 transition-colors" title="Edit Product">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleToggleRequest(product)}
                                                    className={`p-2 transition-colors ${product.isActive ? 'text-gray-400 hover:text-amber-500' : 'text-gray-400 hover:text-green-500'}`}
                                                    title={product.isActive ? "Unlist Product" : "List Product"}
                                                >
                                                    {product.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-white/[0.05]">
                    <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={(p) => setFilters({ page: p })} />
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmToggle}
                title={productToToggle?.isActive ? "Unlist Product" : "List Product"}
                message={`Are you sure you want to ${productToToggle?.isActive ? 'unlist' : 'list'} "${productToToggle?.name}"? ${productToToggle?.isActive ? 'It will be hidden from the customer shop.' : 'It will be visible to customers again.'}`}
                confirmText={productToToggle?.isActive ? "Unlist" : "List"}
                type={productToToggle?.isActive ? "warning" : "success"}
                isLoading={actionLoading}
            />
        </div>
    );
}
