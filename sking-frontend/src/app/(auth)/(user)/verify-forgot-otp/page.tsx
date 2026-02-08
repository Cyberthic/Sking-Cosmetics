'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { userAuthService } from '@/services/user/userAuthApiService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Main component with logic
function VerifyForgotOtpContent() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const email = searchParams.get('email');

    useEffect(() => {
        if (!email) {
            toast.error('Email is missing. Please try again.');
            router.push('/forgot-password');
        }
    }, [email, router]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError(null);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all fields are filled
        if (newOtp.every(digit => digit !== '') && value) {
            handleSubmit(newOtp.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text');
        const digits = paste.replace(/\D/g, '').slice(0, 6).split('');

        if (digits.length === 6) {
            setOtp(digits);
            handleSubmit(digits.join(''));
        }
    };

    const handleSubmit = async (otpCode?: string) => {
        const finalOtp = otpCode || otp.join('');

        if (finalOtp.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await userAuthService.verifyForgotPasswordOtp({
                email: email!,
                otp: finalOtp
            });

            toast.success('OTP verified successfully!');
            router.push(`/reset-password?email=${encodeURIComponent(email!)}&verified=true`);
        } catch (err: any) {
            const message = err.response?.data?.error || 'Verification failed';
            setError(message);
            toast.error(message);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;

        setResendLoading(true);
        try {
            await userAuthService.forgotPassword(email!);
            toast.success('New OTP sent to your email');
            setResendTimer(60);
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white text-black overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-sking-pink/5 rounded-full blur-[120px] -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-sking-pink/5 rounded-full blur-[120px] -ml-20 -mb-20" />

            <div className="w-full flex items-center justify-center p-8 md:p-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Link href="/forgot-password" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-sking-pink mb-8 transition-colors uppercase tracking-widest gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Forgot Password
                    </Link>

                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-sking-pink/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-10 h-10 text-sking-pink" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase tracking-tight">Verify Reset Code</h1>
                        <p className="text-gray-500 font-medium">
                            We've sent a 6-digit code to<br />
                            <span className="text-sking-pink font-bold">{email}</span>
                        </p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-md mb-6 text-sm text-center font-medium"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-8">
                        {/* OTP Input Grid */}
                        <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <motion.input
                                    key={index}
                                    ref={(el: any) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-16 bg-white border border-gray-300 rounded-lg text-center text-2xl font-bold text-gray-900 focus:outline-none focus:border-sking-pink focus:ring-1 focus:ring-sking-pink transition-all"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                />
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={() => handleSubmit()}
                            disabled={loading || otp.some(digit => digit === '')}
                            className="w-full bg-sking-pink hover:bg-sking-pink/90 text-white font-bold py-4 rounded-md transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-widest h-14"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
                        </button>

                        {/* Resend OTP */}
                        <div className="text-center pt-4">
                            <button
                                onClick={handleResendOtp}
                                disabled={resendLoading || resendTimer > 0}
                                className={`text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors ${resendTimer > 0 ? 'text-gray-400' : 'text-gray-600 hover:text-sking-pink'}`}
                            >
                                {resendLoading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : resendTimer > 0 ? (
                                    `Resend in ${resendTimer}s`
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4" />
                                        Resend Code
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// Export wrapped with Suspense
export default function VerifyForgotOtpPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-black font-bold uppercase tracking-widest">Loading...</div>}>
            <VerifyForgotOtpContent />
        </Suspense>
    );
}
