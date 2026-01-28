"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function CheckoutPage() {
    const { items, totalAmount } = useSelector((state: RootState) => state.cart);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [shipDifferent, setShipDifferent] = useState(false);

    // Mock shipping fee (or calculate based on logic)
    const shippingFee = totalAmount > 1000 ? 0 : 49; // Using logic from CartDrawer
    const finalTotal = totalAmount + shippingFee;

    return (
        <div className="bg-white min-h-screen pt-24 pb-16">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">

                {/* Page Title (Optional or integrated) */}
                {/* <h1 className="text-4xl font-bold mb-10 text-center uppercase tracking-widest">Checkout</h1> */}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

                    {/* LEFT COLUMN - BILLING DETAILS */}
                    <div className="lg:col-span-7 space-y-10">
                        <div>
                            <h2 className="text-xl font-bold uppercase tracking-wider mb-2 text-gray-900">Billing Details</h2>
                            <p className="text-sm text-gray-400 mb-8">Please enter your billing details:</p>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputLabel label="First Name" required name="firstName" placeholder="" />
                                    <InputLabel label="Last Name" required name="lastName" placeholder="" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputLabel label="Email Address" required type="email" name="email" placeholder="" />
                                    <InputLabel label="Phone" required type="tel" name="phone" placeholder="" />
                                </div>

                                <div className="w-full">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                        Address<span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            className="w-full border border-gray-200 rounded-sm p-3 focus:outline-none focus:border-sking-black transition-colors min-h-[100px] text-sm resize-y"
                                        ></textarea>
                                        {/* The icon in the image bottom right of textarea looks like a specific resize handle or just an icon. 
                         I'll leave standard resize handle or add a custom one if strictly needed, but standard is fine. */}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputLabel label="City" required name="city" placeholder="" />
                                    <InputLabel label="State/Province" required name="state" placeholder="" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputLabel label="ZIP/Postal Code" required name="zip" placeholder="" />

                                    {/* Country Select */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                            Country<span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <select className="w-full appearance-none border border-gray-200 rounded-sm p-3 pr-10 focus:outline-none focus:border-sking-black transition-colors text-sm bg-white">
                                                <option>United States</option>
                                                <option>India</option>
                                                <option>United Kingdom</option>
                                                <option>Canada</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* SHIPPING ADDRESS SECTION */}
                        <div className="pt-6 border-t border-gray-100">
                            <h2 className="text-xl font-bold uppercase tracking-wider mb-6 text-gray-900">Shipping Address</h2>

                            <label className="inline-flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${shipDifferent ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={shipDifferent}
                                        onChange={() => setShipDifferent(!shipDifferent)}
                                    />
                                    {shipDifferent && <span className="text-white text-xs font-bold">✓</span>}
                                </div>
                                <span className="text-sm text-gray-500 group-hover:text-gray-900 transition-colors">Ship to a different address?</span>
                            </label>

                            {shipDifferent && (
                                <div className="mt-6 p-6 bg-gray-50 rounded-lg animate-in fade-in slide-in-from-top-4 duration-300">
                                    <p className="text-sm text-gray-500">Shipping address form would go here...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN - SUMMARY & PAYMENT */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-pink-50/50 p-8 rounded-lg border border-pink-100/50">
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-6 text-gray-900">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                {items.length > 0 ? (
                                    items.map((item: any, idx) => (
                                        <div key={idx} className="flex justify-between items-start gap-4 pb-4 border-b border-pink-100 last:border-0 last:pb-0">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-sm text-gray-900">{item.product.name}</h3>
                                                <p className="text-xs text-gray-500 mt-0.5">Size: <span className="text-gray-900">{item.variantName || 'One Size'}</span></p>
                                                <p className="text-xs text-gray-500 mt-0.5">Quantity: <span className="text-gray-900">{item.quantity}</span></p>
                                            </div>
                                            <span className="font-bold text-sking-pink text-sm">₹{((item.price || item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic">Your cart is empty.</p>
                                )}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-dashed border-pink-200">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-gray-600">Subtotal</span>
                                    <span className="font-bold text-gray-900">₹{totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-gray-600">Shipping Fee</span>
                                    <span className="font-bold text-gray-900">₹{shippingFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg mt-4 pt-4 border-t border-pink-200">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-gray-900">₹{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* PAYMENT METHOD */}
                        <div className="bg-pink-50/50 p-8 rounded-lg border border-pink-100/50">
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-gray-900">Payment Method</h2>
                            <p className="text-xs text-gray-400 mb-6">Choose your preferred payment method:</p>

                            <div className="space-y-3">
                                <PaymentOption
                                    id="credit-card"
                                    label="Credit Card"
                                    value="credit_card"
                                    selected={paymentMethod}
                                    onChange={setPaymentMethod}
                                />
                                <PaymentOption
                                    id="paypal"
                                    label="PayPal"
                                    value="paypal"
                                    selected={paymentMethod}
                                    onChange={setPaymentMethod}
                                />
                                <PaymentOption
                                    id="google-pay"
                                    label="Google Pay"
                                    value="google_pay"
                                    selected={paymentMethod}
                                    onChange={setPaymentMethod}
                                />
                                <PaymentOption
                                    id="cod"
                                    label="Cash on Delivery"
                                    value="cod"
                                    selected={paymentMethod}
                                    onChange={setPaymentMethod}
                                />
                            </div>

                            <button className="w-full mt-8 bg-sking-pink hover:bg-pink-600 text-white font-bold py-4 uppercase tracking-widest text-sm transition-all active:scale-[0.98] shadow-lg shadow-pink-500/20">
                                Place Order
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components

function InputLabel({ label, required, placeholder, type = "text", name }: { label: string, required?: boolean, placeholder: string, type?: string, name: string }) {
    return (
        <div className="w-full">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                {label}{required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-sm p-3 focus:outline-none focus:border-sking-black transition-colors text-sm"
            />
        </div>
    )
}

function PaymentOption({ id, label, value, selected, onChange }: { id: string, label: string, value: string, selected: string, onChange: (val: string) => void }) {
    return (
        <label htmlFor={id} className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selected === value ? 'border-sking-black' : 'border-gray-400 group-hover:border-gray-600'}`}>
                {selected === value && <div className="w-2.5 h-2.5 bg-sking-black"></div>}
            </div>
            <input
                type="radio"
                id={id}
                name="payment_method"
                value={value}
                checked={selected === value}
                onChange={() => onChange(value)}
                className="hidden"
            />
            <span className={`text-sm ${selected === value ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>
                {label}
            </span>
        </label>
    )
}
