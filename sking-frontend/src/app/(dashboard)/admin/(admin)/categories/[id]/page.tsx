"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminCategoryService } from "../../../../../../services/admin/adminCategoryApiService";
import { adminProductService } from "../../../../../../services/admin/adminProductApiService";
import Button from "../../../../../../components/admin/ui/button/Button";
import { CategoryModal } from "../../../../../../components/admin/categories/CategoryModal";
import { OfferModal } from "../../../../../../components/admin/categories/OfferModal";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../../../../components/admin/ui/table";
import Badge from "../../../../../../components/admin/ui/badge/Badge";
import Pagination from "../../../../../../components/admin/tables/Pagination";
import Link from "next/link"; // For product edit
import Image from "next/image";

export default function CategoryDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [category, setCategory] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loadingCat, setLoadingCat] = useState(true);
    const [loadingProd, setLoadingProd] = useState(true);

    // Modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

    // Products Pagination & Search
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [productSearch, setProductSearch] = useState("");
    const limit = 10;

    const fetchCategory = async () => {
        try {
            setLoadingCat(true);
            const data = await adminCategoryService.getCategoryById(id);
            if (data.success) {
                setCategory(data.category);
            }
        } catch (error) {
            console.error("Failed to fetch category", error);
        } finally {
            setLoadingCat(false);
        }
    };

    const fetchProducts = async (page: number, search: string) => {
        try {
            setLoadingProd(true);
            const data = await adminProductService.getProducts(page, limit, search, id);
            if (data.success) {
                setProducts(data.products);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoadingProd(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchCategory();
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            const delay = setTimeout(() => {
                fetchProducts(currentPage, productSearch);
            }, 500);
            return () => clearTimeout(delay);
        }
    }, [id, currentPage, productSearch]);

    const handleEditCategory = async (data: { name: string; description: string }) => {
        try {
            await adminCategoryService.updateCategory(id, data);
            fetchCategory();
        } catch (error) {
            console.error("Failed to update category", error);
        }
    };

    const handleAddOffer = async (offer: number) => {
        try {
            await adminCategoryService.updateCategory(id, { offer });
            fetchCategory();
            // Refresh products as their prices depend on category offer
            fetchProducts(currentPage, productSearch);
        } catch (error) {
            console.error("Failed to update offer", error);
        }
    };

    if (loadingCat) return <div className="p-6">Loading Category...</div>;
    if (!category) return <div className="p-6">Category not found</div>;

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{category.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">{category.description || "No description provided."}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>Edit Details</Button>
                        <Button variant="primary" onClick={() => setIsOfferModalOpen(true)}>
                            {category.offer > 0 ? `Offer: ${category.offer}%` : "Add Offer"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Products in {category.name}</h2>
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-64">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                            value={productSearch}
                            onChange={(e) => {
                                setProductSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Product</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Base Price</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Final Price</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Stock</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Status</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {loadingProd ? (
                                    <TableRow><TableCell colSpan={6} className="text-center py-4">Loading Products...</TableCell></TableRow>
                                ) : products.length === 0 ? (
                                    <TableRow><TableCell colSpan={6} className="text-center py-4">No products found in this category.</TableCell></TableRow>
                                ) : (
                                    products.map(product => (
                                        <TableRow key={product._id}>
                                            <TableCell className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 overflow-hidden rounded bg-gray-200">
                                                        {product.images?.[0] && (
                                                            <Image src={product.images[0]} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800 dark:text-white">{product.name}</p>
                                                        {product.variants?.length > 0 && (
                                                            <p className="text-xs text-gray-500">{product.variants.length} Variants</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">${product.price}</TableCell>
                                            <TableCell className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                                                ${product.finalPrice}
                                                {product.appliedOffer > 0 && (
                                                    <span className="ml-2 text-xs text-green-500">(-{product.appliedOffer}%)</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                                                {product.variants.reduce((acc: number, v: any) => acc + v.stock, 0)}
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <Badge color={product.isActive ? "success" : "error"} size="sm">{product.isActive ? "Active" : "Hidden"}</Badge>
                                            </TableCell>
                                            <TableCell className="px-5 py-4">
                                                <Link href={`/admin/products/edit/${product._id}`} className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300">
                                                    Edit
                                                </Link>
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

            <CategoryModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleEditCategory}
                initialData={category}
                title="Edit Category"
            />

            <OfferModal
                isOpen={isOfferModalOpen}
                onClose={() => setIsOfferModalOpen(false)}
                onSave={handleAddOffer}
                currentOffer={category.offer}
            />
        </div>
    );
}
