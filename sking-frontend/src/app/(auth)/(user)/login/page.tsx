'use client';

import { useState, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginStart, loginSuccess, loginFailure } from '@/redux/features/authSlice';
import { mergeGuestCart } from '@/redux/features/cartSlice';
import { mergeGuestWishlist } from '@/redux/features/wishlistSlice';
import { toast } from 'sonner';
import { userAuthService } from '@/services/user/userAuthApiService';
import { loginSchema, LoginFormData } from '@/validations/userAuth.validation';
import type { RootState, AppDispatch } from '@/redux/store';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useGoogleLogin } from '@/hooks/useGoogleLogin';

function LoginContent() {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const { initiateGoogleLogin } = useGoogleLogin();

    const redirect = searchParams.get('redirect') || '/';

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormData) => {
        dispatch(loginStart());
        try {
            const response = await userAuthService.login(data);
            if (response.success) {
                dispatch(loginSuccess({ user: response.user }));

                // Merge guest cart and wishlist
                const guestCart = localStorage.getItem('guestCart');
                if (guestCart) {
                    dispatch(mergeGuestCart(JSON.parse(guestCart)));
                }

                const guestWishlist = localStorage.getItem('guestWishlist');
                if (guestWishlist) {
                    dispatch(mergeGuestWishlist(JSON.parse(guestWishlist)));
                }

                toast.success('Login successful! Welcome back.');
                router.push(redirect);
            } else {
                const message = response.error || 'Login failed';
                dispatch(loginFailure(message));
                toast.error(message);
            }
        } catch (err: any) {
            const message = err.response?.data?.error || 'Something went wrong';
            dispatch(loginFailure(message));
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white text-black overflow-hidden">
            {/* Left Side: Image - Hidden on mobile */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1935&auto=format&fit=crop")',
                        backgroundPosition: 'center 20%'
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
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2 uppercase">Welcome Back!</h1>
                        <p className="text-gray-500 font-medium tracking-wide">Please enter your details</p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-sm flex items-center gap-2"
                            >
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Email Address<span className="text-sking-pink">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    {...register('email')}
                                    type="email"
                                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-sking-pink transition-all h-14"
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    Password<span className="text-sking-pink">*</span>
                                </label>
                            </div>
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
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="w-4 h-4 accent-sking-pink border-gray-300 rounded focus:ring-sking-pink"
                                />
                                <label htmlFor="remember" className="text-sm font-medium text-gray-600">Remember Me</label>
                            </div>
                            <Link href="/forgot-password" className="text-sm font-medium text-gray-600 hover:text-sking-pink transition-colors">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-sking-pink hover:bg-sking-pink/90 text-white font-bold py-4 rounded-md transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest h-14"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Log In"
                            )}
                        </button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 text-gray-400 font-medium">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={initiateGoogleLogin}
                            className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3.5 rounded-md transition-all hover:bg-gray-50 flex items-center justify-center gap-3 h-14"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21h-.19z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Google
                        </button>
                    </form>

                    <div className="mt-10 text-center text-sm font-medium text-gray-600">
                        Don&apos;t have an account?{' '}
                        <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-sking-pink hover:underline font-bold transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
