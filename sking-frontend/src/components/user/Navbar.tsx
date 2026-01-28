"use client";

import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Headphones, Phone, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/redux/features/authSlice";
import { fetchCart, setDrawerOpen } from "@/redux/features/cartSlice"; // Import fetchCart and setDrawerOpen
import { fetchWishlist } from "@/redux/features/wishlistSlice";
import { userAuthService } from "@/services/user/userAuthApiService";
import { userCategoryService } from "@/services/user/userCategoryApiService"; // Add this
import { toast } from "sonner";
import { RootState, AppDispatch } from "@/redux/store"; // Import AppDispatch
import CartDrawer from "./CartDrawer";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    // Redux
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { totalAmount, totalItems, isDrawerOpen } = useSelector((state: RootState) => state.cart);
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const pathname = usePathname();

    const setIsCartOpen = (open: boolean) => dispatch(setDrawerOpen(open));

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await userCategoryService.getCategories();
                if (data.success) {
                    setCategories(data.categories);
                }
            } catch (error) {
                console.error("Failed to fetch categories");
            }
        };
        fetchCategories();
    }, []);

    // Fetch cart and wishlist on mount
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
            dispatch(fetchWishlist());
        }
    }, [dispatch, isAuthenticated]);

    // Handle Scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
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

    // Nav Structure
    const mainLinks = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop", hasDropdown: true },
        { name: "Product", href: "/products", hasDropdown: true },
        { name: "Blog", href: "/blog", hasDropdown: true },
        { name: "Contact", href: "/contact", hasDropdown: false },
        { name: "About", href: "/about", hasDropdown: false },
    ];

    return (
        <>
            <header className={`w-full z-[999] sticky top-0 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"}`}>

                {/* --- TOP SECTION --- */}
                <div className="border-b border-gray-200">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">

                        {/* LEFT: Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="text-3xl font-medium tracking-tighter text-black uppercase italic">
                                Sking<span className="text-sking-red">.</span>
                            </Link>
                        </div>

                        {/* RIGHT: Actions */}
                        <div className="hidden lg:flex items-center h-full gap-8">

                            {/* SEARCH BAR */}
                            <div className="relative group mr-2">
                                <input
                                    type="text"
                                    placeholder="Search for products and brands"
                                    className="w-80 h-11 pl-4 pr-10 bg-white border border-gray-400 rounded text-sm text-black focus:outline-none focus:border-sking-pink transition-all placeholder:text-gray-500"
                                />
                                <button className="absolute right-3 top-0 h-11 flex items-center justify-center text-gray-500 group-hover:text-sking-pink transition-colors">
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>

                            {/* LOGIN / SIGNUP */}
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 text-sm font-medium text-black hover:text-sking-pink transition-colors"
                                    >
                                        <div className="p-2 border border-black rounded-full">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <span className="max-w-[120px] truncate">{user?.username || 'Account'}</span>
                                    </button>
                                    {showUserMenu && (
                                        <div className="absolute top-full right-0 mt-4 w-52 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2">
                                            <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                                                <p className="text-sm font-medium uppercase tracking-wide truncate">{user?.username || 'User'}</p>
                                                <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                                            </div>
                                            <Link href="/profile" className="block px-5 py-3 hover:bg-gray-50 text-sm font-medium transition-colors">Profile</Link>
                                            <Link href="/orders" className="block px-5 py-3 hover:bg-gray-50 text-sm font-medium transition-colors">Orders</Link>
                                            <div className="h-px bg-gray-100 my-1"></div>
                                            <button onClick={handleLogout} className="block w-full text-left px-5 py-3 hover:bg-red-50 text-red-600 text-sm font-medium transition-colors">Logout</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 cursor-pointer hover:text-sking-pink transition-colors">
                                    <div className="p-2 border border-black rounded-full">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-medium text-black">
                                        <Link href="/login" className="hover:text-sking-pink transition-colors">Log in</Link>
                                        <span className="text-gray-400 mx-1">/</span>
                                        <Link href="/register" className="hover:text-sking-pink transition-colors">Sign Up</Link>
                                    </div>
                                </div>
                            )}

                            {/* Divider Line */}
                            <div className="h-10 w-px bg-gray-400"></div>

                            {/* WISHLIST */}
                            <Link href="/wishlist" className="p-2 text-black hover:text-sking-pink transition-colors relative group">
                                <Heart className="w-6 h-6" />
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] text-white font-bold group-hover:bg-sking-pink transition-colors">
                                    {wishlistItems.length}
                                </span>
                            </Link>

                            {/* MY BAG */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="flex items-center gap-3 group pl-2"
                            >
                                <div className="relative">
                                    <ShoppingBag className="w-6 h-6 text-black" />
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-sking-red text-[10px] text-white font-medium">
                                        {totalItems}
                                    </span>
                                </div>
                                <div className="flex flex-col items-start leading-tight">
                                    <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mb-0.5">My Bag</span>
                                    <span className="text-sm font-medium text-black tabular-nums">
                                        (₹{totalAmount.toLocaleString()})
                                    </span>
                                </div>
                            </button>

                        </div>

                        {/* MOBILE MENU TOGGLE */}
                        <button
                            className="lg:hidden p-2 text-black"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* --- BOTTOM SECTION (Desktop Only) --- */}
                <div className="hidden lg:block border-b border-gray-200 h-14 bg-white">
                    <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-full flex items-center justify-between">

                        {/* LEFT: Nav */}
                        <div className="flex items-center h-full">

                            {/* ALL CATEGORIES */}
                            <div className="h-full group relative flex items-center">
                                <button className="h-full flex items-center gap-2 text-sking-pink font-bold text-sm hover:brightness-110 transition-all">
                                    All Categories
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                {/* Dropdown placeholder */}
                                <div className="absolute top-full left-0 w-64 bg-white shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left z-50">
                                    <div className="py-2">
                                        {categories.length > 0 ? (
                                            categories.map((cat) => (
                                                <Link key={cat._id} href={`/shop?category=${cat._id}`} className="block px-6 py-2.5 text-sm text-black hover:bg-gray-50 hover:text-sking-pink transition-colors">
                                                    {cat.name}
                                                </Link>
                                            ))
                                        ) : (
                                            <p className="px-6 py-2.5 text-sm text-gray-400">Loading...</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* LINKS */}
                            <nav className="flex items-center h-full ml-4">
                                {mainLinks.map((link) => (
                                    <div key={link.name} className="h-full relative group px-4 flex items-center">
                                        <Link
                                            href={link.href}
                                            className="flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-black group-hover:text-sking-pink transition-colors"
                                        >
                                            {link.name}
                                            {link.hasDropdown && <ChevronDown className="w-3 h-3 opacity-50" />}
                                        </Link>

                                        {/* Simple Dropdown for Demo */}
                                        {link.hasDropdown && (
                                            <div className="absolute top-full left-0 w-48 bg-white shadow-xl border-t-2 border-sking-pink opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                                <div className="py-2">
                                                    <Link href="#" className="block px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-sking-pink">New Arrival</Link>
                                                    <Link href="#" className="block px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-sking-pink">Best Sellers</Link>
                                                    <Link href="#" className="block px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-sking-pink">Featured</Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* RIGHT: Support */}
                        <div className="flex items-center gap-3">
                            <Headphones className="w-10 h-10 text-black stroke-[1.5]" />
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-xl font-medium text-sking-pink tracking-tight">+99327456</span>
                                <span className="text-[11px] text-gray-400 font-medium tracking-wide mt-1">24/7 Support Center</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- MOBILE MENU --- */}
                <div className={`fixed inset-0 top-[80px] bg-white z-40 lg:hidden overflow-y-auto transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="flex flex-col p-6 gap-2">
                        {/* Search Mobile */}
                        <div className="relative mb-6">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full h-12 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                            />
                            <Search className="absolute right-4 top-3.5 w-5 h-5 text-gray-400" />
                        </div>

                        {mainLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-lg font-medium uppercase tracking-wide py-3 border-b border-gray-50 text-gray-800"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {!isAuthenticated && (
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-center border border-black rounded font-medium uppercase text-sm">Login</Link>
                                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-center bg-black text-white rounded font-medium uppercase text-sm">Register</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Overlay for user menu click-outside */}
                {showUserMenu && (
                    <div className="fixed inset-0 z-[55] lg:hidden" onClick={() => setShowUserMenu(false)} />
                )}

                <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsCartOpen(false)} />
            </header>
        </>
    );
}