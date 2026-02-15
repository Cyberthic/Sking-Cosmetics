"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        question: "How can I track my order?",
        answer: "Once shipped, you will receive a tracking ID via WhatsApp and Email. You can also track directly through our website."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major Credit/Debit cards, UPI (GPay, PhonePe), and NetBanking via Razorpay's secure gateway."
    },
    {
        question: "Do you offer international shipping?",
        answer: "Yes, we ship to UAE and other regions globally. Delivery times vary between 7-10 business days for international orders."
    },
    {
        question: "What is your return policy?",
        answer: "Due to hygiene reasons, we maintain a strict no-return policy. If you receive a damaged product, please contact our support team immediately for assistance."
    }
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="pt-20 pb-48 bg-[#FFF5F7]">
            <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-12">

                {/* Left Title */}
                <div className="w-full md:w-1/3 pt-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-2">
                        Got Questions?
                    </h2>
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
                        We've Got
                    </h2>
                    <h2 className="text-4xl md:text-5xl font-bold text-black mb-8">
                        Answers!
                    </h2>
                    <a
                        href="/help"
                        className="inline-flex items-center gap-2 text-sking-pink font-bold uppercase tracking-widest text-xs hover:gap-4 transition-all"
                    >
                        View All FAQs <Plus size={14} />
                    </a>
                </div>

                {/* Right Accordion */}
                <div className="w-full md:w-2/3 space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white rounded-lg overflow-hidden shadow-sm transition-all duration-300">
                            <button
                                onClick={() => setOpenIndex(idx === openIndex ? -1 : idx)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className={`font-semibold text-lg ${idx === openIndex ? "text-sking-pink" : "text-gray-800"}`}>
                                    {faq.question}
                                </span>
                                <div className={`p-1 rounded text-white ${idx === openIndex ? "bg-sking-pink" : "bg-pink-100 text-sking-pink"}`}>
                                    {idx === openIndex ? <Minus size={16} /> : <Plus size={16} />}
                                </div>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${idx === openIndex ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                            >
                                <p className="px-6 pb-6 text-gray-500 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FAQSection;
