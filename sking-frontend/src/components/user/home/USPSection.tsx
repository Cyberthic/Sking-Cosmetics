"use client";
import React from "react";
import { Truck, Leaf, ShieldCheck, Gem, HeartHandshake } from "lucide-react";

const USPs = [
    { icon: <HeartHandshake size={32} />, title: "Cruelty Free", desc: "We love our furry friends." },
    { icon: <Leaf size={32} />, title: "100% Vegan", desc: "No animal by-products." },
    { icon: <Gem size={32} />, title: "Made in India", desc: "Proudly Indian brand." },
    { icon: <ShieldCheck size={32} />, title: "Dermat Tested", desc: "Safe for all skin types." },
    { icon: <Truck size={32} />, title: "Fast Delivery", desc: "Express shipping available." },
];

const USPSection = () => {
    return (
        <section className="bg-black text-white py-16 border-t border-gray-900">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
                    {USPs.map((usp, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-4 group">
                            <div className="p-4 rounded-full bg-gray-900 group-hover:bg-sking-red transition-colors duration-300">
                                {usp.icon}
                            </div>
                            <div>
                                <h4 className="font-bold uppercase tracking-wide mb-1">{usp.title}</h4>
                                <p className="text-gray-400 text-xs">{usp.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default USPSection;
