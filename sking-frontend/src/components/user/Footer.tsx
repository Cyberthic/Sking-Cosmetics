"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Phone, Mail, Facebook, Instagram, MessageCircle, MapPin, X, ChevronRight, Truck, ShieldCheck, CreditCard, Globe, Users, Clock, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FooterModal = ({ title, isOpen, onClose, children }: { title: string, isOpen: boolean, onClose: () => void, children: React.ReactNode }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                        <div className="p-8 md:p-10">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-black uppercase tracking-tight italic">{title}</h3>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="space-y-6 text-gray-600 font-medium leading-relaxed max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                                {children}
                            </div>
                            <div className="mt-10">
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-sking-pink transition-all"
                                >
                                    Got It, Thanks
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default function Footer() {
    const [modalData, setModalData] = useState<{ title: string, content: React.ReactNode } | null>(null);

    const openModal = (title: string, content: React.ReactNode) => {
        setModalData({ title, content });
    };

    const MODAL_CONTENT = {
        delivery: (
            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-sking-pink/10 rounded-xl flex items-center justify-center text-sking-pink shrink-0"><Truck size={20} /></div>
                    <div>
                        <h4 className="text-black font-black uppercase text-xs tracking-widest mb-1">Fast Processing</h4>
                        <p className="text-sm">Orders are processed within 24-48 hours. Our team works tirelessly to ensure your beauty essentials are on their way as fast as possible.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shrink-0"><Package size={20} /></div>
                    <div>
                        <h4 className="text-black font-black uppercase text-xs tracking-widest mb-1">Premium Packaging</h4>
                        <p className="text-sm">Every order is packed with care using eco-friendly, secure materials to ensure your products arrive in pristine condition.</p>
                    </div>
                </div>
                <p className="text-xs text-gray-400 bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">"Your glowing skin is our goal, and we want it to reach you safe!"</p>
            </div>
        ),
        shipping: (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <h4 className="text-black font-black text-[10px] uppercase tracking-widest mb-2 font-mono">Domestic</h4>
                        <p className="text-lg font-black text-sking-pink tracking-tight italic">FREE over ₹999</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <h4 className="text-black font-black text-[10px] uppercase tracking-widest mb-2 font-mono">Global</h4>
                        <p className="text-lg font-black text-purple-600 tracking-tight italic">UAE, CA, USA</p>
                    </div>
                </div>
                <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2 font-bold"><ChevronRight size={14} className="text-sking-pink" /> Flat ₹50 for orders below ₹999</li>
                    <li className="flex items-center gap-2 font-bold"><ChevronRight size={14} className="text-sking-pink" /> 100% Insured shipments</li>
                    <li className="flex items-center gap-2 font-bold"><ChevronRight size={14} className="text-sking-pink" /> Real-time tracking via WhatsApp & Email</li>
                </ul>
            </div>
        ),
        secure: (
            <div className="space-y-6">
                <div className="flex items-center gap-4 py-4 border-b border-gray-100">
                    <ShieldCheck size={32} className="text-green-500" />
                    <div>
                        <h4 className="text-black font-bold uppercase text-sm">SSL Encrypted Checkout</h4>
                        <p className="text-xs">Your data is secured by 256-bit bank-grade encryption.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 py-4 border-b border-gray-100">
                    <CreditCard size={32} className="text-blue-500" />
                    <div>
                        <h4 className="text-black font-bold uppercase text-sm">PCI-DSS Compliant</h4>
                        <p className="text-xs">We do not store your CVV or sensitive card details.</p>
                    </div>
                </div>
            </div>
        ),
        payments: (
            <div className="space-y-6">
                <h4 className="text-black font-black uppercase text-xs tracking-widest text-center">Accepted Methods</h4>
                <div className="grid grid-cols-3 gap-3">
                    {['UPI', 'VISA', 'MasterCard', 'RuPay', 'NetBanking', 'Amex'].map(m => (
                        <div key={m} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center text-[10px] font-black uppercase tracking-widest text-gray-500">{m}</div>
                    ))}
                </div>
                <div className="p-4 bg-sking-pink/5 rounded-2xl border border-sking-pink/10">
                    <h4 className="text-sking-pink font-bold text-xs uppercase mb-1">Cash on Delivery</h4>
                    <p className="text-xs">Available for select pin codes across India with a small COD fee.</p>
                </div>
            </div>
        ),
        affiliates: (
            <div className="space-y-6">
                <div className="text-center p-6 bg-black text-white rounded-[2rem]">
                    <h4 className="text-2xl font-black italic tracking-tighter mb-2">Earn 10% Commission</h4>
                    <p className="text-xs text-gray-400 font-medium">Join our global beauty network today.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Users size={20} className="text-sking-pink" />
                        <h5 className="font-bold text-xs text-black uppercase">Weekly Payouts</h5>
                        <p className="text-[10px]">Get your earnings every Friday directly to your account.</p>
                    </div>
                    <div className="space-y-2">
                        <Globe size={20} className="text-purple-600" />
                        <h5 className="font-bold text-xs text-black uppercase">Global Reach</h5>
                        <p className="text-[10px]">Refer customers from UAE, India, or Canada.</p>
                    </div>
                </div>
            </div>
        ),
        timing: (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Clock size={32} className="text-sking-pink" />
                    <div>
                        <h4 className="text-black font-black uppercase text-sm">Estimated Timeline</h4>
                        <p className="text-xs">Timeline depends on your location.</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                        <span className="font-bold text-sm">Metros (India)</span>
                        <span className="font-black text-sking-pink">2-3 Days</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                        <span className="font-bold text-sm">Rest of India</span>
                        <span className="font-black text-sking-pink">4-5 Days</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                        <span className="font-bold text-sm">International (UAE)</span>
                        <span className="font-black text-purple-600">7-9 Days</span>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <footer className="bg-white pt-20 pb-8 text-black">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">

                {/* Logo Top Center */}
                <div className="flex flex-col items-center mb-16">
                    <Link href="/" className="text-4xl font-medium tracking-tighter text-black uppercase italic mb-4">
                        Sking<span className="text-sking-pink">.</span>
                    </Link>
                    <div className="w-12 h-1 bg-sking-pink rounded-full"></div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">

                    {/* 1. Contact */}
                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-[0.2em] text-[11px] text-gray-900 border-b border-gray-100 pb-2">Connect</h4>
                        <div className="space-y-5 text-sm font-medium">
                            <div className="flex items-start gap-3 group">
                                <Phone size={18} className="text-sking-pink mt-1" />
                                <div className="flex flex-col text-gray-600 group-hover:text-black transition-colors">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Call Us</span>
                                    <span>IN: +91 7012747466</span>
                                    <span>UAE: +971 553033576</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 group">
                                <Mail size={18} className="text-sking-pink mt-1" />
                                <div className="flex flex-col text-gray-600 group-hover:text-black transition-colors">
                                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Email Us</span>
                                    <span className="break-all whitespace-pre-wrap">skingfacebeautycosmetic916@gmail.com</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 pt-4">
                                <Link href="https://facebook.com" target="_blank" className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-sking-pink hover:text-white hover:shadow-lg transition-all"><Facebook size={18} /></Link>
                                <Link href="https://instagram.com" target="_blank" className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-sking-pink hover:text-white hover:shadow-lg transition-all"><Instagram size={18} /></Link>
                                <Link href="https://whatsapp.com" target="_blank" className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-sking-pink hover:text-white hover:shadow-lg transition-all"><MessageCircle size={18} /></Link>
                            </div>
                        </div>
                    </div>

                    {/* 2. Shop */}
                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-[0.2em] text-[11px] text-gray-900 border-b border-gray-100 pb-2">Account</h4>
                        <ul className="space-y-3 text-sm font-bold text-gray-500">
                            <li><Link href="/login" className="hover:text-sking-pink inline-flex items-center gap-2 group"><ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Sign In</Link></li>
                            <li><Link href="/cart" className="hover:text-sking-pink inline-flex items-center gap-2 group"><ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> View Bag</Link></li>
                            <li><Link href="/wishlist" className="hover:text-sking-pink inline-flex items-center gap-2 group"><ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> My Wishlist</Link></li>
                            <li><Link href="/orders" className="hover:text-sking-pink inline-flex items-center gap-2 group"><ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Tracking</Link></li>
                        </ul>
                    </div>

                    {/* 3. Info */}
                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-[0.2em] text-[11px] text-gray-900 border-b border-gray-100 pb-2">Policies</h4>
                        <ul className="space-y-3 text-sm font-bold text-gray-500">
                            <li><button onClick={() => openModal("Delivery Info", MODAL_CONTENT.delivery)} className="hover:text-sking-pink flex items-center gap-2 group uppercase tracking-widest text-[10px]"><ChevronRight size={12} className="text-sking-pink" /> Delivery Info</button></li>
                            <li><button onClick={() => openModal("Shipping Policy", MODAL_CONTENT.shipping)} className="hover:text-sking-pink flex items-center gap-2 group uppercase tracking-widest text-[10px]"><ChevronRight size={12} className="text-sking-pink" /> Shipping Guide</button></li>
                            <li><button onClick={() => openModal("Payment Methods", MODAL_CONTENT.payments)} className="hover:text-sking-pink flex items-center gap-2 group uppercase tracking-widest text-[10px]"><ChevronRight size={12} className="text-sking-pink" /> Payment Help</button></li>
                            <li><Link href="/contact" className="hover:text-sking-pink flex items-center gap-2 group uppercase tracking-widest text-[10px]"><ChevronRight size={12} className="text-sking-pink" /> Support Center</Link></li>
                        </ul>
                    </div>

                    {/* 4. Details */}
                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-[0.2em] text-[11px] text-gray-900 border-b border-gray-100 pb-2">Services</h4>
                        <ul className="space-y-3 text-sm font-bold text-gray-500">
                            <li><button onClick={() => openModal("Secure Shopping", MODAL_CONTENT.secure)} className="hover:text-sking-pink flex items-center gap-2 group uppercase tracking-widest text-[10px]"><ChevronRight size={12} className="text-sking-pink" /> Secure Experience</button></li>
                            <li><button onClick={() => openModal("Global Shipping", MODAL_CONTENT.shipping)} className="hover:text-sking-pink flex items-center gap-2 group uppercase tracking-widest text-[10px]"><ChevronRight size={12} className="text-sking-pink" /> International</button></li>
                            <li><button onClick={() => openModal("Timelines", MODAL_CONTENT.timing)} className="hover:text-sking-pink flex items-center gap-2 group uppercase tracking-widest text-[10px]"><ChevronRight size={12} className="text-sking-pink" /> Estimated Time</button></li>
                            <li><button onClick={() => openModal("Affiliate Program", MODAL_CONTENT.affiliates)} className="hover:text-sking-pink flex items-center gap-2 group uppercase tracking-widest text-[10px]"><ChevronRight size={12} className="text-sking-pink" /> Partners</button></li>
                        </ul>
                    </div>

                    {/* 5. Locations */}
                    <div className="space-y-6">
                        <h4 className="font-black uppercase tracking-[0.2em] text-[11px] text-gray-900 border-b border-gray-100 pb-2">Reach</h4>
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <MapPin size={20} className="text-sking-pink mb-3" />
                            <p className="text-[11px] font-bold text-gray-600 leading-relaxed uppercase tracking-widest">Kumbla, Kasargod,<br />Kerala, India<br />Pin: 671321</p>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <Link href="/privacy-policy" className="hover:text-sking-pink transition-colors">Privacy</Link>
                        <Link href="/terms-and-conditions" className="hover:text-sking-pink transition-colors">Terms</Link>
                        <span>&copy; {new Date().getFullYear()} SKING</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 opacity-20 grayscale">
                            <CreditCard size={20} />
                            <ShieldCheck size={20} />
                            <Globe size={20} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-300">Crafted for Radiance</span>
                    </div>
                </div>
            </div>

            {/* Modal Handler */}
            <FooterModal
                title={modalData?.title || ""}
                isOpen={!!modalData}
                onClose={() => setModalData(null)}
            >
                {modalData?.content}
            </FooterModal>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </footer>
    );
}
