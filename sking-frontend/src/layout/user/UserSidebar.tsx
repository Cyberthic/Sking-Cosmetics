import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, MapPin, Package, Wallet, LogOut, LayoutDashboard, TicketPlus } from 'lucide-react';

const sidebarItems = [
    {
        title: 'My Profile',
        href: '/profile',
        icon: User,
    },
    {
        title: 'Addresses',
        href: '/addresses',
        icon: MapPin,
    },
    {
        title: 'My Orders',
        href: '/orders',
        icon: Package,
    },
    {
        title: 'My Coupons',
        href: '/coupons',
        icon: TicketPlus,
    },
    {
        title: 'Wallet',
        href: '/wallet',
        icon: Wallet,
    },
];

export function UserSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-full h-full">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden sticky top-24">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-black uppercase tracking-tight">Account</h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Manage your account</p>
                </div>

                <nav className="p-4 space-y-2">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${isActive
                                    ? "bg-black text-white shadow-lg"
                                    : "text-gray-600 hover:bg-white hover:text-black hover:shadow-sm"
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-sking-red" : "text-gray-400 group-hover:text-sking-red"
                                    }`} />
                                <span className="font-bold uppercase text-sm tracking-wide">{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 mt-2">
                    {/* Note: Logout functionality should ideally be handled by a button calling auth service, but keeping Link for now as per existing code */}
                    <Link
                        href="/login"
                        onClick={(e) => {
                            // Optional: Trigger logout here if this was a button
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
                    >
                        <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                        <span className="font-bold uppercase text-sm tracking-wide">Logout</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
