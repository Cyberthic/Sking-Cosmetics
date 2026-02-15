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
            title: "Flash Sale",
            description: "Driving urgency. Set up limited-time countdowns and exclusive deal banners.",
            icon: <Zap size={28} />,
            href: "/admin/site-settings/flash-sale",
            className: "col-span-12 md:col-span-6 lg:col-span-1 row-span-1",
            color: "bg-orange-500",
        },
        {
            title: "Featured Products",
            description: "Showcase the best. Curate collections for the homepage to boost conversion.",
            icon: <Star size={28} />,
            href: "/admin/site-settings/featured",
            className: "col-span-12 md:col-span-6 lg:col-span-1 row-span-1",
            color: "bg-purple-600",
        },
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
