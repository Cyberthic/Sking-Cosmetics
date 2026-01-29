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
} from "../../../../../components/admin/ui/table";
import Badge from "../../../../../components/admin/ui/badge/Badge";
import { adminCustomerService } from "../../../../../services/admin/adminCustomerApiService";
import Pagination from "../../../../../components/admin/tables/Pagination";
import Image from "next/image";
import { Search, Filter, ArrowUpDown, User, MoreHorizontal, Eye, Ban, CheckCircle } from "lucide-react";
import Button from "@/components/admin/ui/button/Button";
import FormSelect from "@/components/admin/form/FormSelect";

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
        search: "",
        status: "",
        sortBy: "newest"
    });

    const [activeTab, setActiveTab] = useState<'all' | 'active' | 'banned'>('all');

    const fetchUsers = useCallback(async (currentFilters: any) => {
        try {
            setLoading(true);
            const statusFilter = activeTab === 'all' ? '' : activeTab;
            const data = await adminCustomerService.getAllUsers(
                currentFilters.page,
                limit,
                currentFilters.search,
                statusFilter,
                currentFilters.sortBy
            );
            if (data.success) {
                setUsers(data.data.users);
                setTotalPages(Math.ceil(data.data.total / limit));
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    }, [limit, activeTab]);

    useEffect(() => {
        fetchUsers(filters);
    }, [filters, fetchUsers, activeTab]);

    const handleSearch = useMemo(() =>
        debounce((val: string) => {
            setFilters({ search: val, page: 1 });
        }, 500)
        , [setFilters]);

    const tabs = [
        { id: 'all', label: 'All Customers' },
        { id: 'active', label: 'Active' },
        { id: 'banned', label: 'Banned' },
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Customer Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Manage and view your customer base</p>
                </div>
                <Link href="/admin/customers/create">
                    {/* Optional: Add user button if needed, but usually users register themselves */}
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-white/[0.03] p-6 rounded-3xl border border-gray-100 dark:border-white/[0.05] shadow-sm flex flex-col lg:flex-row gap-6">
                <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl w-fit h-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as any);
                                setFilters({ page: 1 });
                            }}
                            className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === tab.id
                                ? "bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm"
                                : "text-gray-500 hover:text-black dark:hover:text-white"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-4 items-center flex-grow w-full">
                    <div className="flex-grow w-full">
                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-sking-pink transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="SEARCH CUSTOMERS..."
                                defaultValue={filters.search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-14 pr-4 py-3.5 bg-gray-50 dark:bg-black/20 border-none rounded-2xl focus:ring-2 focus:ring-sking-pink/50 text-sm font-bold uppercase tracking-wide transition-all text-gray-800 dark:text-white placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                    <div className="w-full lg:w-64">
                        <FormSelect
                            value={filters.sortBy}
                            onChange={(value) => setFilters({ sortBy: value })}
                            options={[
                                { value: "newest", label: "Newest First" },
                                { value: "oldest", label: "Oldest First" },
                                { value: "a-z", label: "Name A-Z" },
                                { value: "z-a", label: "Name Z-A" }
                            ]}
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.02]">
                            <TableRow>
                                <TableCell isHeader className="px-8 py-4 font-black text-gray-400 text-start text-[10px] uppercase tracking-widest">User Details</TableCell>
                                <TableCell isHeader className="px-8 py-4 font-black text-gray-400 text-start text-[10px] uppercase tracking-widest">Contact Info</TableCell>
                                <TableCell isHeader className="px-8 py-4 font-black text-gray-400 text-start text-[10px] uppercase tracking-widest">Status</TableCell>
                                <TableCell isHeader className="px-8 py-4 font-black text-gray-400 text-start text-[10px] uppercase tracking-widest">Joined</TableCell>
                                <TableCell isHeader className="px-8 py-4 font-black text-gray-400 text-end text-[10px] uppercase tracking-widest">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin mb-4" />
                                            <p className="text-xs font-medium uppercase tracking-widest">Loading Customers...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <User size={48} strokeWidth={1} className="mb-4 opacity-20" />
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">No customers found</p>
                                            <p className="text-xs mt-1">Try adjusting your filters or search terms</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                        <TableCell className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 dark:border-gray-700 relative">
                                                    {user.profilePicture ? (
                                                        <Image src={user.profilePicture} alt={user.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full text-gray-400 font-black text-lg bg-gray-50">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="block font-bold text-gray-900 dark:text-white text-sm">{user.name}</span>
                                                    <span className="block text-gray-400 text-[10px] uppercase tracking-wider font-medium mt-0.5">@{user.username}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-4">
                                            <div className="space-y-1">
                                                <div className="text-xs font-medium text-gray-600 dark:text-gray-300">{user.email}</div>
                                                <div className="text-[10px] font-mono text-gray-400">{user.phoneNumber || "-"}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-4">
                                            {user.isBanned ? (
                                                <Badge size="sm" color="error" className="uppercase tracking-widest text-[9px] font-black">Banned</Badge>
                                            ) : (
                                                <Badge size="sm" color="success" className="uppercase tracking-widest text-[9px] font-black">Active</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-8 py-4">
                                            <div className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-[10px] text-gray-400 mt-0.5">
                                                {new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-4 text-end">
                                            <Link href={`/admin/customers/${user._id}`}>
                                                <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    View Profile
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.02]">
                    <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={(p) => setFilters({ page: p })} />
                </div>
            </div>
        </div>
    );
}
