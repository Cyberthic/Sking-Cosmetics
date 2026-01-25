'use client';

import { Wallet, CreditCard, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WalletPage() {
    return (
        <div>
            <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter hidden md:block text-black">My Wallet</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-black to-zinc-900 rounded-2xl p-6 relative overflow-hidden shadow-xl"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Wallet className="w-32 h-32 transform rotate-12 text-white" />
                    </div>

                    <div className="relative z-10">
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">Total Balance</p>
                        <h2 className="text-4xl font-black text-white mb-6">$0.00</h2>

                        <div className="flex gap-3">
                            <button className="bg-white text-black px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide flex items-center gap-2 hover:bg-sking-red hover:text-white transition-colors">
                                <Plus className="w-4 h-4" />
                                Add Funds
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-6"
                >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 uppercase tracking-tight text-black">
                        <CreditCard className="w-5 h-5 text-sking-red" />
                        Saved Cards
                    </h3>
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                        <p className="text-gray-500 text-sm mb-3 font-medium">No cards saved</p>
                        <button className="text-sking-red hover:text-black text-sm font-bold uppercase tracking-wide transition-colors">
                            + Add New Card
                        </button>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
                <h3 className="text-lg font-bold mb-6 uppercase tracking-tight text-black">Recent Transactions</h3>
                <div className="text-center py-12 text-gray-400 font-medium uppercase tracking-wide text-sm">
                    No transactions yet
                </div>
            </motion.div>
        </div>
    );
}
