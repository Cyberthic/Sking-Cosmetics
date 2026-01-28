'use client';

import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, CheckCircle, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { addressSchema, AddressSchema } from '../../../../../validations/userAddress.validation';
import { userAddressService, Address } from '../../../../../services/user/userAddressApiService';
import { SearchableSelect } from '@/components/user/ui/SearchableSelect';
import { countries } from '@/constants/countries';
import { AddressModal } from '@/components/user/modals/AddressModal';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await userAddressService.getAllAddresses();
            setAddresses(response.data || []);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to fetch addresses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleAddClick = () => {
        if (addresses.length >= 5) {
            toast.error("Maximum 5 addresses allowed per user. Please delete an address to add more.");
            return;
        }
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (address: Address) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setAddressToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!addressToDelete) return;
        try {
            setSubmitting(true);
            await userAddressService.deleteAddress(addressToDelete);
            toast.success("Address deleted successfully");
            fetchAddresses();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to delete address");
        } finally {
            setSubmitting(false);
            setIsConfirmModalOpen(false);
            setAddressToDelete(null);
        }
    };

    const handleSetPrimary = async (id: string) => {
        try {
            await userAddressService.setPrimaryAddress(id);
            toast.success("Primary address updated");
            fetchAddresses();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to set primary address");
        }
    };

    return (
        <div className="min-h-screen pb-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black mb-0 uppercase tracking-tighter hidden md:block text-black">My Addresses</h1>
                <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-6 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-colors shadow-lg shadow-black/20"
                >
                    <Plus className="w-4 h-4" />
                    Add New Address
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-black" />
                </div>
            ) : addresses.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center"
                >
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
                        <MapPin className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-black uppercase tracking-tight">No addresses saved</h3>
                    <p className="text-gray-500 mb-6 font-medium">Add an address to speed up your checkout process.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <motion.div
                            key={address._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`relative p-6 rounded-2xl border transition-all duration-200 group ${address.isPrimary
                                ? 'bg-neutral-900 border-neutral-900 text-white shadow-xl shadow-neutral-900/20'
                                : 'bg-white border-gray-200 hover:border-black hover:shadow-lg text-black'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${address.isPrimary ? 'bg-white text-black' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {address.type}
                                    </span>
                                    {address.isPrimary && (
                                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                                            <CheckCircle className="w-3 h-3" /> Primary
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditClick(address)}
                                        className={`p-2 rounded-full transition-colors ${address.isPrimary ? 'hover:bg-neutral-800 text-gray-300 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-black'
                                            }`}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(address._id)}
                                        className={`p-2 rounded-full transition-colors ${address.isPrimary ? 'hover:bg-neutral-800 text-gray-300 hover:text-red-400' : 'hover:bg-gray-100 text-gray-400 hover:text-red-500'
                                            }`}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-bold text-lg mb-1">{address.name}</h3>
                            <p className={`text-xs mb-1 font-medium ${address.isPrimary ? 'text-gray-300' : 'text-gray-500'}`}>{address.email}</p>
                            <p className={`text-sm mb-4 ${address.isPrimary ? 'text-gray-300' : 'text-gray-500'}`}>{address.phoneNumber}</p>

                            <div className={`text-sm leading-relaxed mb-6 ${address.isPrimary ? 'text-gray-300' : 'text-gray-600'}`}>
                                <p>{address.street}</p>
                                <p>{address.city}, {address.state} {address.postalCode}</p>
                                <p>{address.country}</p>
                            </div>

                            {!address.isPrimary && (
                                <button
                                    onClick={() => handleSetPrimary(address._id)}
                                    className="text-xs font-bold uppercase tracking-wider hover:underline opacity-60 hover:opacity-100 transition-opacity"
                                >
                                    Set as Primary
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            <AddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                address={editingAddress}
                refresh={fetchAddresses}
            />

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Address"
                message="Are you sure you want to delete this address? This action cannot be undone."
                confirmText="Delete"
                type="danger"
                isLoading={submitting}
            />
        </div>
    );
}

