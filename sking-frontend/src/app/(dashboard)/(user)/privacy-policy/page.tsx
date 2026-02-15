"use client";
import React from "react";
import Link from "next/link";
import { Shield, Lock, Eye, FileText, Gavel, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-gray-50 py-20 border-b border-gray-100">
                <div className="max-w-[1000px] mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-sking-pink/10 rounded-full text-sking-pink font-black text-[10px] uppercase tracking-widest mb-6"
                    >
                        <Shield size={14} />
                        Security & Trust
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black text-black tracking-tight uppercase italic mb-6">
                        Privacy <span className="text-sking-pink">Policy</span>
                    </h1>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto">
                        Your privacy is our priority. Learn how we handle your data with the highest standards of transparency and security.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-[800px] mx-auto px-4 py-20">
                <div className="space-y-16">

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl shadow-xl">
                                <Eye size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-black uppercase tracking-tight">1. Introduction</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            Welcome to Sking Cosmetics. We value your trust and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website or make a purchase.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl shadow-xl">
                                <FileText size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-black uppercase tracking-tight">2. Information We Collect</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 font-medium">
                            <p>We may collect the following information:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Personal identification information (Name, email address, phone number, etc.)</li>
                                <li>Shipping and billing addresses for order fulfillment.</li>
                                <li>Payment details (processed through secure, encrypted payment gateways).</li>
                                <li>Browsing data and cookies to improve your shopping experience.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl shadow-xl">
                                <Lock size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-black uppercase tracking-tight">3. How We Use Your Data</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            Your information allows us to process orders efficiently, provide customer support, and send you updates about our latest arrivals and exclusive offers. We never sell your personal data to third parties.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl shadow-xl">
                                <Gavel size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-black uppercase tracking-tight">4. Security Measures</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            We implement a variety of security measures to maintain the safety of your personal information. All sensitive information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our payment gateway providers&apos; database.
                        </p>
                    </section>

                    <section className="space-y-8 p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                        <div className="flex items-center gap-4">
                            <Mail size={24} className="text-sking-pink" />
                            <h2 className="text-xl font-black text-black uppercase tracking-tight">Communication</h2>
                        </div>
                        <p className="text-gray-600 text-sm font-medium">
                            If you have any questions regarding this privacy policy, you may contact our data protection officer at:
                        </p>
                        <div className="flex flex-col gap-2">
                            <span className="text-black font-black uppercase text-sm tracking-widest">skingfacebeautycosmetic916@gmail.com</span>
                            <span className="text-gray-400 text-xs uppercase tracking-widest">Last Updated: February 2026</span>
                        </div>
                    </section>

                    <div className="pt-10 flex justify-center">
                        <Link href="/" className="px-10 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-sking-pink transition-all shadow-xl shadow-black/10">
                            Back to Home
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
