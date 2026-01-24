"use client";
import React from "react";
import Image from "next/image";

const NewsletterSection = () => {
    return (
        <section className="bg-transparent relative z-20 -mt-32 pointer-events-none">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 pointer-events-auto">
                <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-r from-pink-200 to-pink-100 flex items-center md:h-[400px]">

                    {/* Left Image (Brushes) */}
                    <div className="hidden md:block w-1/2 h-full relative">
                        <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent to-pink-100/50" />
                        <Image
                            src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=800&auto=format&fit=crop"
                            alt="Makeup Brushes"
                            fill
                            className="object-cover object-left"
                        />
                    </div>

                    {/* Right Content */}
                    <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center items-start">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                            Sign up for our newsletter
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md">
                            to receive the latest beauty tips, exclusive offers, and updates.
                        </p>

                        <div className="flex w-full max-w-md gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email address ..."
                                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-sking-pink transition-colors text-sm"
                            />
                            <button className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm rounded-md uppercase tracking-wider transition-colors shadow-lg">
                                Subscribe
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default NewsletterSection;
