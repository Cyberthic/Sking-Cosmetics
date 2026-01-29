"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUrlState } from "@/hooks/useUrlState";
import { debounce } from "@/utils/debounce";
import { adminCouponService } from "@/services/admin/adminCouponApiService";
import Button from "@/components/admin/ui/button/Button";
import Input from "@/components/admin/form/input/InputField";
import FormSelect from "@/components/admin/form/FormSelect";
import Badge from "@/components/admin/ui/badge/Badge";
import Pagination from "@/components/admin/tables/Pagination";
import { Plus, Search, Filter, Ticket, Trash2, Edit2, Copy, BarChart3, Users, Clock } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import SkingSwitch from "@/components/admin/form/switch/SkingSwitch";

export default function CouponsPage() {
    const router = useRouter();
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // URL Persistence for Filters
    const [filters, setFilters] = useUrlState({
        page: 1,
        search: "",
        status: "",
        sort: "createdAt:desc"
    });
    const [totalPages, setTotalPages] = useState(1);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [toggleCoupon, setToggleCoupon] = useState<any>(null);

    const fetchCoupons = useCallback(async (currentFilters: any) => {
        try {
            setLoading(true);
            const res = await adminCouponService.getCoupons({
                ...currentFilters,
                limit: 9
            });
            if (res.success) {
                setCoupons(res.coupons);
                setTotalPages(res.totalPages);
            }
        } catch (error) {
            toast.error("Failed to fetch coupons");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCoupons(filters);
    }, [filters, fetchCoupons]);

    const handleSearch = useMemo(() =>
        debounce((val: string) => {
            setFilters({ search: val, page: 1 });
        }, 500)
        , [setFilters]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await adminCouponService.delete(deleteId);
            toast.success("Coupon deleted successfully");
            fetchCoupons(filters);
            setDeleteId(null);
        } catch (error) {
            toast.error("Failed to delete coupon");
        }
    };

    const handleToggleStatus = async () => {
        if (!toggleCoupon) return;
        try {
            await adminCouponService.update(toggleCoupon._id, { isActive: !toggleCoupon.isActive });
            toast.success(`Coupon ${!toggleCoupon.isActive ? 'activated' : 'deactivated'} successfully`);
            fetchCoupons(filters);
            setToggleCoupon(null);
        } catch (error) {
            toast.error("Failed to update coupon status");
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success("Coupon code copied!");
    };

    const getStatusColor = (coupon: any): "error" | "warning" | "light" | "success" => {
        const now = new Date();
        const start = new Date(coupon.startDate);
        const end = new Date(coupon.endDate);

        if (!coupon.isActive) return 'error';
        if (now < start) return 'warning';
        if (now > end) return 'light';
        return 'success';
    };

    const getStatusText = (coupon: any) => {
        const now = new Date();
        const start = new Date(coupon.startDate);
        const end = new Date(coupon.endDate);

        if (!coupon.isActive) return 'Inactive';
        if (now < start) return 'Scheduled';
        if (now > end) return 'Expired';
        return 'Active';
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen bg-transparent space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight dark:text-white flex items-center gap-3">
                        <Ticket className="w-8 h-8 text-sking-pink" />
                        Coupons
                    </h1>
                    <p className="text-sm text-gray-500 font-medium mt-1 uppercase tracking-widest">Manage discounts & promotions</p>
                </div>
                <Button
                    onClick={() => router.push("/admin/coupons/create")}
                    className="flex items-center gap-2 shadow-xl shadow-sking-pink/20 hover:shadow-sking-pink/40 transition-all font-black uppercase tracking-widest text-xs"
                >
                    <Plus size={16} /> Create Coupon
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-white/5 rounded-[30px] p-6 border border-gray-100 dark:border-white/10 shadow-sm flex flex-col lg:flex-row gap-4">
                <div className="flex-grow">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-sking-pink transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="SEARCH COUPONS..."
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
                            { value: "active", label: "Active Now" },
                            { value: "upcoming", label: "Scheduled" },
                            { value: "ended", label: "Ended/Expired" }
                        ]}
                        className="min-w-[180px]"
                    />
                    <FormSelect
                        value={filters.sort}
                        onChange={(value) => setFilters({ ...filters, sort: value })}
                        options={[
                            { value: "createdAt:desc", label: "Newest First" },
                            { value: "createdAt:asc", label: "Oldest First" },
                            { value: "endDate:asc", label: "Expiring Soon" },
                            { value: "usageCount:desc", label: "Most Used" }
                        ]}
                        className="min-w-[180px]"
                    />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sking-pink"></div>
                </div>
            ) : coupons.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Ticket size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight dark:text-white">No coupons found</h3>
                    <p className="text-gray-500 font-medium">Create your first coupon to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map((coupon) => (
                        <div key={coupon._id} className="group relative bg-white dark:bg-white/5 rounded-[35px] p-6 border border-gray-100 dark:border-white/10 hover:border-sking-pink/50 transition-all duration-300 hover:shadow-2xl hover:shadow-sking-pink/5 flex flex-col overflow-hidden">
                            {/* Decorative Background Pattern */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sking-pink/10 to-transparent rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700 pointer-events-none" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div
                                        onClick={() => copyCode(coupon.code)}
                                        className="bg-black/5 dark:bg-white/10 px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-black/10 dark:hover:bg-white/20 transition-colors group/code"
                                    >
                                        <span className="font-black text-lg uppercase tracking-wider font-mono">{coupon.code}</span>
                                        <Copy size={14} className="text-gray-400 group-hover/code:text-black dark:group-hover/code:text-white" />
                                    </div>
                                    <Badge color={getStatusColor(coupon)} size="sm" className="bg-white dark:bg-black text-[10px] uppercase font-black tracking-widest">
                                        {getStatusText(coupon)}
                                    </Badge>
                                </div>

                                <div className="space-y-4 mb-6 flex-grow">
                                    <div>
                                        <h3 className="font-bold text-gray-500 text-[10px] uppercase tracking-widest mb-1">Discount</h3>
                                        <p className="text-2xl font-black dark:text-white">
                                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                        </p>
                                        {coupon.discountType === 'percentage' && coupon.maxDiscountAmount && (
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Up to ₹{coupon.maxDiscountAmount}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-bold text-gray-500 text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1"><Users size={10} /> Usage</h4>
                                            <p className="font-black dark:text-white text-sm">
                                                {coupon.usageCount} / {coupon.usageLimit === 0 ? '∞' : coupon.usageLimit}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-500 text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1"><Clock size={10} /> Expires</h4>
                                            <p className="font-black dark:text-white text-sm truncate">
                                                {new Date(coupon.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-4 mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <SkingSwitch
                                            checked={coupon.isActive}
                                            onChange={() => setToggleCoupon(coupon)}
                                        />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <button
                                            onClick={() => router.push(`/admin/coupons/${coupon._id}`)}
                                            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center justify-center"
                                            title="View Analysis"
                                        >
                                            <BarChart3 size={14} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => router.push(`/admin/coupons/edit/${coupon._id}`)}
                                            className="flex-grow flex items-center justify-center gap-2 px-6 h-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black uppercase text-[10px] tracking-widest hover:bg-sking-pink dark:hover:bg-sking-pink dark:hover:text-white transition-all"
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(coupon._id)}
                                            className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={filters.page}
                    totalPages={totalPages}
                    onPageChange={(page: number) => setFilters({ page })}
                />
            )}

            <ConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Coupon"
                message="Are you sure you want to delete this coupon? This action cannot be undone."
                confirmText="Delete Coupon"
                type="danger"
            />

            <ConfirmationModal
                isOpen={!!toggleCoupon}
                onClose={() => setToggleCoupon(null)}
                onConfirm={handleToggleStatus}
                title={toggleCoupon?.isActive ? "Deactivate Coupon" : "Activate Coupon"}
                message={`Are you sure you want to ${toggleCoupon?.isActive ? "deactivate" : "activate"} this coupon?`}
                confirmText={toggleCoupon?.isActive ? "Deactivate" : "Activate"}
                type={toggleCoupon?.isActive ? "warning" : "success"}
            />
        </div>
    );
}
