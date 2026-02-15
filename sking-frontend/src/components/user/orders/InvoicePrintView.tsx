import React from "react";
import { format } from "date-fns";

interface InvoicePrintViewProps {
    order: any;
}

export const InvoicePrintView = React.forwardRef<HTMLDivElement, InvoicePrintViewProps>(
    ({ order }, ref) => {
        if (!order) return null;

        const subtotal = order.totalAmount;
        const shipping = order.shippingFee;
        const discount = order.discountAmount;
        const total = order.finalAmount;

        return (
            <div ref={ref} className="p-12 bg-white text-black font-sans min-h-screen relative">
                {/* Header Section */}
                <div className="flex justify-between items-start border-b-2 border-sking-pink pb-8 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            {/* Use absolute path or base64 for logo to ensure it prints */}
                            <img src="/sking/sking-logo-bged.png" alt="Sking Cosmetics" className="h-12 w-auto object-contain" />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Original Quality Cosmetics</p>
                        <p className="text-gray-500 text-sm mt-1">
                            www.skingcosmetics.com <br />
                            skingfacebeautycosmetic916@gmail.com <br />
                            +91 88488 86919
                        </p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-4xl font-extrabold text-sking-pink uppercase tracking-widest mb-2">Invoice</h1>
                        <p className="text-lg font-bold text-gray-800">#{order.displayId || order._id.slice(-8).toUpperCase()}</p>
                        <div className={`mt-4 inline-block px-4 py-1 rounded-full border-2 font-bold text-xs uppercase tracking-widest ${order.paymentStatus === 'completed'
                            ? 'border-green-500 text-green-600 bg-green-50'
                            : 'border-red-500 text-red-600 bg-red-50'
                            }`}>
                            {order.paymentStatus === 'completed' ? 'Paid' : 'Payment Pending'}
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Billed To</h3>
                        <p className="font-bold text-lg text-gray-900 mb-1">{order.shippingAddress.name}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {order.shippingAddress.street} <br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} <br />
                            {order.shippingAddress.postalCode} <br />
                            {order.shippingAddress.country}
                        </p>
                        <p className="text-gray-800 text-sm font-bold mt-2">{order.shippingAddress.phoneNumber}</p>
                        <p className="text-gray-600 text-sm">{order.shippingAddress.email}</p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Order Details</h3>
                        <div className="space-y-2">
                            <div className="flex justify-end gap-4">
                                <span className="text-gray-500 text-sm font-medium">Order Date:</span>
                                <span className="text-gray-900 text-sm font-bold">{format(new Date(order.createdAt), "MMMM dd, yyyy")}</span>
                            </div>
                            <div className="flex justify-end gap-4">
                                <span className="text-gray-500 text-sm font-medium">Payment Method:</span>
                                <span className="text-gray-900 text-sm font-bold capitalize">{order.paymentMethod === 'whatsapp' ? 'WhatsApp' : 'Online'}</span>
                            </div>
                            <div className="flex justify-end gap-4">
                                <span className="text-gray-500 text-sm font-medium">Order Status:</span>
                                <span className="text-gray-900 text-sm font-bold capitalize">{order.orderStatus}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-12">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="text-left py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-[50%]">Item Description</th>
                                <th className="text-center py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Qty</th>
                                <th className="text-right py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                                <th className="text-right py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {order.items.map((item: any, idx: number) => (
                                <tr key={idx}>
                                    <td className="py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-xl bg-gray-50 border border-gray-100 p-1 flex-shrink-0">
                                                {/* Ensure images are loadable for print, using standard img tag */}
                                                <img
                                                    src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                                                    alt={item.product?.name}
                                                    className="h-full w-full object-cover rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{item.product?.name}</p>
                                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide font-medium">Variant: {item.variantName || 'Standard'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center py-6 text-sm font-medium text-gray-900">{item.quantity}</td>
                                    <td className="text-right py-6 text-sm font-medium text-gray-900">₹{item.price.toFixed(2)}</td>
                                    <td className="text-right py-6 text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="flex justify-end mb-16">
                    <div className="w-[300px] space-y-3">
                        <div className="flex justify-between text-sm text-gray-500 font-medium">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 font-medium">
                            <span>Shipping Fee</span>
                            <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600 font-medium">
                                <span>Discount {order.discountCode && `(${order.discountCode})`}</span>
                                <span>-₹{discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="my-4 border-t border-gray-200"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-base font-black text-gray-900 uppercase tracking-wide">Total</span>
                            <span className="text-xl font-black text-sking-pink">₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer / Thank You */}
                <div className="mt-auto border-t-2 border-gray-100 pt-8 pb-10">
                    <div className="flex items-center justify-between">
                        <div className="max-w-md">
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Thank you for your purchase!</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                We hope you love your new Sking Cosmetics products. If you have any questions or need assistance,
                                our support team is always here to help.
                            </p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Follow us</p>
                            <a href="https://www.instagram.com/sking_cosmetic_/" className="text-sm font-bold text-sking-pink">@sking_cosmetic_</a>
                        </div>
                    </div>
                    <div className="text-center mt-12 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} Sking Cosmetics. All rights reserved.
                    </div>
                </div>

                {/* Watermark/Background Elements for "Perfect" look */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 bg-sking-pink/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 bg-purple-50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            </div>
        );
    }
);

InvoicePrintView.displayName = "InvoicePrintView";
