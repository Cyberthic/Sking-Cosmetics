"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { addressSchema, AddressSchema } from "@/validations/userAddress.validation";
import { userAddressService, Address } from "@/services/user/userAddressApiService";
import { SearchableSelect } from "@/components/user/ui/SearchableSelect";
import { countries } from "@/constants/countries";
import { Country as CSC, State as CSCState, City as CSCCity } from "country-state-city";

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    address: Address | null;
    refresh: () => void;
}

export function AddressModal({ isOpen, onClose, address, refresh }: AddressModalProps) {
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
            let detectedCode = '+91';
            let detectedPhone = address.phoneNumber;

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
        <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
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
                                id="isPrimaryModal"
                                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black accent-black"
                            />
                            <label htmlFor="isPrimaryModal" className="text-sm font-medium text-gray-700 cursor-pointer select-none">Make this my primary address</label>
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
