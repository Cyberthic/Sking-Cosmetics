"use client";
import Link from "next/link";
import { Phone, Mail, Facebook, Instagram, MessageCircle, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white pt-20 pb-8 text-black">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">

                {/* Logo Top Center */}
                <div className="flex justify-center mb-16">
                    <Link href="/" className="text-4xl font-medium tracking-tighter text-black uppercase italic">
                        Sking<span className="text-sking-red">.</span>
                    </Link>
                </div>

                {/* 5 Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">

                    {/* 1. Contact Info */}
                    <div className="space-y-6">
                        <h4 className="font-bold uppercase tracking-widest text-sm text-gray-900">Contact Information</h4>
                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="flex items-center gap-3">
                                <Phone size={18} className="text-gray-900 flex-shrink-0" />
                                <div className="flex flex-col">
                                    <span>India: +91 7012747466</span>
                                    <span>UAE: +971 553033576</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-gray-900 flex-shrink-0" />
                                <span className="break-all whitespace-pre-wrap">skingfacebeautycosmetic916@gmail.com</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-gray-900 flex-shrink-0 mt-0.5" />
                                <span>Kumbla, Kasargod, Kerala, India - 671321</span>
                            </div>
                            <div className="flex items-center gap-4 pt-2">
                                <Link href="https://www.facebook.com/sking.coz/" target="_blank" className="hover:text-sking-pink transition-all">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm">
                                        <Facebook size={16} />
                                    </div>
                                </Link>
                                <Link href="https://www.instagram.com/sking_cosmetic_/" target="_blank" className="hover:text-sking-pink transition-all">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm">
                                        <Instagram size={16} />
                                    </div>
                                </Link>
                                <Link href="https://wa.me/918590183737" target="_blank" className="hover:text-sking-pink transition-all">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm">
                                        <MessageCircle size={16} />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* 2. My Account */}
                    <div className="space-y-6">
                        <h4 className="font-bold uppercase tracking-widest text-sm text-gray-900">My Account</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/login" className="hover:text-sking-pink transition-colors">Sign In</Link></li>
                            <li><Link href="/cart" className="hover:text-sking-pink transition-colors">New Bag</Link></li>
                            <li><Link href="/wishlist" className="hover:text-sking-pink transition-colors">My Wishlist</Link></li>
                            <li><Link href="/orders" className="hover:text-sking-pink transition-colors">Track My Order</Link></li>
                            <li><Link href="/help" className="hover:text-sking-pink transition-colors">Help</Link></li>
                        </ul>
                    </div>

                    {/* 3. Information */}
                    <div className="space-y-6">
                        <h4 className="font-bold uppercase tracking-widest text-sm text-gray-900">Information</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/delivery" className="hover:text-sking-pink transition-colors">Delivery Information</Link></li>
                            <li><Link href="/blog" className="hover:text-sking-pink transition-colors">Blog</Link></li>
                            <li><Link href="/faq" className="hover:text-sking-pink transition-colors">FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-sking-pink transition-colors">Contact Us</Link></li>
                            <li><Link href="/sitemap" className="hover:text-sking-pink transition-colors">Sitemap</Link></li>
                        </ul>
                    </div>

                    {/* 4. Customer Services */}
                    <div className="space-y-6">
                        <h4 className="font-bold uppercase tracking-widest text-sm text-gray-900">Customer Services</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/shipping" className="hover:text-sking-pink transition-colors">Shipping Information</Link></li>
                            <li><Link href="/security" className="hover:text-sking-pink transition-colors">Secure Shopping</Link></li>
                            <li><Link href="/international" className="hover:text-sking-pink transition-colors">International Shipping</Link></li>
                            <li><Link href="/affiliates" className="hover:text-sking-pink transition-colors">Affiliates</Link></li>
                            <li><Link href="/contact" className="hover:text-sking-pink transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* 5. Payment & Shipping */}
                    <div className="space-y-6">
                        <h4 className="font-bold uppercase tracking-widest text-sm text-gray-900">Payment & Shipping</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/terms" className="hover:text-sking-pink transition-colors">Terms of Us</Link></li>
                            <li><Link href="/payment" className="hover:text-sking-pink transition-colors">Payment Methods</Link></li>
                            <li><Link href="/shipping-guide" className="hover:text-sking-pink transition-colors">Shipping Guide</Link></li>
                            <li><Link href="/locations" className="hover:text-sking-pink transition-colors">Locations We Ship To</Link></li>
                            <li><Link href="/timing" className="hover:text-sking-pink transition-colors">Estimated Delivery Time</Link></li>
                        </ul>
                    </div>

                </div>

                {/* Pink Divider Line */}
                <div className="h-0.5 w-full bg-sking-pink mb-8"></div>

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-500">
                    <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
                    <span className="hidden md:inline">|</span>
                    <Link href="/terms" className="hover:text-black transition-colors">Terms & Condition</Link>
                    <span className="hidden md:inline">|</span>
                    <span>&copy; {new Date().getFullYear()} Sking Cosmetics. All Rights Reserved.</span>
                </div>
            </div>
        </footer>
    );
}
