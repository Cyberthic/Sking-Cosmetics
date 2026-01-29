"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { User, Package, MapPin, Wallet, ShoppingBag, Tag, CreditCard, Calendar, Mail, Phone, Clock, ArrowRight, Ban, CheckCircle } from "lucide-react";
import { adminCustomerService } from "../../../../../../services/admin/adminCustomerApiService";
import Badge from "../../../../../../components/admin/ui/badge/Badge";
import { ConfirmationModal } from "../../../../../../components/common/ConfirmationModal";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../../../../components/admin/ui/table";

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        type: 'danger' | 'warning' | 'info';
        confirmText: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        type: 'info',
        confirmText: 'Confirm'
    });

    const [activeTab, setActiveTab] = useState("overview");

    const fetchDetails = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const res = await adminCustomerService.getUserById(id);
            if (res.success) {
                setDetails(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch customer details", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleBan = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Ban User',
            message: 'Are you sure you want to ban this user? They will be logged out immediately.',
            confirmText: 'Ban User',
            type: 'danger',
            onConfirm: async () => {
                try {
                    setActionLoading(true);
                    await adminCustomerService.banUser(id);
                    await fetchDetails();
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                } catch (error) {
                    console.error("Failed to ban user", error);
                } finally {
                    setActionLoading(false);
                }
            }
        });
    };

    const handleUnban = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Unban User',
            message: 'Are you sure you want to unban this user? They will regain access to their account.',
            confirmText: 'Unban User',
            type: 'info',
            onConfirm: async () => {
                try {
                    setActionLoading(true);
                    await adminCustomerService.unbanUser(id);
                    await fetchDetails();
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                } catch (error) {
                    console.error("Failed to unban user", error);
                } finally {
                    setActionLoading(false);
                }
            }
        });
    };

    if (loading) return (
        <div className="p-8 flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
    );

    if (!details) return <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">Customer not found</div>;

    const { user, orders, addresses, cart, coupons, stats } = details;

    const tabs = [
        { id: "overview", label: "Overview", icon: User },
        { id: "orders", label: `Orders (${orders.length})`, icon: Package },
        { id: "addresses", label: `Addresses (${addresses.length})`, icon: MapPin },
        { id: "coupons", label: "Coupons", icon: Tag },
        { id: "cart", label: "Cart", icon: ShoppingBag },
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">

            {/* Header / Hero */}
            <div className="bg-white dark:bg-white/[0.03] rounded-[40px] p-8 border border-gray-50 dark:border-white/[0.05] shadow-sm relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden bg-gray-100">
                        {user.profilePicture ? (
                            <Image src={user.profilePicture} alt={user.name} fill className="object-cover" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-3xl text-gray-400 font-black">
                                {user.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    <div className="text-center md:text-left flex-grow space-y-2">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{user.name}</h1>
                            {user.isBanned ? (
                                <Badge color="error" size="sm" className="font-black uppercase tracking-widest text-[10px]">Banned</Badge>
                            ) : (
                                <Badge color="success" size="sm" className="font-black uppercase tracking-widest text-[10px]">Active Customer</Badge>
                            )}
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
                            <div className="flex items-center gap-2">
                                <Mail size={16} /> {user.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={16} /> {user.phoneNumber || 'N/A'}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} /> Joined {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {user.isBanned ? (
                            <button onClick={handleUnban} className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-green-600 transition-all shadow-lg shadow-green-500/20">
                                Unban Customer
                            </button>
                        ) : (
                            <button onClick={handleBan} className="px-6 py-3 bg-white border border-gray-200 text-red-500 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-red-50 hover:border-red-200 transition-all">
                                Ban Customer
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-white/[0.03] p-6 rounded-3xl border border-gray-100 dark:border-white/[0.05] shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                            <Package size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Orders</span>
                    </div>
                    <div className="text-2xl font-black text-gray-900 dark:text-white">{stats.totalOrders}</div>
                </div>

                <div className="bg-white dark:bg-white/[0.03] p-6 rounded-3xl border border-gray-100 dark:border-white/[0.05] shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
                            <CreditCard size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Spent</span>
                    </div>
                    <div className="text-2xl font-black text-gray-900 dark:text-white">₹{stats.totalSpent.toLocaleString()}</div>
                </div>

                <div className="bg-white dark:bg-white/[0.03] p-6 rounded-3xl border border-gray-100 dark:border-white/[0.05] shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                            <Wallet size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg. Order Value</span>
                    </div>
                    <div className="text-2xl font-black text-gray-900 dark:text-white">₹{stats.avgOrderValue.toFixed(0)}</div>
                </div>

                <div className="bg-white dark:bg-white/[0.03] p-6 rounded-3xl border border-gray-100 dark:border-white/[0.05] shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                            <Clock size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Order</span>
                    </div>
                    <div className="text-lg font-black text-gray-900 dark:text-white md:truncate">
                        {stats.lastOrderDate ? new Date(stats.lastOrderDate).toLocaleDateString() : 'Never'}
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                 flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
                                 ${activeTab === tab.id
                                    ? "bg-black text-white dark:bg-white dark:text-black shadow-lg scale-105"
                                    : "bg-white dark:bg-white/5 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10"
                                }
                             `}
                        >
                            <Icon size={14} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-white/[0.03] rounded-[40px] p-8 border border-gray-50 dark:border-white/[0.05] shadow-sm min-h-[400px]">

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Personal Details</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5">
                                    <span className="text-sm text-gray-500 font-bold">Full Name</span>
                                    <span className="text-sm font-medium">{user.name}</span>
                                </div>
                                <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5">
                                    <span className="text-sm text-gray-500 font-bold">Email</span>
                                    <span className="text-sm font-medium">{user.email}</span>
                                </div>
                                <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5">
                                    <span className="text-sm text-gray-500 font-bold">Phone Number</span>
                                    <span className="text-sm font-medium">{user.phoneNumber || '-'}</span>
                                </div>
                                <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5">
                                    <span className="text-sm text-gray-500 font-bold">Customer ID</span>
                                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{user._id}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Account Activity</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5">
                                    <span className="text-sm text-gray-500 font-bold">Registered On</span>
                                    <span className="text-sm font-medium">{new Date(user.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5">
                                    <span className="text-sm text-gray-500 font-bold">Last Updated</span>
                                    <span className="text-sm font-medium">{new Date(user.updatedAt).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-white/5">
                                    <span className="text-sm text-gray-500 font-bold">Marketing Emails</span>
                                    <Badge size="sm" color="success">Subscribed</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                    <div>
                        {orders.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <Package size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-bold">No orders found</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Order ID</TableCell>
                                        <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Date</TableCell>
                                        <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Status</TableCell>
                                        <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Total</TableCell>
                                        <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Action</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((order: any) => (
                                        <TableRow key={order._id}>
                                            <TableCell className="font-mono text-xs">{order._id.slice(-6).toUpperCase()}</TableCell>
                                            <TableCell className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge size="sm" color={order.orderStatus === 'active' ? 'success' : 'warning'}>{order.orderStatus}</Badge>
                                            </TableCell>
                                            <TableCell className="text-sm font-black">₹{order.finalAmount.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Link href={`/admin/orders/${order._id}`} className="text-blue-500 hover:underline text-xs font-bold uppercase">View</Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                )}

                {/* COUPONS TAB */}
                {activeTab === 'coupons' && (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Available Coupons</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {coupons.available.length === 0 ? (
                                    <p className="text-xs text-gray-400 font-bold col-span-2">No active coupons available for this user.</p>
                                ) : (
                                    coupons.available.map((coupon: any) => (
                                        <div key={coupon._id} className="p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50 flex justify-between items-center px-4">
                                            <div>
                                                <div className="font-black text-lg text-black">{coupon.code}</div>
                                                <div className="text-xs text-gray-500 font-bold uppercase">{coupon.description}</div>
                                            </div>
                                            <Badge color="success" size="sm">Active</Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Used Coupons History</h3>
                            {coupons.used.length === 0 ? (
                                <p className="text-xs text-gray-400 font-bold">No coupons used yet.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Code</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Discount</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Order ID</TableCell>
                                            <TableCell isHeader className="font-black uppercase text-[10px] tracking-widest text-gray-400">Date Used</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {coupons.used.map((c: any, i: number) => (
                                            <TableRow key={i}>
                                                <TableCell className="font-bold">{c.code}</TableCell>
                                                <TableCell className="text-green-600 font-bold">₹{c.discountAmount}</TableCell>
                                                <TableCell className="font-mono text-xs text-gray-400">{c.orderId.slice(-6).toUpperCase()}</TableCell>
                                                <TableCell className="text-xs text-gray-500">{new Date(c.date).toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </div>
                )}

                {/* ADDRESSES TAB */}
                {activeTab === 'addresses' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.length === 0 ? (
                            <div className="col-span-2 text-center py-20 text-gray-400">
                                <MapPin size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-bold">No addresses found</p>
                            </div>
                        ) : (
                            addresses.map((addr: any) => (
                                <div key={addr._id} className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge size="sm" color="info" className="uppercase">{addr.addressType}</Badge>
                                        {addr.isDefault && <Badge size="sm" color="success">Default</Badge>}
                                    </div>
                                    <p className="font-bold text-black">{addr.name}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {addr.street}, {addr.city}<br />
                                        {addr.state}, {addr.country} - {addr.postalCode}
                                    </p>
                                    <p className="text-sm font-mono text-gray-500 mt-3">{addr.phoneNumber}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* CART TAB */}
                {activeTab === 'cart' && (
                    <div>
                        {!cart || !cart.items || cart.items.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="font-bold">Cart is empty</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold">Current Cart Items</h3>
                                    <span className="text-sm font-bold text-gray-400">Total: ₹{cart.totalAmount?.toLocaleString()}</span>
                                </div>
                                {cart.items.map((item: any) => (
                                    <div key={item._id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50">
                                        <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden relative">
                                            {item.product?.images?.[0] && <Image src={item.product.images[0]} alt="" fill className="object-cover" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{item.product?.name}</p>
                                            <p className="text-xs text-gray-500 font-black uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="ml-auto font-black text-sm">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                confirmText={confirmModal.confirmText}
                type={confirmModal.type}
                isLoading={actionLoading}
            />
        </div>
    );
}
