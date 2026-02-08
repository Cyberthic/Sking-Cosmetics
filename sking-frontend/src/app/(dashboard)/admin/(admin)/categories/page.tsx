"use client";

import React, { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { debounce } from "@/utils/debounce";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../../../components/admin/ui/table";
import Badge from "../../../../../components/admin/ui/badge/Badge";
import { adminCategoryService } from "../../../../../services/admin/adminCategoryApiService";
import Pagination from "../../../../../components/admin/tables/Pagination";
import Button from "../../../../../components/admin/ui/button/Button";
import { CategoryModal } from "../../../../../components/admin/categories/CategoryModal";

interface ICategory {
    _id: string;
    name: string;
    description: string;
    offer: number;
    isActive: boolean;
    createdAt: string;
}

function CategoriesContent() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const [filters, setFilters] = useUrlState({
        page: 1,
        search: ""
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchCategories = useCallback(async (currentFilters: any) => {
        try {
            setLoading(true);
            const data = await adminCategoryService.getCategories(currentFilters.page, limit, currentFilters.search);
            if (data.success) {
                setCategories(data.categories);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchCategories(filters);
    }, [filters, fetchCategories]);

    const handleSearch = useMemo(() =>
        debounce((val: string) => {
            setFilters({ search: val, page: 1 });
        }, 500)
        , [setFilters]);

    const handleAddCategory = async (data: { name: string; description: string }) => {
        try {
            await adminCategoryService.createCategory(data);
            fetchCategories(filters);
        } catch (error) {
            console.error("Failed to create category", error);
            alert("Failed to create category");
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Category Management</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                            defaultValue={filters.search}
                            onChange={(e) => handleSearch(e.target.value)}
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
                    <Button onClick={() => setIsAddModalOpen(true)}>Add New Category</Button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Name</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Description</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Offer</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Status</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start dark:text-gray-400">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {loading && categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="px-5 py-4 text-center">Loading...</TableCell>
                                </TableRow>
                            ) : categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="px-5 py-4 text-center">No categories found.</TableCell>
                                </TableRow>
                            ) : (
                                categories.map((cat) => (
                                    <TableRow key={cat._id}>
                                        <TableCell className="px-5 py-4 text-gray-800 dark:text-white font-medium">{cat.name}</TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 dark:text-gray-400 truncate max-w-xs">{cat.description}</TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 dark:text-gray-400">{cat.offer}%</TableCell>
                                        <TableCell className="px-5 py-4">
                                            <Badge color={cat.isActive ? "success" : "error"} size="sm">
                                                {cat.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <Link href={`./categories/${cat._id}`} className="text-brand-500 hover:text-brand-600 font-medium">
                                                View Details
                                            </Link>
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

            <CategoryModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddCategory}
                title="Add New Category"
            />
        </div>
    );
}

export default function CategoriesPage() {
    return (
        <Suspense fallback={<div className="p-6 text-center">Loading Categories...</div>}>
            <CategoriesContent />
        </Suspense>
    );
}
