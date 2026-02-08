'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userAuthService } from '@/services/user/userAuthApiService';
import { resetPasswordSchema, ResetPasswordFormData } from '@/validations/userAuth.validation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Loader2, Eye, EyeOff, AlertCircle, Check, X, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordContent() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get('email');
    const verified = searchParams.get('verified');

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onChange'
    });

    const watchedPassword = watch('password', '');
    const watchedConfirmPassword = watch('confirmPassword', '');

    const getPasswordStrength = (password: string) => {
        let strength = 0;
        let checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            special: /[@$!%*?&]/.test(password)
        };

        strength = Object.values(checks).filter(Boolean).length;

        return { strength, checks };
    };

    const passwordStrength = getPasswordStrength(watchedPassword || '');

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!email || !verified) {
            toast.error('Invalid reset session. Please try again.');
            router.push('/forgot-password');
            return;
        }

        setLoading(true);
        try {
            await userAuthService.resetPassword({
                email,
                newPassword: data.password
            });

            toast.success('Password reset successfully! Please login with your new password.');
            router.push('/login?reset=success');
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Reset failed';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!email || !verified) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white text-black p-8">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 uppercase tracking-tight">Session Expired</h1>
                    <p className="text-gray-500 font-medium mb-8">Please start the password reset process again to ensure security.</p>
                    <Link
                        href="/forgot-password"
                        className="inline-block w-full bg-sking-pink hover:bg-sking-pink/90 text-white font-bold py-4 rounded-md transition-all uppercase tracking-widest"
                    >
                        Restart Reset
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex bg-white text-black overflow-hidden">
            {/* Left Side: Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop")',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="absolute inset-0 bg-black/5" />
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2 uppercase">Reset Password</h1>
                        <p className="text-gray-500 font-medium tracking-wide">Enter your new strong password below</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                New Password<span className="text-sking-pink">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    {...register('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 pr-12 text-black placeholder-gray-400 focus:outline-none focus:border-sking-pink transition-all h-14"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            <AnimatePresence>
                                {watchedPassword && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-2 mt-2"
                                    >
                                        <div className="flex gap-1 h-1">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-full flex-1 rounded-full transition-colors ${passwordStrength.strength >= level
                                                        ? passwordStrength.strength <= 2
                                                            ? 'bg-red-500'
                                                            : passwordStrength.strength <= 3
                                                                ? 'bg-yellow-500'
                                                                : 'bg-green-500'
                                                        : 'bg-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                                {errors.password && (
                                    <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Confirm New Password<span className="text-sking-pink">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    {...register('confirmPassword')}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 pr-12 text-black placeholder-gray-400 focus:outline-none focus:border-sking-pink transition-all h-14"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <AnimatePresence>
                                {watchedConfirmPassword && watchedPassword && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="flex items-center gap-1 text-xs mt-1 font-medium"
                                    >
                                        {watchedPassword === watchedConfirmPassword ? (
                                            <span className="text-green-600 flex items-center gap-1"><Check className="w-3 h-3" /> Passwords match</span>
                                        ) : (
                                            <span className="text-red-500 flex items-center gap-1"><X className="w-3 h-3" /> Passwords don't match</span>
                                        )}
                                    </motion.div>
                                )}
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || passwordStrength.strength < 4}
                            className="w-full bg-sking-pink hover:bg-sking-pink/90 text-white font-bold py-4 rounded-md transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest h-14"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Set New Password'}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-sking-pink transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Login
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-black font-bold uppercase tracking-widest">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
