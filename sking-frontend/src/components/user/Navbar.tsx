"use client";

import Link from "next/link";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/features/authSlice";
import { userAuthService } from "@/services/user/userAuthApiService";
import { toast } from "sonner";
import { RootState } from "@/redux/store";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await userAuthService.logout();
            dispatch(logout());
            setShowUserMenu(false);
            toast.success('Logged out successfully');
            router.push('/');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    const navLinks = [
        { name: "New Arrivals", href: "/new-arrivals" },
        { name: "Best Sellers", href: "/best-sellers" },
        { name: "Makeup", href: "/shop/makeup" },
        { name: "Skincare", href: "/shop/skincare" },
        { name: "Offers", href: "/offers", highlight: true },
        { name: "Gift Sets", href: "/shop/gifts" },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled ? "bg-black/95 backdrop-blur-md shadow-lg py-4" : "bg-transparent py-8"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Logo */}
                    <Link href="/" className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase italic">
                        Sking<span className="text-sking-red">.</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-sking-pink ${link.highlight ? "text-sking-red" : "text-white"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center gap-4 text-white">
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="hover:text-sking-pink transition-colors"
                        >
                            <Search size={22} />
                        </button>
                        <Link href="/wishlist" className="hidden md:block hover:text-sking-pink transition-colors">
                            <Heart size={22} />
                        </Link>

                        {isAuthenticated ? (
                            <div className="relative">
                                <button onClick={() => setShowUserMenu(!showUserMenu)} className="hover:text-sking-pink transition-colors">
                                    <User size={22} />
                                </button>
                                {showUserMenu && (
                                    <div className="absolute top-full right-0 mt-4 w-48 bg-white text-black rounded-lg shadow-xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
                                            <p className="text-sm font-bold truncate">{user?.username || 'User'}</p>
                                        </div>
                                        <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 text-sm">Profile</Link>
                                        <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100 text-sm">Orders</Link>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm font-medium">Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="hover:text-sking-pink transition-colors">
                                <User size={22} />
                            </Link>
                        )}

                        <Link href="/cart" className="relative hover:text-sking-pink transition-colors">
                            <ShoppingBag size={22} />
                            {/* Mock cart count */}
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sking-red text-[10px] text-white">
                                0
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`fixed inset-0 top-[60px] bg-black z-40 lg:hidden transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="flex flex-col p-6 gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-xl font-bold uppercase tracking-widest ${link.highlight ? "text-sking-red" : "text-white"
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Click outside to close user menu */}
                {showUserMenu && (
                    <div
                        className="fixed inset-0 z-30"
                        onClick={() => setShowUserMenu(false)}
                    />
                )}
            </header>

            {/* Spacer for fixed header */}
            <div className={`h-[68px] ${isScrolled ? "block" : "hidden"}`}></div>
        </>
    );
}