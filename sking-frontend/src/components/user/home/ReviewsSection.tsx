"use client";
import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

const reviews = [
    {
        name: "Ananya P.",
        handle: "@ananya_beauty",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        text: "The matte lipstick is literally life-changing. Stays on all day and doesn't dry my lips!",
        rating: 5
    },
    {
        name: "Riya S.",
        handle: "@riya_glam",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        text: "Finally a foundation that matches my Indian skin tone perfectly. Thank you Sking!",
        rating: 5
    },
    {
        name: "Sneha K.",
        handle: "@skincare_sneha",
        image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop",
        text: "The serum gave me such a glow in just 2 weeks. Highly recommend.",
        rating: 4
    }
];

const ReviewsSection = () => {
    return (
        <section className="py-20 px-4 md:px-6 bg-gray-50 text-black">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black text-center mb-16 tracking-tighter uppercase">
                    Loved By <span className="text-sking-pink">You</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((rev, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-xl shadow-theme-md hover:shadow-theme-xl transition-shadow duration-300 relative border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-sking-pink p-0.5">
                                    <div className="relative w-full h-full rounded-full overflow-hidden">
                                        <Image src={rev.image} alt={rev.name} fill className="object-cover" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{rev.name}</h4>
                                    <p className="text-sking-pink text-sm font-medium">{rev.handle}</p>
                                </div>
                            </div>

                            <div className="flex gap-1 mb-4 text-yellow-400">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={16} fill={s <= rev.rating ? "currentColor" : "none"} stroke="currentColor" />
                                ))}
                            </div>

                            <p className="text-gray-600 italic">"{rev.text}"</p>

                            <div className="absolute top-4 right-6 text-6xl text-gray-200 font-serif opacity-50">"</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
