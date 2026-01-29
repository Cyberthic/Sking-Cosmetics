"use client";
import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
    content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ content }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block ml-1.5 group">
            <button
                type="button"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onClick={() => setIsVisible(!isVisible)}
                className="text-gray-400 hover:text-sking-pink transition-colors focus:outline-none"
            >
                <HelpCircle size={14} />
            </button>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-99999"
                    >
                        <div className="bg-black/90 dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-xl shadow-2xl min-w-[150px] text-center backdrop-blur-sm border border-white/10 dark:border-black/10">
                            {content}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black/90 dark:border-t-white" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Tooltip;
