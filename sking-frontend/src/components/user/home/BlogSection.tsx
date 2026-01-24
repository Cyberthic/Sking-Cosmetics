"use client";
import React from "react";
import Image from "next/image";
import { Clock, User } from "lucide-react";

const posts = [
    {
        id: 1,
        category: "SKINCARE",
        title: "10 Skincare Tips for a Healthy Glow from Sking",
        image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop",
        date: "May 5, 2024",
        author: "Diana Jones"
    },
    {
        id: 2,
        category: "MAKEUP",
        title: "The Ultimate Guide to Makeup Application",
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop",
        date: "April 20, 2024",
        author: "Fabian Wright"
    },
    {
        id: 3,
        category: "MAKEUP",
        title: "How to Choose the Perfect Foundation Shade",
        image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=800&auto=format&fit=crop",
        date: "March 15, 2024",
        author: "Lisa Dominic"
    }
];

const BlogSection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-black uppercase mb-12">
                    Expert Tips and Inspiration
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <div key={post.id} className="group border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            {/* Header Category */}
                            <div className="bg-pink-50 py-2 text-center">
                                <span className="text-xs font-bold text-sking-pink uppercase tracking-widest">
                                    {post.category}
                                </span>
                            </div>

                            {/* Image */}
                            <div className="relative h-64 w-full overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-black mb-4 leading-snug group-hover:text-sking-pink transition-colors">
                                    {post.title}
                                </h3>

                                <div className="flex items-center justify-between text-gray-500 text-xs mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User size={14} />
                                        <span>{post.author}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
