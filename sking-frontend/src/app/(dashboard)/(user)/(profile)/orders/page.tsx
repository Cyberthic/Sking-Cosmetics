'use client';

import { Package, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrdersPage() {
    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-black uppercase tracking-tighter hidden md:block text-black">My Orders</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="bg-gray-50 border border-gray-200 rounded-lg px-10 py-2.5 text-sm text-black focus:outline-none focus:border-black w-full md:w-64 transition-all placeholder:text-gray-400"
                    />
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center"
            >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <Package className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-black uppercase tracking-tight">No orders found</h3>
                <p className="text-gray-500 font-medium">You haven't placed any orders yet.</p>
            </motion.div>
        </div>
    );
}
