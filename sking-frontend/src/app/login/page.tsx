"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
        router.push("/");
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/40 rounded-full blur-[120px] pointer-events-none" />

            {/* Card */}
            <div className="w-full max-w-md mx-4 p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to continue your beauty journey.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                        <input
                            type="email"
                            placeholder="name@example.com"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <Link href="#" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Signing in...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-gray-400 text-sm">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-white font-medium hover:text-purple-400 transition-colors">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
