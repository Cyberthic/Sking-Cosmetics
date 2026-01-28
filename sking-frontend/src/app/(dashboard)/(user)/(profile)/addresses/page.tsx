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
import { Country as CSC, State as CSCState, City as CSCCity } from 'country-state-city';
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

function AddressModal({ isOpen, onClose, address, refresh }: { isOpen: boolean; onClose: () => void; address: Address | null; refresh: () => void }) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setValue, watch } = useForm<AddressSchema>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            country: 'India',
            countryCode: '+91',
            email: '',
            type: 'Home'
        }
    });

    const countryCodeValue = watch('countryCode');
    const countryValue = watch('country');
    const stateValue = watch('state');
    const cityValue = watch('city');

    const [availableStates, setAvailableStates] = useState<{ label: string; value: string }[]>([]);
    const [availableCities, setAvailableCities] = useState<{ label: string; value: string }[]>([]);

    // Load states when country changes
    useEffect(() => {
        if (countryValue) {
            const countryObj = CSC.getAllCountries().find(c => c.name === countryValue);
            if (countryObj) {
                const states = CSCState.getStatesOfCountry(countryObj.isoCode).map(s => ({
                    label: s.name,
                    value: s.name,
                    code: s.isoCode
                }));
                setAvailableStates(states);
            } else {
                setAvailableStates([]);
            }
        } else {
            setAvailableStates([]);
        }
    }, [countryValue]);

    // Load cities when state changes
    useEffect(() => {
        if (stateValue && countryValue) {
            const countryObj = CSC.getAllCountries().find(c => c.name === countryValue);
            const stateObj = CSCState.getStatesOfCountry(countryObj?.isoCode || '').find(s => s.name === stateValue);
            if (countryObj && stateObj) {
                const cities = CSCCity.getCitiesOfState(countryObj.isoCode, stateObj.isoCode).map(c => ({
                    label: c.name,
                    value: c.name
                }));
                setAvailableCities(cities);
            } else {
                setAvailableCities([]);
            }
        } else {
            setAvailableCities([]);
        }
    }, [stateValue, countryValue]);

    useEffect(() => {
        if (address) {
            // Find country code in the phone number
            let detectedCode = '+91';
            let detectedPhone = address.phoneNumber;

            // Try to match longest country codes first
            const sortedCodes = [...countries].sort((a, b) => b.phone.length - a.phone.length);
            for (const c of sortedCodes) {
                if (address.phoneNumber.startsWith(c.phone)) {
                    detectedCode = c.phone;
                    detectedPhone = address.phoneNumber.slice(c.phone.length);
                    break;
                }
            }

            reset({
                name: address.name,
                email: address.email || '',
                countryCode: detectedCode,
                phoneNumber: detectedPhone,
                street: address.street,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country,
                isPrimary: address.isPrimary,
                type: address.type as "Home" | "Work" | "Other"
            });
        } else {
            reset({
                name: '',
                email: '',
                countryCode: '+91',
                phoneNumber: '',
                street: '',
                city: '',
                state: '',
                postalCode: '',
                country: 'India',
                isPrimary: false,
                type: 'Home'
            });
        }
    }, [address, reset, isOpen]);

    const onSubmit = async (data: AddressSchema) => {
        try {
            const payload = {
                ...data,
                phoneNumber: data.countryCode + data.phoneNumber
            };
            if (address) {
                await userAddressService.updateAddress(address._id, payload);
                toast.success("Address updated successfully");
            } else {
                await userAddressService.addAddress(payload);
                toast.success("Address added successfully");
            }
            refresh();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to save address");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-black uppercase tracking-tight text-black">
                        {address ? 'Edit Address' : 'Add New Address'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Name</label>
                                <input
                                    {...register('name')}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium text-sm"
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                                <input
                                    {...register('email')}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium text-sm"
                                    placeholder="john@example.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone Number</label>
                            <div className="flex gap-2">
                                <div className="w-[80px] flex-shrink-0">
                                    <SearchableSelect
                                        options={countries.map(c => ({ label: `${c.phone}`, value: c.phone, subLabel: c.name }))}
                                        value={countryCodeValue}
                                        onChange={(val) => setValue('countryCode', val, { shouldValidate: true })}
                                        placeholder="+91"
                                        dropdownWidth="min-w-[250px]"
                                        error={errors.countryCode?.message}
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        {...register('phoneNumber')}
                                        onInput={(e) => {
                                            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
                                        }}
                                        className={`w-full p-3 bg-gray-50 border rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium text-sm ${errors.phoneNumber ? 'border-red-500' : 'border-gray-200'
                                            }`}
                                        placeholder="9876543210"
                                        maxLength={10}
                                    />
                                </div>
                            </div>
                            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Street Address</label>
                            <input
                                {...register('street')}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium"
                                placeholder="Flat 101, Building Name, Street"
                            />
                            {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Country</label>
                                <SearchableSelect
                                    options={countries.map(c => ({ label: c.name, value: c.name }))}
                                    value={countryValue}
                                    onChange={(val) => {
                                        setValue('country', val, { shouldValidate: true });
                                        setValue('state', '');
                                        setValue('city', '');
                                    }}
                                    placeholder="Select Country"
                                    error={errors.country?.message}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">State</label>
                                <SearchableSelect
                                    options={availableStates}
                                    value={stateValue}
                                    onChange={(val) => {
                                        setValue('state', val, { shouldValidate: true });
                                        setValue('city', '');
                                    }}
                                    placeholder="Select State"
                                    error={errors.state?.message}
                                    disabled={!countryValue}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">City</label>
                                <SearchableSelect
                                    options={availableCities}
                                    value={cityValue}
                                    onChange={(val) => setValue('city', val, { shouldValidate: true })}
                                    placeholder="Select City"
                                    error={errors.city?.message}
                                    disabled={!stateValue}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Postal Code</label>
                                <input
                                    {...register('postalCode')}
                                    onInput={(e) => {
                                        e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
                                    }}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium"
                                    placeholder="123456"
                                    maxLength={6}
                                />
                                {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Address Type</label>
                            <div className="flex gap-4 pt-1">
                                {['Home', 'Work', 'Other'].map((type) => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            value={type}
                                            {...register('type')}
                                            className="w-4 h-4 text-black border-gray-300 focus:ring-black accent-black"
                                        />
                                        <span className="text-sm font-medium group-hover:text-black text-gray-600 transition-colors">{type}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                {...register('isPrimary')}
                                id="isPrimary"
                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                            />
                            <label htmlFor="isPrimary" className="text-sm font-medium text-gray-700 cursor-pointer select-none">Make this my primary address</label>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/20 flex justify-center items-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                {address ? 'Update Address' : 'Save Address'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
