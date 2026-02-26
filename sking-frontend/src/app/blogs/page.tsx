import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { blogs } from "@/data/blogs";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";

export const metadata = {
    title: "Sking Cosmetics Blog | Skincare Tips & Grooming Guide",
    description: "Stay updated with the latest skincare routines, grooming tips, and beauty secrets from Sking Cosmetics beauty experts.",
};

const BlogPage = () => {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Suspense fallback={<div className="h-20 bg-black/5 animate-pulse" />}>
                <Navbar />
            </Suspense>

            <main className="pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-sking-pink to-sking-pink-dark">
                        Our Beauty Journal
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Expert advice, skincare routines, and the science behind glowing skin. Discover your path to radiance.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {blogs.map((blog) => (
                            <Link
                                key={blog.id}
                                href={`/blogs/${blog.slug}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={blog.image}
                                        alt={blog.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-sking-pink uppercase tracking-wider">
                                            {blog.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                        <span>{blog.date}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span>{blog.readTime}</span>
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-sking-pink transition-colors line-clamp-2">
                                        {blog.title}
                                    </h2>

                                    <p className="text-gray-600 line-clamp-3 mb-6 flex-grow">
                                        {blog.excerpt}
                                    </p>

                                    <div className="flex items-center text-sking-pink font-semibold group/link">
                                        Read Article
                                        <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BlogPage;
