'use client';

import { MapPin, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AddressesPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter hidden md:block text-black">My Addresses</h1>
                <button className="flex items-center gap-2 bg-black hover:bg-sking-red text-white px-6 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-colors">
                    <Plus className="w-4 h-4" />
                    Add New Address
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center"
            >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <MapPin className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-black uppercase tracking-tight">No addresses saved</h3>
                <p className="text-gray-500 mb-6 font-medium">Add an address to speed up your checkout process.</p>
            </motion.div>
        </div>
    );
}
