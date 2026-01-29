"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminCouponService } from "@/services/admin/adminCouponApiService";
import { adminCustomerService } from "@/services/admin/adminCustomerApiService";
import { createCouponSchema, type CreateCouponInput } from "@/validations/adminCoupon.validation";
import Button from "@/components/admin/ui/button/Button";
import Input from "@/components/admin/form/input/InputField";
import FormSelect from "@/components/admin/form/FormSelect";
import { ChevronLeft, Save, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { debounce } from "@/utils/debounce";

export default function CreateCouponPage() {
    const router = useRouter();
    const [userSearch, setUserSearch] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [searchingUsers, setSearchingUsers] = useState(false);

    const getDefaultDates = () => {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        now.setMinutes(0);
        const start = now.toISOString().slice(0, 16);

        const nextMonth = new Date(now);
        nextMonth.setDate(nextMonth.getDate() + 30);
        const end = nextMonth.toISOString().slice(0, 16);

        return { start, end };
    };

    const { start: defaultStart, end: defaultEnd } = getDefaultDates();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateCouponInput>({
        resolver: zodResolver(createCouponSchema),
        defaultValues: {
            code: "",
            description: "",
            discountType: "percentage",
            discountValue: 0,
            minOrderAmount: 0,
            maxDiscountAmount: 0,
            startDate: defaultStart,
            endDate: defaultEnd,
            usageLimit: 0,
            userLimit: 1,
            couponType: "all",
            specificUsers: [],
            registeredAfter: "",
            isActive: true
        }
    });

    const watchedDiscountType = watch("discountType");
    const watchedCouponType = watch("couponType");

    const onSubmit = async (values: CreateCouponInput) => {
        try {
            const couponData = {
                ...values,
                specificUsers: selectedUsers.map(u => u._id),
            };

            // Cleanup optional fields based on type
            if (values.discountType === 'fixed') {
                // @ts-ignore
                delete couponData.maxDiscountAmount;
            }
            if (values.couponType !== 'specific_users') {
                // @ts-ignore
                delete couponData.specificUsers;
            }
            if (values.couponType !== 'registered_after') {
                // @ts-ignore
                delete couponData.registeredAfter;
            }

            const res = await adminCouponService.create(couponData);
            if (res.success) {
                toast.success("Coupon created successfully!");
                router.push("/admin/coupons");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create coupon");
        }
    };

    const debouncedUserSearch = debounce(async (query: string) => {
        if (!query) {
            setSearchResults([]);
            return;
        }
        try {
            setSearchingUsers(true);
            const res = await adminCustomerService.searchUsers(query);
            if (res.success) {
                const users = res.data?.users || res.users || [];
                setSearchResults(users.filter((user: any) => !selectedUsers.find(u => u._id === user._id)));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSearchingUsers(false);
        }
    }, 500);

    useEffect(() => {
        debouncedUserSearch(userSearch);
        return () => debouncedUserSearch.cancel();
    }, [userSearch]);

    const addUser = (user: any) => {
        const newSelected = [...selectedUsers, user];
        setSelectedUsers(newSelected);
        setSearchResults([]);
        setUserSearch("");
        setValue('specificUsers', newSelected.map(u => u._id), { shouldValidate: true });
    };

    const removeUser = (userId: string) => {
        const newSelected = selectedUsers.filter(u => u._id !== userId);
        setSelectedUsers(newSelected);
        setValue('specificUsers', newSelected.map(u => u._id), { shouldValidate: true });
    };

    // Helper to hook register with custom onChange logic
    const registerWithTransform = (name: keyof CreateCouponInput, transformer: (val: string) => string) => {
        const { onChange, ...rest } = register(name);
        return {
            ...rest,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = transformer(e.target.value);
                onChange(e);
            }
        };
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto min-h-screen bg-transparent space-y-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight dark:text-white">Create New Coupon</h1>
                    <p className="text-sm text-gray-500 font-medium mt-1 uppercase tracking-widest">Setup a new discount campaign</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Info */}
                <div className="bg-white dark:bg-white/5 rounded-[40px] p-8 border border-gray-100 dark:border-white/10 shadow-sm space-y-6">
                    <h2 className="text-lg font-black uppercase tracking-tight dark:text-white mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Input
                                label="Coupon Code"
                                placeholder="e.g. SUMMER2024"
                                {...registerWithTransform("code", (val) => val.toUpperCase())}
                                error={errors.code?.message}
                                tooltip="The unique code customers will enter at checkout."
                            />
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Code will be auto-capitalized</p>
                        </div>
                        <Input
                            label="Description"
                            placeholder="Brief description of the offer"
                            {...register("description")}
                            error={errors.description?.message}
                            tooltip="Internal notes about what this coupon is for."
                        />
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <FormSelect
                                    label="Status"
                                    value={field.value ? "true" : "false"}
                                    onChange={(val) => field.onChange(val === "true")}
                                    options={[
                                        { value: "true", label: "Active" },
                                        { value: "false", label: "Inactive" }
                                    ]}
                                    tooltip="Active coupons can be used by customers immediately."
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Discount Rules */}
                <div className="bg-white dark:bg-white/5 rounded-[40px] p-8 border border-gray-100 dark:border-white/10 shadow-sm space-y-6">
                    <h2 className="text-lg font-black uppercase tracking-tight dark:text-white mb-4">Discount Rules</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Controller
                            name="discountType"
                            control={control}
                            render={({ field }) => (
                                <FormSelect
                                    label="Discount Type"
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={[
                                        { value: "percentage", label: "Percentage (%)" },
                                        { value: "fixed", label: "Fixed Amount (₹)" }
                                    ]}
                                    error={errors.discountType?.message}
                                    tooltip="Percentage off vs a flat currency amount."
                                />
                            )}
                        />
                        <Input
                            label="Discount Value"
                            type="number"
                            placeholder="0"
                            {...register("discountValue")}
                            error={errors.discountValue?.message}
                            tooltip="The amount or percentage to deduct."
                        />
                        {watchedDiscountType === 'percentage' && (
                            <Input
                                label="Max Discount Amount"
                                type="number"
                                placeholder="Leave empty for unlimited"
                                {...register("maxDiscountAmount")}
                                error={errors.maxDiscountAmount?.message}
                                tooltip="The maximum rupee amount a percentage discount can reach."
                            />
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <Input
                            label="Minimum Order Amount"
                            type="number"
                            placeholder="0"
                            {...register("minOrderAmount")}
                            error={errors.minOrderAmount?.message}
                            tooltip="Customers must spend at least this much to use the code."
                        />
                    </div>
                </div>

                {/* Scheduling & Limits */}
                <div className="bg-white dark:bg-white/5 rounded-[40px] p-8 border border-gray-100 dark:border-white/10 shadow-sm space-y-6">
                    <h2 className="text-lg font-black uppercase tracking-tight dark:text-white mb-4">Schedule & Limits</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Start Date & Time"
                            type="datetime-local"
                            {...register("startDate")}
                            error={errors.startDate?.message}
                            tooltip="The exact moment the coupon becomes valid."
                        />
                        <Input
                            label="End Date & Time"
                            type="datetime-local"
                            {...register("endDate")}
                            error={errors.endDate?.message}
                            tooltip="The moment the coupon expires."
                        />
                        <Input
                            label="Total Usage Limit"
                            type="number"
                            placeholder="0 for unlimited"
                            {...register("usageLimit")}
                            error={errors.usageLimit?.message}
                            tooltip="Total number of times this coupon can be used store-wide. Set to 0 for unlimited usage."
                        />
                        <Input
                            label="Limit Per User"
                            type="number"
                            placeholder="1"
                            {...register("userLimit")}
                            error={errors.userLimit?.message}
                            tooltip="How many times a single customer can use this code."
                        />
                    </div>
                </div>

                {/* Targeting */}
                <div className="bg-white dark:bg-white/5 rounded-[40px] p-8 border border-gray-100 dark:border-white/10 shadow-sm space-y-6">
                    <h2 className="text-lg font-black uppercase tracking-tight dark:text-white mb-4">Target Audience</h2>
                    <div className="space-y-6">
                        <Controller
                            name="couponType"
                            control={control}
                            render={({ field }) => (
                                <FormSelect
                                    label="Coupon Audience Type"
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={[
                                        { value: "all", label: "All Users" },
                                        { value: "new_users", label: "New Users Only" },
                                        { value: "registered_after", label: "Registered After Date" },
                                        { value: "specific_users", label: "Specific Users" }
                                    ]}
                                    error={errors.couponType?.message}
                                    tooltip="Restrict this coupon to a specific group of people."
                                />
                            )}
                        />

                        {watchedCouponType === 'registered_after' && (
                            <Input
                                label="Registration Date Cutoff"
                                type="date"
                                {...register("registeredAfter")}
                                error={errors.registeredAfter?.message}
                                tooltip="Only users who joined after this date can use the coupon."
                            />
                        )}

                        {watchedCouponType === 'specific_users' && (
                            <div className="space-y-4">
                                <div className="relative">
                                    <Input
                                        label="Search Users"
                                        placeholder="Type name or email..."
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                        tooltip="Search and select specific customers for this offer."
                                    />
                                    {searchingUsers && <Loader2 className="absolute right-4 top-[38px] animate-spin text-gray-400" size={16} />}

                                    {searchResults.length > 0 && (
                                        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl max-h-60 overflow-y-auto">
                                            {searchResults.map(user => (
                                                <div
                                                    key={user._id}
                                                    onClick={() => addUser(user)}
                                                    className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer border-b border-gray-50 dark:border-white/5 last:border-0 flex justify-between items-center"
                                                >
                                                    <div>
                                                        <p className="text-sm font-bold dark:text-white">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-sking-pink">Select</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {selectedUsers.length > 0 && (
                                    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                                        {selectedUsers.map(user => (
                                            <div key={user._id} className="bg-white dark:bg-gray-800 pl-3 pr-2 py-1 rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-2 shadow-sm">
                                                <span className="text-xs font-bold dark:text-white">{user.name}</span>
                                                <button type="button" onClick={() => removeUser(user._id)} className="text-red-500 hover:text-red-700">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.specificUsers && (
                                    <div className="text-red-500 text-xs font-bold mt-1 uppercase tracking-wider">{errors.specificUsers.message}</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    variant="primary"
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full py-4 text-sm font-black uppercase tracking-widest shadow-xl shadow-sking-pink/20 hover:shadow-sking-pink/40"
                >
                    <Save size={18} className="mr-2" /> Create Coupon
                </Button>
            </form>
        </div>
    );
}
