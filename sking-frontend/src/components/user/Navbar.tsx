"use client";

import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Headphones, Phone, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { logout } from "@/redux/features/authSlice";
import { fetchCart, setDrawerOpen } from "@/redux/features/cartSlice"; // Import fetchCart and setDrawerOpen
import { fetchWishlist } from "@/redux/features/wishlistSlice";
import { userAuthService } from "@/services/user/userAuthApiService";
import { userProductService } from "@/services/user/userProductApiService";
import { userCategoryService } from "@/services/user/userCategoryApiService";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { RootState, AppDispatch } from "@/redux/store"; // Import AppDispatch
import CartDrawer from "./CartDrawer";
import Image from "next/image";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    // Search States
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const debouncedSearch = useDebounce(searchTerm, 400);

    // Redux
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { totalAmount, totalItems, isDrawerOpen } = useSelector((state: RootState) => state.cart);
    const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    const setIsCartOpen = (open: boolean) => dispatch(setDrawerOpen(open));

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    // Close search results on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setShowResults(false);
    }, [pathname]);

    // Handle Search API Call
    useEffect(() => {
        const performSearch = async () => {
            if (debouncedSearch.length < 2) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const data = await userProductService.getProducts({ search: debouncedSearch, limit: 5 });
                if (data.success) {
                    setSearchResults(data.products);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsSearching(false);
            }
        };
        performSearch();
    }, [debouncedSearch]);

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
            setShowResults(false);
            setIsMobileMenuOpen(false);
        }
    };

    // Body scroll lock for mobile menu
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

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
        // { name: "Product", href: "/products", hasDropdown: true },
        // { name: "Blog", href: "/blog", hasDropdown: true },
        { name: "Contact", href: "/contact", hasDropdown: false },
        { name: "About", href: "/about", hasDropdown: false },
    ];

    return (
        <>
            <header className={`w-full z-[1100] sticky top-0 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"}`}>

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
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search for products and brands"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setShowResults(true);
                                        }}
                                        onFocus={() => setShowResults(true)}
                                        className="w-80 h-11 pl-4 pr-10 bg-white border border-gray-400 rounded text-sm text-black focus:outline-none focus:border-sking-pink transition-all placeholder:text-gray-500"
                                    />
                                    <button type="submit" className="absolute right-3 top-0 h-11 flex items-center justify-center text-gray-500 hover:text-sking-pink transition-colors">
                                        <Search className="w-5 h-5" />
                                    </button>
                                </form>

                                {/* Search Results Dropdown */}
                                {showResults && (searchTerm.length >= 2) && (
                                    <div className="absolute top-full left-0 mt-2 w-96 bg-white border border-gray-100 shadow-2xl rounded-xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
                                        {isSearching ? (
                                            <div className="p-8 text-center">
                                                <div className="animate-spin h-6 w-6 border-2 border-sking-pink border-t-transparent rounded-full mx-auto"></div>
                                                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mt-4">Searching Products...</p>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <div className="py-2">
                                                <p className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50">Results Found</p>
                                                {searchResults.map((product) => (
                                                    <Link
                                                        key={product._id}
                                                        href={`/product/${product.slug || product._id}`}
                                                        className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors group"
                                                    >
                                                        <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                                            <Image src={product.images?.[0]} alt={product.name} fill className="object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-black truncate group-hover:text-sking-pink transition-colors">{product.name}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.brand || 'Sking Cosmetics'}</p>
                                                        </div>
                                                        <p className="text-sm font-black text-black">₹{product.price.toLocaleString()}</p>
                                                    </Link>
                                                ))}
                                                <button
                                                    onClick={handleSearchSubmit}
                                                    className="w-full text-center py-3 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-sking-pink hover:bg-sking-pink hover:text-white transition-all"
                                                >
                                                    View All Results
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center">
                                                <p className="text-sm font-bold text-gray-900">No products found</p>
                                                <p className="text-xs text-gray-400 mt-1">Try again with different keywords</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* LOGIN / SIGNUP */}
                            {mounted && isAuthenticated ? (
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
                                            <Link href="/profile" onClick={() => setShowUserMenu(false)} className="block px-5 py-3 hover:bg-gray-50 text-sm font-medium transition-colors">Profile</Link>
                                            <Link href="/orders" onClick={() => setShowUserMenu(false)} className="block px-5 py-3 hover:bg-gray-50 text-sm font-medium transition-colors">Orders</Link>
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
                                        <Link href={`/login?redirect=${encodeURIComponent(fullPath)}`} className="hover:text-sking-pink transition-colors">Log in</Link>
                                        <span className="text-gray-400 mx-1">/</span>
                                        <Link href={`/register?redirect=${encodeURIComponent(fullPath)}`} className="hover:text-sking-pink transition-colors">Sign Up</Link>
                                    </div>
                                </div>
                            )}

                            {/* Divider Line */}
                            <div className="h-10 w-px bg-gray-400"></div>

                            {/* WISHLIST */}
                            <Link href="/wishlist" className="p-2 text-black hover:text-sking-pink transition-colors relative group">
                                <Heart className="w-6 h-6" />
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] text-white font-bold group-hover:bg-sking-pink transition-colors">
                                    {mounted ? wishlistItems.length : 0}
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
                                        {mounted ? totalItems : 0}
                                    </span>
                                </div>
                                <div className="flex flex-col items-start leading-tight">
                                    <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mb-0.5">My Bag</span>
                                    <span className="text-sm font-medium text-black tabular-nums">
                                        (₹{mounted ? totalAmount.toLocaleString() : 0})
                                    </span>
                                </div>
                            </button>

                        </div>

                        {/* MOBILE ACTIONS */}
                        <div className="flex lg:hidden items-center gap-1">
                            {/* MINI CART MOBILE */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="p-2.5 relative group text-black transition-all active:scale-90"
                            >
                                <ShoppingBag className="w-6 h-6" />
                                {mounted && totalItems > 0 && (
                                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-sking-red text-[9px] text-white font-black shadow-sm">
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            {/* MOBILE MENU TOGGLE */}
                            <button
                                className="p-2.5 text-black transition-all active:scale-90"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
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
                                                    <Link href="/shop?sort=newest" className="block px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-sking-pink transition-colors">New Arrival</Link>
                                                    <Link href="/shop?sort=popularity" className="block px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-sking-pink transition-colors">Best Sellers</Link>
                                                    <Link href="/shop" className="block px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-sking-pink transition-colors">Featured</Link>
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
                                <span className="text-xl font-medium text-sking-pink tracking-tight">+91 70127 47466</span>
                                <span className="text-[11px] text-gray-400 font-medium tracking-wide mt-1">24/7 Support Center</span>
                            </div>
                        </div>

                    </div>
                </div>

                <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsCartOpen(false)} />
            </header>

            {/* --- MOBILE MENU (Moved outside header for better fixed positioning) --- */}
            <div
                className={`fixed inset-0 top-20 bg-white z-[1001] lg:hidden overflow-y-auto transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="flex flex-col p-6 pt-10 gap-2 min-h-full">
                    {/* Search Mobile */}
                    <div className="relative mb-8">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowResults(true);
                                }}
                                onFocus={() => setShowResults(true)}
                                className="w-full h-14 pl-4 pr-12 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-sking-pink outline-none transition-all shadow-sm font-bold"
                            />
                            <button type="submit" className="absolute right-4 top-[18px] text-gray-400">
                                <Search className="w-5 h-5" />
                            </button>
                        </form>

                        {/* Mobile Search Results Dropdown */}
                        {showResults && (searchTerm.length >= 2) && (
                            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
                                {isSearching ? (
                                    <div className="p-8 text-center">
                                        <div className="animate-spin h-6 w-6 border-2 border-sking-pink border-t-transparent rounded-full mx-auto"></div>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mt-4">Searching...</p>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="py-2">
                                        {searchResults.map((product) => (
                                            <Link
                                                key={product._id}
                                                href={`/product/${product.slug || product._id}`}
                                                className="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                                onClick={() => {
                                                    setShowResults(false);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            >
                                                <div className="relative w-12 h-12 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                                                    <Image src={product.images?.[0]} alt={product.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-black truncate">{product.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.brand || 'Sking Cosmetics'}</p>
                                                </div>
                                                <p className="text-sm font-black text-black">₹{product.price.toLocaleString()}</p>
                                            </Link>
                                        ))}
                                        <button
                                            onClick={handleSearchSubmit}
                                            className="w-full text-center py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest"
                                        >
                                            View All Results
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-sm font-bold text-gray-900">No products found</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-col divide-y divide-gray-50">
                        {mainLinks.map((link) => (
                            <div key={link.name} className="flex flex-col">
                                <Link
                                    href={link.href}
                                    className="text-xl font-black uppercase tracking-widest py-5 text-gray-900 flex items-center justify-between group"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                    <ChevronDown className="w-5 h-5 -rotate-90 opacity-20 group-hover:opacity-100 group-hover:text-sking-pink transition-all" />
                                </Link>

                                {link.name === "Shop" && (
                                    <div className="flex flex-col gap-4 pb-6 pl-4">
                                        <Link href="/shop?sort=newest" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-sking-pink transition-colors">
                                            — New Arrivals
                                        </Link>
                                        <Link href="/shop?sort=popularity" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-sking-pink transition-colors">
                                            — Best Sellers
                                        </Link>
                                        <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-sking-pink transition-colors">
                                            — Featured Shop
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* All Categories Mobile */}
                        <div className="py-5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Categories</h4>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <Link
                                        key={cat._id}
                                        href={`/shop?category=${cat._id}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-sking-pink hover:text-white transition-all border border-gray-100"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Utility Links */}
                        <div className="space-y-1">
                            <Link
                                href="/wishlist"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between py-5 text-gray-900"
                            >
                                <span className="text-xl font-black uppercase tracking-widest">Wishlist</span>
                                <div className="flex items-center gap-3">
                                    <Heart className="w-6 h-6" />
                                    <span className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-full">{mounted ? wishlistItems.length : 0}</span>
                                </div>
                            </Link>

                            <button
                                onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}
                                className="flex items-center justify-between py-5 text-gray-900 text-left w-full"
                            >
                                <span className="text-xl font-black uppercase tracking-widest">My Bag</span>
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="w-6 h-6" />
                                    <span className="bg-sking-red text-white text-[10px] font-black px-2.5 py-1 rounded-full">{mounted ? totalItems : 0}</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* User Section */}
                    {mounted && isAuthenticated ? (
                        <div className="mt-8 pt-8 border-t-2 border-gray-100 pb-20">
                            <div className="flex items-center gap-4 mb-10 p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
                                <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center bg-white shadow-xl">
                                    <User className="w-8 h-8" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black uppercase tracking-widest text-black truncate">{user?.username || 'Member'}</p>
                                    <p className="text-[11px] text-gray-500 truncate mt-1">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 pl-2">
                                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 hover:text-sking-pink transition-colors">
                                    Profile Settings
                                </Link>
                                <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 hover:text-sking-pink transition-colors">
                                    My Order History
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 py-6 mt-6 text-sm font-black uppercase tracking-[0.2em] text-sking-red border-t border-gray-100 group"
                                >
                                    Sign Out Account <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 mt-12 pb-20">
                            <Link href={`/login?redirect=${encodeURIComponent(fullPath)}`} onClick={() => setIsMobileMenuOpen(false)} className="py-5 text-center bg-black text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-sking-pink transition-all shadow-xl shadow-black/10">
                                Login / Sign In
                            </Link>
                            <Link href={`/register?redirect=${encodeURIComponent(fullPath)}`} onClick={() => setIsMobileMenuOpen(false)} className="py-5 text-center border-2 border-black rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-50 transition-all">
                                Create Account
                            </Link>
                        </div>
                    )}

                    {/* Support Info Mobile */}
                    <div className="mt-auto pt-10 pb-10 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-2">Need Help?</p>
                        <p className="text-lg font-black text-black tracking-tight">+91 70127 47466</p>
                    </div>
                </div>
            </div>

            {/* Overlay for search results / user menu click-outside */}
            {(showUserMenu || showResults) && (
                <div className="fixed inset-0 z-[55]" onClick={() => { setShowUserMenu(false); setShowResults(false); }} />
            )}

            {/* Backdrop Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000] lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
