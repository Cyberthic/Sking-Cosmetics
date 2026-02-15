"use client";
import React from "react";
import Link from "next/link";
import { Gavel, Scale, FileText, AlertCircle, ShoppingBag, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-gray-50 py-20 border-b border-gray-100">
                <div className="max-w-[1000px] mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-600 font-black text-[10px] uppercase tracking-widest mb-6"
                    >
                        <Scale size={14} />
                        Legal Agreement
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black text-black tracking-tight uppercase italic mb-6">
                        Terms & <span className="text-sking-pink">Conditions</span>
                    </h1>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto">
                        Please read these terms carefully before using our services. By accessing or using Sking Cosmetics, you agree to be bound by these terms.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-[800px] mx-auto px-4 py-20">
                <div className="space-y-16">

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl shadow-xl">
                                <FileText size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-black uppercase tracking-tight">1. Services</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            Sking Cosmetics provides an online platform for purchasing premium beauty and skincare products. By placing an order, you represent that you are at least 18 years old or are using the site under the supervision of a parent or guardian.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl shadow-xl">
                                <ShoppingBag size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-black uppercase tracking-tight">2. Product Accuracy</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            We strive to display our products as accurately as possible. However, actual colors and textures may vary depending on your screen settings. We do not warrant that product descriptions or other content are error-free.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl shadow-xl">
                                <CreditCard size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-black uppercase tracking-tight">3. Payments & Orders</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            All prices are in Indian Rupees (INR) unless otherwise stated. We reserve the right to refuse or cancel any order for reasons including product availability, errors in pricing, or problems identified by our fraud detection department.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl shadow-xl">
                                <AlertCircle size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-black uppercase tracking-tight">4. Intellectual Property</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            All content on this site, including images, logos, and text, is the property of Sking Cosmetics and is protected by international copyright laws. Unauthorized use of any content is strictly prohibited.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl shadow-xl">
                                <Gavel size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-black uppercase tracking-tight">5. Governing Law</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            Any disputes arising out of your use of this website or products purchased shall be governed by the laws of India, with exclusive jurisdiction in the courts of Kerala.
                        </p>
                    </section>

                    <section className="p-8 bg-black text-white rounded-[2rem] shadow-2xl">
                        <h2 className="text-xl font-black uppercase tracking-tight mb-4">Questions?</h2>
                        <p className="text-gray-400 text-sm font-medium mb-6">
                            If you have any questions about these Terms, please contact our legal team at:
                        </p>
                        <div className="flex flex-col gap-1">
                            <span className="text-sking-pink font-black uppercase text-sm tracking-widest">skingfacebeautycosmetic916@gmail.com</span>
                            <span className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mt-2">Effective Date: February 15, 2026</span>
                        </div>
                    </section>

                    <div className="pt-10 flex justify-center">
                        <Link href="/" className="px-10 py-4 border-2 border-black text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all">
                            Home Page
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
