"use client";
import React from "react";
import Image from "next/image";
import { ShieldCheck, UserCheck, HeartHandshake, Settings, TrendingUp } from "lucide-react";

const ServicePromo = () => {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 space-y-16">

                {/* 1. Promo Banners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Card 1: Save 20% */}
                    <div className="md:col-span-2 lg:col-span-1 relative h-64 bg-[#FFF0F5] rounded-2xl overflow-hidden p-8 flex flex-col justify-center">
                        <div className="relative z-10 max-w-[60%]">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Limited Time Offer</span>
                            <h3 className="text-4xl font-black text-sking-pink leading-none mb-1">Save</h3>
                            <h3 className="text-5xl font-black text-sking-pink leading-none mb-4">20%</h3>
                        </div>
                        <div className="absolute right-0 bottom-0 h-full w-1/2">
                            <Image
                                src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=400&auto=format&fit=crop"
                                alt="Skincare Model"
                                fill
                                className="object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#FFF0F5]" />
                        </div>
                    </div>

                    {/* Card 2: Free Shipping */}
                    <div className="relative h-64 bg-[#FFF5F5] rounded-2xl overflow-hidden p-8 flex flex-col justify-center items-start">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">Free Shipping on</h3>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Orders Over</h3>
                            <h3 className="text-5xl font-bold text-sking-pink">$50</h3>
                        </div>
                        <div className="absolute right-[-20px] bottom-0 h-48 w-48">
                            <Image
                                src="https://images.unsplash.com/photo-1548695602-996ff36a0d4c?q=80&w=400&auto=format&fit=crop" // Delivery Guy placeholder
                                alt="Delivery"
                                fill
                                className="object-contain"
                            />
                        </div>
                        {/* Curve Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-bl-full opacity-50" />
                    </div>

                    {/* Card 3: Exclusive Discounts */}
                    <div className="md:col-span-2 lg:col-span-1 relative h-64 bg-[#F8F5F2] rounded-2xl overflow-hidden p-8 flex flex-col justify-center">
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold text-sking-pink mb-1">Exclusive</h3>
                            <h3 className="text-3xl font-bold text-sking-pink mb-2">Discounts!</h3>
                            <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">For New Customers</p>
                        </div>
                        <div className="absolute right-0 bottom-0 h-48 w-48">
                            <Image
                                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop" // Bottles
                                alt="Products"
                                fill
                                className="object-contain object-bottom"
                            />
                        </div>
                    </div>

                </div>

                {/* 2. Services Icons Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { icon: ShieldCheck, title: "Quality Assurance" },
                        { icon: UserCheck, title: "Customer Satisfaction" },
                        { icon: HeartHandshake, title: "Trust and Reliability" },
                        { icon: Settings, title: "Personalization" },
                        { icon: TrendingUp, title: "Continuous Improvement" },
                    ].map((service, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center text-center gap-3 hover:shadow-lg transition-shadow duration-300">
                            <div className="p-3 bg-pink-50 rounded-full text-sking-pink">
                                <service.icon size={24} />
                            </div>
                            <span className="text-xs font-bold text-gray-700">{service.title}</span>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ServicePromo;
