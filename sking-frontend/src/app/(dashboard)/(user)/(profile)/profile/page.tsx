'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useForm } from 'react-hook-form';
import { updateUser } from '@/redux/features/authSlice';
import { userProfileService } from '@/services/user/userProfileApiService';
import { toast } from 'sonner';
import { Loader2, Camera, User, Mail, Phone, FileText, Save, ArrowLeft, X, Check, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';

interface ProfileFormData {
    name: string;
    bio: string;
    phoneNumber: string;
}

export default function ProfilePage() {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Cropper State
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, setValue } = useForm<ProfileFormData>();

    useEffect(() => {
        if (user) {
            setValue('name', user.name);
            // @ts-ignore
            setValue('bio', user.bio || '');
            // @ts-ignore
            setValue('phoneNumber', user.phoneNumber || '');
        }
    }, [user, setValue]);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setTempImageSrc(reader.result as string);
                setIsCropping(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const handleSaveCrop = async () => {
        if (!tempImageSrc || !croppedAreaPixels) return;

        setIsUploading(true);
        try {
            const croppedImageBlob = await getCroppedImg(tempImageSrc, croppedAreaPixels);

            if (!croppedImageBlob) {
                toast.error('Something went wrong with cropping.');
                return;
            }

            // Create a File from the Blob
            const file = new File([croppedImageBlob], "profile_pic.jpg", { type: "image/jpeg" });

            const response = await userProfileService.uploadProfilePicture(file);
            if (response.success && user) {
                const updatedUser = { ...user, profilePicture: response.imageUrl };
                dispatch(updateUser(updatedUser));
                toast.success('Profile picture updated successfully');
                setIsCropping(false);
                setTempImageSrc(null);
            }
        } catch (error) {
            toast.error('Failed to upload image');
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancelCrop = () => {
        setIsCropping(false);
        setTempImageSrc(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (data: ProfileFormData) => {
        setIsSaving(true);
        try {
            const response = await userProfileService.updateProfile(data);
            if (response.success) {
                dispatch(updateUser(response.user));
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-[400px] flex items-center justify-center bg-white text-black">
                <Loader2 className="w-8 h-8 animate-spin text-sking-red" />
            </div>
        );
    }

    // @ts-ignore
    const profilePic = user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;

    return (
        <div className="relative">
            {/* Cropper Modal - Stays dark as it is a modal/overlay */}
            <AnimatePresence>
                {isCropping && tempImageSrc && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-lg text-black uppercase tracking-tight">Adjust Picture</h3>
                                <button onClick={handleCancelCrop} className="text-gray-400 hover:text-black transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="relative h-[400px] w-full bg-black">
                                <Cropper
                                    image={tempImageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    cropShape="round"
                                    showGrid={false}
                                />
                            </div>

                            <div className="p-6 space-y-6 bg-white">
                                <div className="flex items-center gap-4">
                                    <ZoomOut className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        aria-labelledby="Zoom"
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="w-full accent-black h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <ZoomIn className="w-4 h-4 text-gray-400" />
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={handleCancelCrop}
                                        className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors text-gray-600 uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveCrop}
                                        disabled={isUploading}
                                        className="px-6 py-2 bg-black hover:bg-sking-red rounded-lg text-sm font-bold text-white transition-colors flex items-center gap-2 uppercase tracking-widest disabled:opacity-50"
                                    >
                                        {isUploading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Check className="w-4 h-4" />
                                        )}
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div>
                <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter hidden md:block text-black">My Profile</h1>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="xl:col-span-1"
                    >
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
                            <div className="relative inline-block mb-4 group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                                    <img
                                        src={profilePic}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-black hover:bg-sking-red text-white p-2.5 rounded-full shadow-lg transition-all transform group-hover:scale-110"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </div>
                            <h2 className="text-xl font-bold mb-1 text-black uppercase tracking-tight">{user.name}</h2>
                            <p className="text-sm text-gray-500 mb-4 font-medium">@{user.username}</p>
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200 uppercase tracking-wide">
                                Active Account
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Edit Intent Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="xl:col-span-2"
                    >
                        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase tracking-tight">
                                <User className="w-5 h-5 text-sking-red" />
                                Settings
                            </h3>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                {...register('name')}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-10 py-3 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium placeholder:text-gray-400"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                {...register('phoneNumber')}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-10 py-3 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm font-medium placeholder:text-gray-400"
                                                placeholder="+1 (234) 567-8900"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                                    <div className="relative opacity-60 cursor-not-allowed">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            value={user.email}
                                            disabled
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-10 py-3 text-black focus:outline-none"
                                        />
                                    </div>
                                    <p className="text-[10px] uppercase tracking-wide text-gray-400">Email address cannot be changed</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Bio</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                        <textarea
                                            {...register('bio')}
                                            rows={4}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-10 py-3 text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none text-sm font-medium placeholder:text-gray-400"
                                            placeholder="Tell us a little about yourself..."
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="bg-black hover:bg-sking-red text-white px-8 py-3 rounded-lg font-bold tracking-widest uppercase transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
