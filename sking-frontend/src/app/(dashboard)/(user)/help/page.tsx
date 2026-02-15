'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HelpCircle,
    ShoppingBag,
    CreditCard,
    Truck,
    RotateCcw,
    MessageCircle,
    Phone,
    Mail,
    ChevronDown,
    ShieldCheck,
    Smartphone,
    CheckCircle2,
    Lock,
    Zap,
    Globe,
    Heart,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-black/5 rounded-3xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
                <span className="font-black uppercase tracking-tight text-sm md:text-base italic">{question}</span>
                <div className={`p-2 rounded-xl bg-gray-100 transition-transform duration-500 ${isOpen ? 'rotate-180 bg-black text-white' : ''}`}>
                    <ChevronDown size={18} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="px-6 pb-6 pt-2 text-gray-500 text-sm font-medium leading-relaxed border-t border-black/5">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const HelpPage = () => {
    const faqs = [
        {
            question: "How do I track my order?",
            answer: "Once your order is shipped, you will receive a WhatsApp message and an email with your Tracking ID. You can also view your order status in the 'My Account > Orders' section of the website."
        },
        {
            question: "What payment methods are available?",
            answer: "We offer secure online payments via Razorpay (including UPI, Credit/Debit Cards, NetBanking, and Wallets). You can also choose 'Pay via WhatsApp' for personalized assistance."
        },
        {
            question: "How long does delivery take?",
            answer: "For India, standard delivery takes 3-5 business days. For UAE and other regions, it typically takes 7-10 business days."
        },
        {
            question: "Is my payment secure?",
            answer: "Yes, we use Razorpay's end-to-end encrypted payment gateway. Your payment details are never stored on our servers, ensuring 100% secure transactions."
        },
        {
            question: "What is your return policy?",
            answer: "Due to hygiene and safety reasons, we maintain a strict no-return policy once a product is delivered. If you receive a damaged or incorrect item, please contact our support team within 24 hours for assistance."
        }
    ];

    const orderingSteps = [
        { icon: <ShoppingBag size={24} />, title: "Select Product", desc: "Choose from our range of natural cosmetics." },
        { icon: <Smartphone size={24} />, title: "Checkout", desc: "Enter your address and select a payment method." },
        { icon: <CreditCard size={24} />, title: "Secure Payment", desc: "Complete transaction via Razorpay's encrypted portal." },
        { icon: <CheckCircle2 size={24} />, title: "Confirmation", desc: "Receive instant confirmation on WhatsApp & Email." },
        { icon: <Truck size={24} />, title: "Fast Delivery", desc: "Track your order as it makes its way to you." }
    ];

    return (
        <div className="flex-1 w-full bg-white pb-20">
            {/* --- HERO --- */}
            <section className="bg-black pt-32 pb-20 px-4 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sking-pink/20 rounded-full blur-[120px] -mr-64 -mt-64" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sking-red/10 rounded-full blur-[100px] -ml-40 -mb-40" />

                <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/10"
                    >
                        <HelpCircle className="text-white w-10 h-10" />
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">
                        Help & Support<span className="text-sking-red">.</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto italic">
                        Everything you need to know about Sking Cosmetics services, ordering, and security.
                    </p>
                </div>
            </section>

            {/* --- QUICK ACTIONS --- */}
            <section className="max-w-[1280px] mx-auto px-4 -mt-10 mb-24 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="https://wa.me/918590183737" target="_blank" className="group p-10 bg-white border border-black/5 rounded-[40px] shadow-2xl shadow-black/5 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center gap-6">
                        <div className="w-16 h-16 bg-green-50 rounded-3xl flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                            <MessageCircle size={32} />
                        </div>
                        <h3 className="text-xl font-black uppercase italic">WhatsApp Us</h3>
                        <p className="text-gray-500 text-sm font-medium">Instant support for orders and product inquiries.</p>
                    </Link>

                    <Link href="/contact" className="group p-10 bg-white border border-black/5 rounded-[40px] shadow-2xl shadow-black/5 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center gap-6">
                        <div className="w-16 h-16 bg-sking-pink/5 rounded-3xl flex items-center justify-center text-sking-pink group-hover:bg-sking-pink group-hover:text-white transition-all">
                            <Phone size={32} />
                        </div>
                        <h3 className="text-xl font-black uppercase italic">Call Support</h3>
                        <p className="text-gray-500 text-sm font-medium">Dedicated support line for your convenience.</p>
                    </Link>

                    <Link href="mailto:skingfacebeautycosmetic916@gmail.com" className="group p-10 bg-white border border-black/5 rounded-[40px] shadow-2xl shadow-black/5 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center gap-6">
                        <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all">
                            <Mail size={32} />
                        </div>
                        <h3 className="text-xl font-black uppercase italic">Email Support</h3>
                        <p className="text-gray-500 text-sm font-medium">For business collaborations and detailed queries.</p>
                    </Link>
                </div>
            </section>

            {/* --- ORDERING FLOW --- */}
            <section className="max-w-[1280px] mx-auto px-4 mb-24">
                <div className="text-center space-y-4 mb-16">
                    <span className="text-sking-pink text-xs font-black uppercase tracking-[0.3em]">Easy Ordering</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">How it Works</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    {orderingSteps.map((step, idx) => (
                        <div key={idx} className="relative flex flex-col items-center text-center group">
                            <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-black/10 transition-all duration-500 mb-6">
                                {step.icon}
                            </div>
                            <h4 className="text-sm font-black uppercase italic mb-2 tracking-tight">{step.title}</h4>
                            <p className="text-gray-400 text-xs font-bold leading-relaxed">{step.desc}</p>

                            {idx < orderingSteps.length - 1 && (
                                <div className="hidden md:block absolute top-10 -right-4 w-8 h-[2px] bg-gray-100" />
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* --- SECURITY & TRUST --- */}
            <section className="bg-gray-50 py-24 px-4 mb-24">
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="w-20 h-20 bg-black text-white rounded-[32px] flex items-center justify-center shadow-xl">
                            <ShieldCheck size={40} />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.9]">
                            Safe, Secure & <br />
                            <span className="text-sking-pink">Transparent.</span>
                        </h2>
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start pb-6 border-b border-black/5 last:border-0 last:pb-0">
                                <div className="p-2 bg-green-500 text-white rounded-lg mt-1 italic">
                                    <Lock size={16} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black uppercase italic mb-1">Razorpay Payment Gateway</h4>
                                    <p className="text-gray-500 text-sm font-medium">Industry-standard SSL encryption and PCI DSS compliance for secure payments across India.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start pb-6 border-b border-black/5 last:border-0 last:pb-0">
                                <div className="p-2 bg-blue-500 text-white rounded-lg mt-1 italic">
                                    <Globe size={16} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black uppercase italic mb-1">Global Shipping Partners</h4>
                                    <p className="text-gray-500 text-sm font-medium">Partnered with leading logistics providers (Delhivery, BlueDart, Aramex) for timely delivery.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-sking-pink text-white rounded-lg mt-1 italic">
                                    <Heart size={16} fill="currentColor" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black uppercase italic mb-1">Trusted by Professionals</h4>
                                    <p className="text-gray-500 text-sm font-medium">Recommended by dermatologists and loved by beauty influencers across the globe.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[60px] p-12 shadow-2xl shadow-black/5 border border-black/5 space-y-12">
                        <div className="text-center space-y-4">
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter">Frequently Asked</h3>
                            <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">Quick answers to common queries</p>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                        <div className="text-center pt-8">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Still need help?</p>
                            <Link href="/contact" className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-sking-pink transition-all">
                                Go to Contact Page <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- LOCATIONS --- */}
            <section className="max-w-[1280px] mx-auto px-4 text-center space-y-12">
                <div className="space-y-4">
                    <span className="text-sking-pink text-xs font-black uppercase tracking-[0.3em]">We are everywhere</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">Our Hubs</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <div className="p-10 rounded-[40px] bg-white border border-black/5 shadow-xl shadow-black/5">
                        <h4 className="text-2xl font-black uppercase italic mb-4">India HQ</h4>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Kumbla, Kasargod,<br />
                            Kerala, India - 671321
                        </p>
                    </div>
                    <div className="p-10 rounded-[40px] bg-white border border-black/5 shadow-xl shadow-black/5">
                        <h4 className="text-2xl font-black uppercase italic mb-4">UAE Contact</h4>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Customer Support Hub,<br />
                            Dubai, United Arab Emirates
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HelpPage;
