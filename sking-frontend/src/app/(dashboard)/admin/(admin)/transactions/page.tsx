"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUrlState } from "@/hooks/useUrlState";
import { debounce } from "@/utils/debounce";
import { adminTransactionService } from "@/services/admin/adminTransactionApiService";
import Button from "@/components/admin/ui/button/Button";
import FormSelect from "@/components/admin/form/FormSelect";
import Badge from "@/components/admin/ui/badge/Badge";
import Pagination from "@/components/admin/tables/Pagination";
import { Search, ArrowRightLeft, ArrowUpRight, ArrowDownLeft, Eye, CreditCard, DollarSign } from "lucide-react";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/admin/ui/table";
import Link from "next/link";
import Image from "next/image";

export default function TransactionsPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // URL Persistence for Filters
    const [filters, setFilters] = useUrlState({
        page: 1,
        search: "",
        status: "",
        type: "",
        sort: "createdAt:desc"
    });
    const [totalPages, setTotalPages] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);

    const fetchTransactions = useCallback(async (currentFilters: any) => {
        try {
            setLoading(true);
            const res = await adminTransactionService.getTransactions({
                ...currentFilters,
                limit: 10
            });
            if (res.success) {
                setTransactions(res.transactions);
                setTotalPages(res.totalPages);
                setTotalTransactions(res.total);
            }
        } catch (error) {
            toast.error("Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions(filters);
    }, [filters, fetchTransactions]);

    const handleSearch = useMemo(() =>
        debounce((val: string) => {
            setFilters({ search: val, page: 1 });
        }, 500)
        , [setFilters]);

    const getStatusColor = (status: string): "error" | "warning" | "success" | "info" => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'error';
            case 'refunded': return 'info';
            default: return 'warning';
        }
    };

    const getTypeColor = (type: string) => {
        return type === 'credit' ? 'text-green-500' : 'text-red-500';
    };

    const getTypeIcon = (type: string) => {
        return type === 'credit' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen bg-transparent space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight dark:text-white flex items-center gap-3">
                        <ArrowRightLeft className="w-8 h-8 text-sking-pink" />
                        Transactions
                    </h1>
                    <p className="text-sm text-gray-500 font-medium mt-1 uppercase tracking-widest">
                        Tracking {totalTransactions} financial records
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-white/5 rounded-[30px] p-6 border border-gray-100 dark:border-white/10 shadow-sm flex flex-col lg:flex-row gap-4">
                <div className="flex-grow">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-sking-pink transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="SEARCH TRANSACTION ID..."
                            defaultValue={filters.search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-black/50 border-none rounded-2xl focus:ring-2 focus:ring-sking-pink/50 text-sm font-bold uppercase tracking-wide transition-all"
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <FormSelect
                        value={filters.status}
                        onChange={(value) => setFilters({ ...filters, status: value, page: 1 })}
                        options={[
                            { value: "", label: "All Status" },
                            { value: "completed", label: "Completed" },
                            { value: "pending", label: "Pending" },
                            { value: "failed", label: "Failed" },
                            { value: "refunded", label: "Refunded" }
                        ]}
                        className="min-w-[150px]"
                    />
                    <FormSelect
                        value={filters.type}
                        onChange={(value) => setFilters({ ...filters, type: value, page: 1 })}
                        options={[
                            { value: "", label: "All Types" },
                            { value: "credit", label: "Credit" },
                            { value: "debit", label: "Debit" }
                        ]}
                        className="min-w-[150px]"
                    />
                    <FormSelect
                        value={filters.sort}
                        onChange={(value) => setFilters({ ...filters, sort: value })}
                        options={[
                            { value: "createdAt:desc", label: "Newest First" },
                            { value: "createdAt:asc", label: "Oldest First" },
                            { value: "amount:desc", label: "Highest Amount" },
                            { value: "amount:asc", label: "Lowest Amount" }
                        ]}
                        className="min-w-[150px]"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-white/5 rounded-[30px] p-8 border border-gray-100 dark:border-white/10 shadow-sm min-h-[500px]">
                {loading ? (
                    <div className="flex items-center justify-center h-full min-h-[400px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sking-pink"></div>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <ArrowRightLeft size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight dark:text-white">No transactions found</h3>
                    </div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Transaction ID</TableCell>
                                    <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">User</TableCell>
                                    <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Amount</TableCell>
                                    <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Type</TableCell>
                                    <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Status</TableCell>
                                    <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Date</TableCell>
                                    <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400 text-right">Action</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((transaction) => (
                                    <TableRow key={transaction._id}>
                                        <TableCell className="font-mono text-xs font-bold dark:text-gray-300">
                                            {transaction.transactionId}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                                                    {transaction.user?.profilePicture ? (
                                                        <Image
                                                            src={transaction.user.profilePicture}
                                                            alt={transaction.user.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">
                                                            {transaction.user?.name?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold dark:text-white">{transaction.user?.name || 'Unknown User'}</span>
                                                    <span className="text-[10px] text-gray-500">{transaction.user?.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm font-black dark:text-white">
                                            ₹{transaction.amount?.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className={`flex items-center gap-1 text-xs font-black uppercase tracking-wider ${getTypeColor(transaction.type)}`}>
                                                {getTypeIcon(transaction.type)}
                                                {transaction.type}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge color={getStatusColor(transaction.status)} size="sm" className="uppercase font-bold tracking-wider text-[10px]">
                                                {transaction.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs font-bold text-gray-500">
                                            {new Date(transaction.createdAt).toLocaleDateString()}
                                            <div className="text-[10px] font-normal opacity-70">
                                                {new Date(transaction.createdAt).toLocaleTimeString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin/transactions/${transaction._id}`}>
                                                <Button size="sm" variant="ghost" className="hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
                                                    <Eye size={16} />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={filters.page}
                            totalPages={totalPages}
                            onPageChange={(page: number) => setFilters({ page })}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
