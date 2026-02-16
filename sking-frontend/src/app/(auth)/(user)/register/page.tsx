'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userAuthService } from '@/services/user/userAuthApiService';
import { registerSchema, RegisterFormData } from '@/validations/userAuth.validation';
import { useUsernameValidation, useEmailValidation } from '@/hooks/useValidation';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Lock,
    User,
    Loader2,
    ArrowRight,
    Eye,
    EyeOff,
    Check,
    X,
    AlertCircle,
    Sparkles
} from 'lucide-react';
import { useGoogleLogin } from '@/hooks/useGoogleLogin';

function RegisterContent() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { initiateGoogleLogin } = useGoogleLogin();

    const redirect = searchParams.get('redirect') || '/';

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange'
    });

    const watchedUsername = watch('username', '');
    const watchedEmail = watch('email', '');
    const watchedPassword = watch('password', '');
    const watchedConfirmPassword = watch('confirmPassword', '');

    const usernameValidation = useUsernameValidation(watchedUsername);
    const emailValidation = useEmailValidation(watchedEmail);

    // Password strength validation
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

    const generateUsername = async () => {
        try {
            const response = await userAuthService.generateUsername(watchedEmail);
            setValue('username', response.username);
            toast.success('Username generated from your email!');
        } catch (error) {
            toast.error('Failed to generate username');
        }
    };

    const onSubmit = async (data: RegisterFormData) => {
        if (!acceptTerms) {
            toast.error('Please accept the terms and conditions');
            return;
        }

        if (!usernameValidation.isValid) {
            toast.error('Please choose an available username');
            return;
        }

        if (!emailValidation.isValid) {
            toast.error('Please use an available email address');
            return;
        }

        setLoading(true);
        try {
            await userAuthService.register({
                username: data.username,
                email: data.email,
                password: data.password,
                name: data.username
            });

            toast.success('Registration initiated! Please check your email for OTP.');
            router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&username=${encodeURIComponent(data.username)}&password=${encodeURIComponent(data.password)}&redirect=${encodeURIComponent(redirect)}`);
        } catch (err: any) {
            const message = err.response?.data?.error || 'Registration failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const ValidationIcon = ({ isValid, isChecking }: { isValid: boolean; isChecking: boolean }) => {
        if (isChecking) return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
        if (isValid) return <Check className="w-4 h-4 text-green-500" />;
        return <X className="w-4 h-4 text-red-500" />;
    };

    return (
        <div className="min-h-screen w-full flex bg-white text-black overflow-hidden">
            {/* Left Side: Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop")',
                        backgroundPosition: 'center 30%'
                    }}
                >
                    <div className="absolute inset-0 bg-black/5" />
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 overflow-y-auto max-h-screen custom-scrollbar">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md py-10"
                >
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2 uppercase">Create Account</h1>
                        <p className="text-gray-500 font-medium tracking-wide">Enter your details to register</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                                Username<span className="text-sking-pink">*</span>
                                {watchedEmail && (
                                    <button
                                        type="button"
                                        onClick={generateUsername}
                                        className="text-[10px] text-sking-pink hover:underline font-bold uppercase tracking-tight"
                                    >
                                        Auto-Generate
                                    </button>
                                )}
                            </label>
                            <div className="relative">
                                <input
                                    {...register('username')}
                                    type="text"
                                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 pr-12 text-black placeholder-gray-400 focus:outline-none focus:border-sking-pink transition-all h-14"
                                    placeholder="Choose a username"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <ValidationIcon
                                        isValid={usernameValidation.isValid}
                                        isChecking={usernameValidation.isChecking}
                                    />
                                </div>
                            </div>
                            <AnimatePresence>
                                {watchedUsername && watchedUsername.length >= 3 && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className={`text-xs mt-1 font-medium ${usernameValidation.isValid ? 'text-green-600' : 'text-red-500'}`}
                                    >
                                        {usernameValidation.message}
                                    </motion.p>
                                )}
                                {errors.username && (
                                    <p className="text-red-500 text-xs mt-1 font-medium">{errors.username.message}</p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Email Address<span className="text-sking-pink">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    {...register('email')}
                                    type="email"
                                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 pr-12 text-black placeholder-gray-400 focus:outline-none focus:border-sking-pink transition-all h-14"
                                    placeholder="Enter your email"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <ValidationIcon
                                        isValid={emailValidation.isValid}
                                        isChecking={emailValidation.isChecking}
                                    />
                                </div>
                            </div>
                            <AnimatePresence>
                                {watchedEmail && watchedEmail.includes('@') && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className={`text-xs mt-1 font-medium ${emailValidation.isValid ? 'text-green-600' : 'text-red-500'}`}
                                    >
                                        {emailValidation.message}
                                    </motion.p>
                                )}
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                Password<span className="text-sking-pink">*</span>
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
                                Confirm Password<span className="text-sking-pink">*</span>
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

                        {/* Terms and Conditions */}
                        <div className="flex items-start gap-3 p-4 rounded-md bg-gray-50 border border-gray-200">
                            <input
                                {...register('acceptTerms')}
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="w-5 h-5 mt-0.5 accent-sking-pink"
                            />
                            <div className="text-sm text-gray-600 font-medium">
                                <p>
                                    I agree to the{' '}
                                    <Link href="/terms" className="text-sking-pink hover:underline font-bold">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="text-sking-pink hover:underline font-bold">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </div>
                        </div>
                        {errors.acceptTerms && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.acceptTerms.message}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !acceptTerms}
                            className="w-full bg-sking-pink hover:bg-sking-pink/90 text-white font-bold py-4 rounded-md transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest h-14 mt-4"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Sign Up"
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
                        Already have an account?{' '}
                        <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-sking-pink hover:underline font-bold transition-colors">
                            Log In
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RegisterContent />
        </Suspense>
    );
}
