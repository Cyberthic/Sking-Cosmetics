"use client";

import React, { useEffect, useState } from "react";
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

interface IProduct {
    _id: string;
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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const fetchProducts = async (page: number, search: string, catId: string) => {
        try {
            setLoading(true);
            const data = await adminProductService.getProducts(page, limit, search, catId);
            if (data.success) {
                setProducts(data.products);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

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
        const delay = setTimeout(() => {
            fetchProducts(currentPage, searchTerm, selectedCategory);
        }, 500);
        return () => clearTimeout(delay);
    }, [searchTerm, currentPage, selectedCategory]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await adminProductService.deleteProduct(id);
            fetchProducts(currentPage, searchTerm, selectedCategory);
        } catch (error) {
            console.error("Failed to delete product", error);
            alert("Failed to delete product");
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Product Management</h1>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        <svg
                            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Category Filter */}
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>

                    <Button href="/admin/products/add">
                        Add New Product
                    </Button>
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
                                                <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded bg-gray-200 relative">
                                                    {product.images?.[0] && (
                                                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-white line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-gray-500">ID: {product._id.slice(-6)}</p>
                                                </div>
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
                                                <Link href={`./products/edit/${product._id}`} className="p-2 text-gray-500 hover:text-brand-500 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </Link>
                                                <button onClick={() => handleDelete(product._id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
            </div>
        </div>
    );
}
