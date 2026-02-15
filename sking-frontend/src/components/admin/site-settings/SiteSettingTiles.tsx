"use client";
import React from "react";
import { motion } from "framer-motion";
import {
    MessageCircle,
    Zap,
    Star,
    Monitor,
    Phone,
    Share2,
    Search,
    Mail,
    CreditCard,
    Image as ImageIcon,
    BarChart3,
    ShieldAlert,
    ChevronRight,
    Globe,
    Settings2,
    Bell,
    Palette,
    Truck
} from "lucide-react";
import Link from "next/link";

interface TileProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    className?: string;
    color: string;
    delay?: number;
}

const SettingTile = ({ title, description, icon, href, className, color, delay = 0 }: TileProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className={`relative group overflow-hidden rounded-[2rem] border border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900/50 backdrop-blur-xl p-8 shadow-sm hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 ${className}`}
        >
            <Link href={href} className="flex flex-col h-full">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    {icon}
                </div>

                <div className="mt-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors duration-300">
                        {title}
                    </h3>
                    <p className="mt-3 text-base text-gray-500 dark:text-gray-400 leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="mt-auto pt-8 flex items-center text-sm font-semibold text-brand-500 transform translate-x-[-10px] group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    Tailor Settings <ChevronRight size={18} className="ml-1 group-hover:ml-2 transition-all" />
                </div>

                {/* Dynamic Background Gradient */}
                <div className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${color}`} />

                {/* Subtle glass effect highlight */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
        </motion.div>
    );
};

export const SiteSettingTiles = () => {
    const tiles = [
        {
            title: "Order Config",
            description: "Control ordering flow. Toggle WhatsApp ordering and Online Secure Payments.",
            icon: <Settings2 size={28} />,
            href: "/admin/site-settings/orders",
            className: "col-span-12 md:col-span-6 lg:col-span-1 row-span-1",
            color: "bg-orange-600",
        },
        {
            title: "Delivery & Shipping",
            description: "Manage delivery charges, free shipping thresholds, and shipping zones.",
            icon: <Truck size={28} />,
            href: "/admin/site-settings/delivery",
            className: "col-span-12 md:col-span-6 lg:col-span-1 row-span-1",
            color: "bg-teal-600",
        },
        {
            title: "Hero Section",
            description: "Craft your first impression. Manage home page sliders, hero banners, and primary marketing nodes.",
            icon: <Monitor size={28} />,
            href: "/admin/site-settings/hero",
            className: "col-span-12 lg:col-span-2 row-span-1",
            color: "bg-blue-600",
        },
        {
            title: "Flash Sale",
            description: "Driving urgency. Set up limited-time countdowns and exclusive deal banners.",
            icon: <Zap size={28} />,
            href: "/admin/site-settings/flash-sale",
            className: "col-span-12 md:col-span-6 lg:col-span-1 row-span-1",
            color: "bg-orange-500",
        },
        {
            title: "Contact Info",
            description: "Stay reachable. Update store locations, support numbers, and official emails.",
            icon: <Phone size={28} />,
            href: "/admin/site-settings/contact",
            className: "col-span-12 md:col-span-6 lg:col-span-1 row-span-1",
            color: "bg-emerald-500",
        },
        {
            title: "WhatsApp Messaging",
            description: "Direct customer engagement. Configure automated notifications, order alerts, and live support chat integration via Twilio.",
            icon: <MessageCircle size={28} />,
            href: "/admin/site-settings/whatsapp",
            className: "col-span-12 lg:col-span-2 row-span-2",
            color: "bg-green-500",
        },
        {
            title: "Featured Products",
            description: "Showcase the best. Curate collections for the homepage, trending sections, and seasonal highlights to boost conversion.",
            icon: <Star size={28} />,
            href: "/admin/site-settings/featured",
            className: "col-span-12 lg:col-span-2 row-span-2",
            color: "bg-purple-600",
        },
        {
            title: "Social Media Hub",
            description: "Sync your buzz. Connect Instagram, Facebook, and TikTok feeds directly to your storefront.",
            icon: <Share2 size={28} />,
            href: "/admin/site-settings/social",
            className: "col-span-12 md:col-span-6 lg:col-span-1 row-span-1",
            color: "bg-pink-500",
        },
        {
            title: "Theme Branding",
            description: "Visual identity. Customize primary colors, typography, and site-wide aesthetic tokens.",
            icon: <Palette size={28} />,
            href: "/admin/site-settings/theme",
            className: "col-span-12 md:col-span-6 lg:col-span-1 row-span-1",
            color: "bg-indigo-500",
        },
        {
            title: "SEO Optimizer",
            description: "Rank higher. Manage meta tags, Open Graph images, and site-map configurations.",
            icon: <Search size={28} />,
            href: "/admin/site-settings/seo",
            className: "col-span-12 md:col-span-6 lg:col-span-1 row-span-1",
            color: "bg-amber-500",
        },
        {
            title: "Notifications",
            description: "Stay in touch. Manage browser push notifications and site-wide announcement bars.",
            icon: <Bell size={28} />,
            href: "/admin/site-settings/notifications",
            className: "col-span-12 md:col-span-6 lg:col-span-1 row-span-1",
            color: "bg-yellow-500",
        },
        {
            title: "Email Templates",
            description: "Professional reach. Customize transactional emails for orders, shipping, and account updates.",
            icon: <Mail size={28} />,
            href: "/admin/site-settings/email",
            className: "col-span-12 md:col-span-6 lg:col-span-1 row-span-1",
            color: "bg-cyan-500",
        },
        {
            title: "Payment Systems",
            description: "Secure transactions. Toggle Razorpay, Cash on Delivery, and international gateways.",
            icon: <CreditCard size={28} />,
            href: "/admin/site-settings/payments",
            className: "col-span-12 md:col-span-6 lg:col-span-1 row-span-1",
            color: "bg-slate-800",
        },
        {
            title: "Region & Currency",
            description: "Go global. Set base currency, tax regions, and multi-language support options.",
            icon: <Globe size={28} />,
            href: "/admin/site-settings/localization",
            className: "col-span-12 md:col-span-6 lg:col-span-1 row-span-1",
            color: "bg-blue-400",
        },
        {
            title: "General Config",
            description: "The essentials. Manage site name, logo, favicon, and copyright information.",
            icon: <Settings2 size={28} />,
            href: "/admin/site-settings/general",
            className: "col-span-12 md:col-span-6 lg:col-span-1 row-span-1",
            color: "bg-gray-700",
        },
        {
            title: "Ad Banners",
            description: "Monetize and promote. Manage secondary promotional banners across various site sections.",
            icon: <ImageIcon size={28} />,
            href: "/admin/site-settings/banners",
            className: "col-span-12 lg:col-span-2 row-span-1",
            color: "bg-rose-500",
        },
        {
            title: "Performance",
            description: "Site speed. Integrate Google Analytics, Heatmaps, and monitor server health metrics.",
            icon: <BarChart3 size={28} />,
            href: "/admin/site-settings/analytics",
            className: "col-span-12 md:col-span-6 lg:col-span-1 row-span-1",
            color: "bg-violet-600",
        },

        {
            title: "Maintenance",
            description: "Safe updates. Toggle maintenance mode and customize the temporary status page.",
            icon: <ShieldAlert size={28} />,
            href: "/admin/site-settings/maintenance",
            className: "col-span-12 md:col-span-6 lg:col-span-1 row-span-1",
            color: "bg-red-600",
        },
    ];

    return (
        <div className="grid grid-cols-12 lg:grid-cols-4 gap-8">
            {tiles.map((tile, index) => (
                <SettingTile
                    key={index}
                    title={tile.title}
                    description={tile.description}
                    icon={tile.icon}
                    href={tile.href}
                    className={tile.className}
                    color={tile.color}
                    delay={index * 0.05}
                />
            ))}
        </div>
    );
};
