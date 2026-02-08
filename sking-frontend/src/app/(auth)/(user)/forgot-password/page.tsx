'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userAuthService } from '@/services/user/userAuthApiService';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/validations/userAuth.validation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [email, setEmailState] = useState('');
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const watchedEmail = watch('email', '');

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setLoading(true);
        try {
            await userAuthService.forgotPassword(data.email);
            setSuccess(true);
            setEmailState(data.email);
            toast.success('Password reset OTP sent to your email.');
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Request failed';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const continueToVerification = () => {
        router.push(`/verify-forgot-otp?email=${encodeURIComponent(email)}`);
    };

    return (
        <div className="min-h-screen w-full flex bg-white text-black overflow-hidden">
            {/* Left Side: Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1596462502278-27bfad450216?q=80&w=2080&auto=format&fit=crop")',
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
                    <Link href="/login" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-sking-pink mb-8 transition-colors uppercase tracking-widest gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Link>

                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100"
                                >
                                    <CheckCircle className="w-10 h-10 text-green-500" />
                                </motion.div>

                                <h1 className="text-3xl font-bold text-gray-900 mb-3 uppercase">Check Your Email</h1>
                                <p className="text-gray-500 font-medium mb-8">
                                    We've sent a password reset code to<br />
                                    <span className="text-sking-pink font-bold">{email}</span>
                                </p>

                                <button
                                    onClick={continueToVerification}
                                    className="w-full bg-sking-pink hover:bg-sking-pink/90 text-white font-bold py-4 rounded-md transition-all shadow-md active:scale-[0.98] uppercase tracking-widest h-14"
                                >
                                    Verify Code
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="mb-10">
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2 uppercase">Forgot Password?</h1>
                                    <p className="text-gray-500 font-medium tracking-wide">Enter your email to reset password</p>
                                </div>

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

                                    <button
                                        type="submit"
                                        disabled={loading || !watchedEmail}
                                        className="w-full bg-sking-pink hover:bg-sking-pink/90 text-white font-bold py-4 rounded-md transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest h-14"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Code'}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
