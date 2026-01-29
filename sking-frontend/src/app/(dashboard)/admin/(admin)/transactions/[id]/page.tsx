"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminTransactionService } from "@/services/admin/adminTransactionApiService";
import Button from "@/components/admin/ui/button/Button";
import Badge from "@/components/admin/ui/badge/Badge";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, User, Package, Calendar, CreditCard, DollarSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function TransactionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [transaction, setTransaction] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchTransaction();
        }
    }, [id]);

    const fetchTransaction = async () => {
        try {
            const res = await adminTransactionService.getTransactionById(id);
            if (res.success) {
                setTransaction(res.transaction);
            }
        } catch (error) {
            toast.error("Failed to fetch transaction details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
        </div>
    );

    if (!transaction) return <div className="p-10 text-center font-bold text-gray-500">Transaction not found</div>;

    const isCredit = transaction.type === 'credit';

    return (
        <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto min-h-screen space-y-8">
            <Button
                variant="outline"
                onClick={() => router.back()}
                className="mb-4 text-xs font-black uppercase tracking-widest gap-2 flex items-center pr-6 pl-4 border-none bg-white dark:bg-white/5 shadow-sm hover:bg-gray-50"
            >
                <ArrowLeft size={14} /> Back to List
            </Button>

            {/* Main Receipt Card */}
            <div className="bg-white dark:bg-white/5 rounded-[40px] overflow-hidden border border-gray-100 dark:border-white/10 shadow-2xl shadow-gray-200/50 dark:shadow-none relative">
                <div className={`h-2 w-full ${isCredit ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="p-10 md:p-16 flex flex-col items-center justify-center text-center space-y-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isCredit ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {isCredit ? <ArrowUpRight size={40} /> : <ArrowDownLeft size={40} />}
                    </div>

                    <div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white mb-2">
                            ₹{transaction.amount.toLocaleString()}
                        </h1>
                        <Badge color={transaction.status === 'completed' ? 'success' : transaction.status === 'pending' ? 'warning' : 'error'} size="lg" className="uppercase tracking-widest text-xs font-black">
                            {transaction.status}
                        </Badge>
                    </div>

                    <div className="flex flex-col gap-1 text-gray-500">
                        <span className="text-xs font-bold uppercase tracking-widest">Transaction ID</span>
                        <span className="font-mono text-lg font-bold text-black dark:text-gray-200">{transaction.transactionId}</span>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="bg-gray-50 dark:bg-black/20 p-10 md:p-16 border-t border-gray-100 dark:border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Left Column: Context */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                    <User size={14} /> User Details
                                </h3>
                                {transaction.user ? (
                                    <Link href={`/admin/customers/${transaction.user._id}`} className="flex items-center gap-4 group hover:bg-white dark:hover:bg-white/5 p-4 -ml-4 rounded-2xl transition-all cursor-pointer">
                                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative border-2 border-white dark:border-white/10 group-hover:border-sking-pink transition-colors">
                                            {transaction.user.profilePicture ? (
                                                <Image src={transaction.user.profilePicture} alt={transaction.user.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold">{transaction.user.name?.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white group-hover:text-sking-pink transition-colors">{transaction.user.name}</div>
                                            <div className="text-xs text-gray-500">{transaction.user.email}</div>
                                            <div className="text-xs text-blue-500 font-bold uppercase tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-opacity">View Profile &rarr;</div>
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="text-sm text-gray-500 italic">User not available</div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                    <Package size={14} /> Related Order
                                </h3>
                                {transaction.order ? (
                                    <Link href={`/admin/orders/${transaction.order._id}`} className="block group hover:bg-white dark:hover:bg-white/5 p-4 -ml-4 rounded-2xl transition-all cursor-pointer">
                                        <div className="font-mono text-sm font-bold mb-1">Order #{transaction.order._id.slice(-6).toUpperCase()}</div>
                                        <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                                            <span>{transaction.order.items?.length || 0} items</span>
                                            <span className="font-bold text-black dark:text-white">₹{transaction.order.finalAmount?.toLocaleString()}</span>
                                        </div>
                                        <div className="text-xs text-blue-500 font-bold uppercase tracking-wider mt-2 opacity-0 group-hover:opacity-100 transition-opacity">View Order &rarr;</div>
                                    </Link>
                                ) : (
                                    <div className="text-sm text-gray-400 font-medium">No order linked to this transaction.</div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Meta */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                    <CreditCard size={14} /> Payment Details
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-white/10">
                                        <span className="text-sm font-bold text-gray-500">Method</span>
                                        <span className="text-sm font-black uppercase">{transaction.paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-white/10">
                                        <span className="text-sm font-bold text-gray-500">Type</span>
                                        <span className={`text-sm font-black uppercase ${isCredit ? 'text-green-500' : 'text-red-500'}`}>{transaction.type}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-white/10">
                                        <span className="text-sm font-bold text-gray-500">Description</span>
                                        <span className="text-sm font-medium text-right max-w-[200px] truncate" title={transaction.description}>{transaction.description || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                    <Calendar size={14} /> Timeline
                                </h3>
                                <div className="flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-black dark:bg-white mt-1.5"></div>
                                        <div className="w-[1px] h-12 bg-gray-200 dark:bg-white/10"></div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-black dark:text-white">Created</div>
                                        <div className="text-xs text-gray-500">{new Date(transaction.createdAt).toLocaleDateString()} at {new Date(transaction.createdAt).toLocaleTimeString()}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-2 h-2 rounded-full mt-1.5 ${transaction.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-black dark:text-white capitalize">{transaction.status}</div>
                                        <div className="text-xs text-gray-500">Current Status</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
