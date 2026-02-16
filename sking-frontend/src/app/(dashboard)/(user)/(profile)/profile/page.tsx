'use client';

import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useForm } from 'react-hook-form';
import { updateUser } from '@/redux/features/authSlice';
import { userProfileService } from '@/services/user/userProfileApiService';
import { toast } from 'sonner';
import { Loader2, Camera, User, Mail, Phone, FileText, Save, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Modal } from '@/components/admin/ui/modal';

interface ProfileFormData {
    name: string;
    bio: string;
    phoneNumber: string;
}

export default function ProfilePage() {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const [isSaving, setIsSaving] = useState(false);

    // Cropper State
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number | undefined>(undefined); // Allow flexible crop
    const [isUploading, setIsUploading] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
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

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setTempImageSrc(reader.result as string);
                setCropModalOpen(true);
                setAspect(undefined); // Start with free crop
            };
            reader.readAsDataURL(file);
        }
    };

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const newCrop = centerCrop(
            makeAspectCrop(
                { unit: '%', width: 90 },
                aspect || 1,
                width,
                height
            ),
            width,
            height
        );
        setCrop(newCrop);
    }

    const handleAspectChange = (newAspect: number | undefined) => {
        setAspect(newAspect);
        if (imgRef.current) {
            const { width, height } = imgRef.current;
            if (newAspect) {
                const newCrop = centerCrop(
                    makeAspectCrop(
                        { unit: '%', width: 90 },
                        newAspect,
                        width,
                        height
                    ),
                    width,
                    height
                );
                setCrop(newCrop);
            }
        }
    };

    const getCroppedImgBlob = async (image: HTMLImageElement, crop: PixelCrop): Promise<Blob | null> => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 1);
        });
    };

    const handleSaveCrop = async () => {
        if (!imgRef.current || !completedCrop) return;

        setIsUploading(true);
        try {
            const croppedImageBlob = await getCroppedImgBlob(imgRef.current, completedCrop);

            if (!croppedImageBlob) {
                toast.error('Something went wrong with cropping.');
                return;
            }

            const file = new File([croppedImageBlob], "profile_pic.jpg", { type: "image/jpeg" });
            const response = await userProfileService.uploadProfilePicture(file);

            if (response.success && user) {
                const updatedUser = { ...user, profilePicture: response.imageUrl };
                dispatch(updateUser(updatedUser));
                toast.success('Profile picture updated successfully');
                setCropModalOpen(false);
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
        setCropModalOpen(false);
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
                <Loader2 className="w-8 h-8 animate-spin text-sking-pink" />
            </div>
        );
    }

    // @ts-ignore
    const profilePic = user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;

    return (
        <div className="relative">
            {/* Enhanced Cropper Modal */}
            <Modal isOpen={cropModalOpen} onClose={handleCancelCrop} className="max-w-4xl w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-black uppercase tracking-tight">Adjust Portrait</h3>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => handleAspectChange(1)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${aspect === 1 ? "bg-sking-pink text-white shadow-md" : "bg-gray-100 text-gray-400 hover:text-black hover:bg-gray-200"}`}>1:1 Square</button>
                        <button type="button" onClick={() => handleAspectChange(3 / 4)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${aspect === 3 / 4 ? "bg-sking-pink text-white shadow-md" : "bg-gray-100 text-gray-400 hover:text-black hover:bg-gray-200"}`}>3:4 Portrait</button>
                        <button type="button" onClick={() => handleAspectChange(undefined)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${aspect === undefined ? "bg-sking-pink text-white shadow-md" : "bg-gray-100 text-gray-400 hover:text-black hover:bg-gray-200"}`}>Free</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-3">
                        <div className="relative bg-black rounded-3xl overflow-hidden min-h-[400px] flex items-center justify-center border border-gray-100 shadow-inner">
                            {tempImageSrc && (
                                <ReactCrop
                                    crop={crop}
                                    onChange={(c) => setCrop(c)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={aspect}
                                    circularCrop={aspect === 1}
                                    className="max-w-full max-h-[500px]"
                                >
                                    <img
                                        ref={imgRef}
                                        src={tempImageSrc}
                                        alt="Crop"
                                        onLoad={onImageLoad}
                                        style={{ maxHeight: '500px', objectFit: 'contain' }}
                                    />
                                </ReactCrop>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col justify-between py-2">
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[10px] font-black text-black uppercase tracking-[0.2em] mb-3">Crop Style</h4>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                    {aspect ? "Locked Aspect Ratio. Drag the box to center your face." : "Free Resizing. Drag corners to adjust breadth and height."}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-2 text-black">
                                    <Check className="w-3 h-3" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">High Quality Export</span>
                                </div>
                                <div className="flex items-center gap-3 text-black">
                                    <Check className="w-3 h-3" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Original Resolution</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-8 border-t border-gray-100">
                            <button
                                onClick={handleSaveCrop}
                                disabled={isUploading || !completedCrop}
                                className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sking-pink transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Image
                            </button>
                            <button
                                onClick={handleCancelCrop}
                                className="w-full py-4 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-black transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            <div>
                <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter hidden md:block text-black">My Profile</h1>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="xl:col-span-1"
                    >
                        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                            <div className="relative inline-block mb-6 group w-full max-w-[240px]">
                                <div className="aspect-auto min-h-[160px] rounded-3xl overflow-hidden border-8 border-white shadow-2xl relative transition-transform duration-500 group-hover:scale-105 bg-white flex items-center justify-center">
                                    <img
                                        src={profilePic}
                                        alt={user.name}
                                        className="w-full h-auto max-h-[300px] object-contain"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-1 right-1 bg-black hover:bg-sking-pink text-white p-4 rounded-full shadow-2xl transition-all transform scale-90 group-hover:scale-100"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </div>
                            <h2 className="text-2xl font-black mb-1 text-black uppercase tracking-tight">{user.name}</h2>
                            <p className="text-xs text-gray-400 mb-6 font-black uppercase tracking-[0.2em]">@{user.username}</p>
                            <div className="inline-flex items-center px-6 py-2 rounded-full bg-white text-black text-[10px] font-black border border-gray-100 uppercase tracking-widest shadow-sm">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse" />
                                Active Member
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Settings Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="xl:col-span-2"
                    >
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                            <h3 className="text-xl font-black mb-10 flex items-center gap-4 uppercase tracking-tight">
                                <div className="w-10 h-10 rounded-xl bg-sking-pink/10 flex items-center justify-center text-sking-pink">
                                    <User className="w-5 h-5" />
                                </div>
                                Account Settings
                            </h3>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input
                                                {...register('name')}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-14 py-4 text-black focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all text-sm font-bold placeholder:text-gray-300"
                                                placeholder="Your Name"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input
                                                {...register('phoneNumber')}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-14 py-4 text-black focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all text-sm font-bold placeholder:text-gray-300"
                                                placeholder="+91 00000 00000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email Address</label>
                                    <div className="relative opacity-50">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            value={user.email}
                                            disabled
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-14 py-4 text-black font-bold text-sm"
                                        />
                                    </div>
                                    <p className="text-[9px] uppercase tracking-widest text-gray-300 font-bold ml-2">Email changes restricted for security</p>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Bio / Skincare Goals</label>
                                    <div className="relative">
                                        <FileText className="absolute left-5 top-5 w-4 h-4 text-gray-300" />
                                        <textarea
                                            {...register('bio')}
                                            rows={4}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-14 py-4 text-black focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all resize-none text-sm font-bold placeholder:text-gray-300"
                                            placeholder="Glowing skin is the goal..."
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="bg-black hover:bg-sking-pink text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center gap-4 hover:shadow-2xl hover:shadow-sking-pink/20 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Update Settings
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
