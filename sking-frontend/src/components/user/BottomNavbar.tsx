"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, Menu, LayoutGrid } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setDrawerOpen } from "@/redux/features/cartSlice";
import { useEffect, useState } from "react";

const BottomNavbar = () => {
    const pathname = usePathname();
    const { totalItems } = useSelector((state: RootState) => state.cart);
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
    const dispatch = useDispatch<AppDispatch>();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = [
        {
            name: "Home",
            icon: Home,
            href: "/",
        },
        {
            name: "Shop",
            icon: LayoutGrid,
            href: "/shop",
        },
        {
            name: "Cart",
            icon: ShoppingBag,
            isCart: true,
            badge: totalItems,
        },
        {
            name: "Wish",
            icon: Heart,
            href: "/wishlist",
            badge: wishlistItems.length,
        },
        {
            name: "Menu",
            icon: Menu,
            isMenu: true,
        },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-[1100] px-1 pb-safe-area-inset-bottom">
            <div className="flex items-center justify-around h-full">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    if (item.isCart) {
                        return (
                            <button
                                key={item.name}
                                onClick={() => dispatch(setDrawerOpen(true))}
                                className={`flex flex-col items-center justify-center gap-1 w-full h-full text-gray-400 transition-all duration-300 active:scale-90`}
                            >
                                <div className="relative">
                                    <Icon className="w-5 h-5" />
                                    {mounted && item.badge !== undefined && item.badge > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-sking-red text-[7px] text-white font-black">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                                    {item.name}
                                </span>
                            </button>
                        );
                    }

                    if (item.isMenu) {
                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    window.dispatchEvent(new CustomEvent('toggleMobileMenu'));
                                }}
                                className={`flex flex-col items-center justify-center gap-1 w-full h-full text-gray-400 transition-all duration-300 active:scale-95`}
                            >
                                <div className="relative">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                                    {item.name}
                                </span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.name}
                            href={item.href || "#"}
                            className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300 active:scale-95 ${isActive ? "text-sking-pink" : "text-gray-400"
                                }`}
                        >
                            <div className="relative">
                                <Icon
                                    className={`w-5 h-5 transition-all duration-300 ${isActive ? "scale-110" : "scale-100"
                                        }`}
                                />
                                {mounted && item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-sking-red text-[7px] text-white font-black">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? "opacity-100 font-bold" : "opacity-60"}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNavbar;
