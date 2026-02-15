"use client";

import React, { useState } from "react";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    MessageCircle,
    Send,
    Instagram,
    Facebook,
    Twitter,
    ChevronRight,
    Headphones
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        enquiryType: "Order Status",
        message: ""
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.message) {
            toast.error("Please fill in all required fields");
            return;
        }

        const whatsappMessage = `*New Contact Enquiry - Sking Cosmetics*\n\n` +
            `*Name:* ${formData.fullName}\n` +
            `*Email:* ${formData.email}\n` +
            `*Phone:* ${formData.phone || 'Not provided'}\n` +
            `*Enquiry Type:* ${formData.enquiryType}\n\n` +
            `*Message:*\n${formData.message}`;

        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/918590183737?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        toast.success("Redirecting to WhatsApp...");
    };

    return (
        <div className="flex-1 w-full bg-white">
            {/* --- HERO SECTION --- */}
            <section className="relative h-[400px] flex items-center justify-center overflow-hidden bg-black">
                {/* Background Decorative Circles */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sking-red/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-sking-pink/10 rounded-full blur-[100px]" />

                <div className="relative z-10 text-center px-4">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sking-pink font-bold uppercase tracking-[0.3em] text-sm mb-4 block"
                    >
                        Get in Touch
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-medium tracking-tighter text-white italic"
                    >
                        CONTACT SKING<span className="text-sking-red">.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 text-gray-400 max-w-xl mx-auto text-lg font-light leading-relaxed"
                    >
                        Whether you have a question about products, orders, or just want to say hello, we're here to help you glow.
                    </motion.p>
                </div>
            </section>

            {/* --- MAIN CONTENT --- */}
            <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* LEFT: Contact Information */}
                    <div className="lg:col-span-5 space-y-12">
                        <div>
                            <h2 className="text-3xl font-medium tracking-tight text-black mb-8 italic border-l-4 border-sking-pink pl-6 uppercase">
                                Connect With Us
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-10 text-lg font-light">
                                Our dedicated team of beauty experts is available around the clock to ensure your experience with Sking Cosmetics is nothing short of extraordinary.
                            </p>
                        </div>

                        {/* INFO CARDS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">

                            {/* Card 1: Customer Support */}
                            <motion.div
                                whileHover={{ x: 10 }}
                                className="group flex items-start gap-6 p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-sking-pink/5"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-sking-pink transition-all">
                                    <Headphones size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-black uppercase tracking-widest text-xs mb-2">Customer Support</h3>
                                    <p className="text-lg font-medium text-black">India: +91 70127 47466</p>
                                    <p className="text-lg font-medium text-black">UAE: +971 55303 3576</p>
                                    <p className="text-sm text-gray-500 mt-1">Available 24/7 for you.</p>
                                </div>
                            </motion.div>

                            {/* Card 2: Email Us */}
                            <motion.div
                                whileHover={{ x: 10 }}
                                className="group flex items-start gap-6 p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-sking-pink/5"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-sking-red transition-all">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-black uppercase tracking-widest text-xs mb-2">Write to Us</h3>
                                    <p className="text-base font-medium text-black break-all">skingfacebeautycosmetic916@gmail.com</p>
                                    <p className="text-sm text-gray-500 mt-1">Expect a reply within 4 hours.</p>
                                </div>
                            </motion.div>

                            {/* Card 3: HQ Address */}
                            <motion.div
                                whileHover={{ x: 10 }}
                                className="group flex items-start gap-6 p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-sking-pink/5"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-black uppercase tracking-widest text-xs mb-2">Our Studio</h3>
                                    <p className="text-lg font-medium text-black leading-snug">
                                        Kumbla, Kasargod,<br />
                                        Kerala, India - 671321
                                    </p>
                                </div>
                            </motion.div>

                        </div>

                        {/* SOCIAL LINKS */}
                        <div className="pt-8 flex items-center gap-6">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Follow Glow</span>
                            <div className="flex gap-4">
                                {[
                                    { icon: <Instagram size={20} />, color: "hover:bg-pink-600", link: "https://www.instagram.com/sking_cosmetic_/" },
                                    { icon: <Facebook size={20} />, color: "hover:bg-blue-600", link: "https://www.facebook.com/sking.coz/" },
                                    { icon: <MessageCircle size={20} />, color: "hover:bg-green-500", link: "https://wa.me/918590183737" }
                                ].map((item, idx) => (
                                    <a key={idx} href={item.link} target="_blank" className={`w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 transition-all hover:text-white hover:border-transparent ${item.color}`}>
                                        {item.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Contact Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/5 border border-gray-100">
                            <h2 className="text-3xl font-medium text-black mb-2 italic">Send a Message</h2>
                            <p className="text-gray-500 mb-10 font-light">Fields marked with * are required to help us serve you better.</p>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-black/60">Full Name *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                            required
                                            className="w-full h-14 px-6 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-sking-pink focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-black/60">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                            required
                                            className="w-full h-14 px-6 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-sking-pink focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-black/60">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 00000 00000"
                                            className="w-full h-14 px-6 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-sking-pink focus:bg-white transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-black/60">Enquiry Type</label>
                                        <div className="relative">
                                            <select
                                                name="enquiryType"
                                                value={formData.enquiryType}
                                                onChange={handleInputChange}
                                                className="w-full h-14 px-6 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-sking-pink focus:bg-white transition-all appearance-none cursor-pointer"
                                            >
                                                <option>Order Status</option>
                                                <option>Product Inquiry</option>
                                                <option>Shipping & Returns</option>
                                                <option>Business Collaboration</option>
                                                <option>Other</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <ChevronRight size={18} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-black/60">Your Message *</label>
                                    <textarea
                                        rows={5}
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder="Tell us what's on your mind..."
                                        required
                                        className="w-full p-6 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-sking-pink focus:bg-white transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-16 bg-black text-white rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-sking-pink transition-all group overflow-hidden relative shadow-xl active:scale-95"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        Dispatch Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-sking-red translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </section>

            {/* --- MAP / FOOTER CALLOUT --- */}
            <section className="bg-gray-50 py-20 px-4">
                <div className="max-w-[800px] mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-sking-pink/20 bg-sking-pink/5 text-sking-pink text-xs font-bold uppercase tracking-widest">
                        <Clock size={14} /> 24/7 Digital Concierge
                    </div>
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-black italic">
                        Want a faster response?
                    </h2>
                    <p className="text-gray-500 text-lg font-light leading-relaxed">
                        Connect with our AI-powered Beauty Bot on WhatsApp for instant order tracking,
                        shade matching, and common skincare troubleshooting.
                    </p>
                    <div className="pt-4">
                        <a
                            href="https://wa.me/918590183737"
                            target="_blank"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-green-500 text-white rounded-2xl font-bold shadow-xl shadow-green-200 hover:brightness-110 active:scale-95 transition-all text-lg"
                        >
                            <MessageCircle size={24} /> WhatsApp Support
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
