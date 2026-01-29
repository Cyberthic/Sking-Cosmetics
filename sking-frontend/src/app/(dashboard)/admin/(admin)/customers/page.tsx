"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useUrlState } from "@/hooks/useUrlState";
import { debounce } from "@/utils/debounce";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../../../components/admin/ui/table"; // Adjusted path
import Badge from "../../../../../components/admin/ui/badge/Badge"; // Adjusted path
import { adminCustomerService } from "../../../../../services/admin/adminCustomerApiService";
import Pagination from "../../../../../components/admin/tables/Pagination";
import Image from "next/image";

interface IUser {
    _id: string;
    username: string;
    email: string;
    name: string;
    profilePicture?: string;
    isActive: boolean;
    isBanned: boolean;
    createdAt: string;
    phoneNumber?: string;
}

export default function CustomersPage() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;
    const [filters, setFilters] = useUrlState({
        page: 1,
        search: ""
    });

    const fetchUsers = useCallback(async (currentFilters: any) => {
        try {
            setLoading(true);
            const data = await adminCustomerService.getAllUsers(currentFilters.page, limit, currentFilters.search);
            if (data.success) {
                setUsers(data.data.users);
                setTotalPages(Math.ceil(data.data.total / limit));
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchUsers(filters);
    }, [filters, fetchUsers]);

    const handleSearch = useMemo(() =>
        debounce((val: string) => {
            setFilters({ search: val, page: 1 });
        }, 500)
        , [setFilters]);

    if (loading && users.length === 0 && !filters.search) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Customer Management</h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                        defaultValue={filters.search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <svg
                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" x2="16.65" y1="21" y2="16.65" />
                    </svg>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1000px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">User</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Email</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Phone</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Status</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Joined Date</TableCell>
                                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Actions</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                                            No customers found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-200">
                                                        {user.profilePicture ? (
                                                            <Image src={user.profilePicture} alt={user.name} width={40} height={40} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="flex items-center justify-center w-full h-full text-gray-500">{user.name.charAt(0)}</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">{user.name}</span>
                                                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">{user.username}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{user.email}</TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{user.phoneNumber || "-"}</TableCell>
                                            <TableCell className="px-4 py-3">
                                                {user.isBanned ? (
                                                    <Badge size="sm" color="error">Banned</Badge>
                                                ) : (
                                                    <Badge size="sm" color="success">Active</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                <Link href={`/admin/customers/${user._id}`} className="text-brand-500 hover:text-brand-600">
                                                    View Details
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-white/[0.05]">
                    <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={(p) => setFilters({ page: p })} />
                </div>
            </div>
        </div>
    );
}
