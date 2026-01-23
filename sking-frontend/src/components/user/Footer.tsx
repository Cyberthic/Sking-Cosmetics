"use client";
import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-20 pb-10 border-t border-gray-900">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand & Newsletter */}
                    <div className="md:col-span-1 space-y-6">
                        <h2 className="text-3xl font-black tracking-tighter italic uppercase">Sking<span className="text-sking-red">.</span></h2>
                        <p className="text-gray-400 text-sm">
                            Bold beauty for the fearless. <br />
                            Cruelty-free & Vegan.
                        </p>
                        <form className="space-y-4">
                            <p className="font-bold uppercase tracking-widest text-sm">Subscribe & Get 10% Off</p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="bg-gray-900 border-none px-4 py-3 text-sm flex-1 focus:ring-1 focus:ring-sking-red outline-none"
                                />
                                <button className="bg-sking-red text-black px-4 py-3 font-bold uppercase text-xs hover:bg-sking-soft-pink transition-colors">
                                    Join
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold uppercase tracking-widest mb-6">Shop</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link href="/shop/makeup" className="hover:text-white hover:underline">Makeup</Link></li>
                            <li><Link href="/shop/skincare" className="hover:text-white hover:underline">Skincare</Link></li>
                            <li><Link href="/new-arrivals" className="hover:text-white hover:underline">New Arrivals</Link></li>
                            <li><Link href="/best-sellers" className="hover:text-white hover:underline">Best Sellers</Link></li>
                            <li><Link href="/shop/kits" className="hover:text-white hover:underline">Combos & Kits</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase tracking-widest mb-6">Support</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link href="/help" className="hover:text-white hover:underline">Help Center</Link></li>
                            <li><Link href="/track-order" className="hover:text-white hover:underline">Track Order</Link></li>
                            <li><Link href="/shipping" className="hover:text-white hover:underline">Shipping Policy</Link></li>
                            <li><Link href="/returns" className="hover:text-white hover:underline">Returns & Refunds</Link></li>
                            <li><Link href="/contact" className="hover:text-white hover:underline">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase tracking-widest mb-6">About</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><Link href="/about" className="hover:text-white hover:underline">Our Story</Link></li>
                            <li><Link href="/sustainability" className="hover:text-white hover:underline">Sustainability</Link></li>
                            <li><Link href="/careers" className="hover:text-white hover:underline">Careers</Link></li>
                            <li><Link href="/blog" className="hover:text-white hover:underline">Blog</Link></li>
                            <li><Link href="/privacy" className="hover:text-white hover:underline">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-900 gap-4">
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-sking-pink transition-colors">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-blue-600 transition-colors">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-red-600 transition-colors">
                            <Youtube size={20} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-blue-400 transition-colors">
                            {/* Twitter/X icon */}
                            <Twitter size={20} />
                        </a>
                    </div>
                    <p className="text-gray-600 text-xs text-center md:text-right">
                        &copy; 2026 Sking Cosmetics. All rights reserved. <br />
                        Made with ❤️ in India.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
