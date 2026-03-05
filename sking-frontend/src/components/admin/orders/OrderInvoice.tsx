import React from "react";
import { format } from "date-fns";

interface OrderInvoiceProps {
    order: any;
}

export const OrderInvoice = React.forwardRef<HTMLDivElement, OrderInvoiceProps>(
    ({ order }, ref) => {
        if (!order) return null;

        const subtotal = order.totalAmount || 0;
        const shipping = order.shippingFee || 0;
        const discount = order.discountAmount || 0;
        const total = order.finalAmount || 0;

        return (
            <div ref={ref} className="p-10 bg-white text-black font-sans min-h-screen relative" style={{ width: '210mm', minHeight: '297mm' }}>
                {/* Header Section */}
                <div className="flex justify-between items-start border-b-2 border-pink-500 pb-8 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/sking/sking-logo-bged.png" alt="Sking Cosmetics" className="h-16 w-auto object-contain" />
                        </div>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Sking Cosmetics</p>
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                            Premium Quality Cosmetics & Skincare <br />
                            www.skingcosmetics.com <br />
                            skingfacebeautycosmetic916@gmail.com <br />
                            +91 88488 86919
                        </p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-5xl font-black text-pink-500 uppercase tracking-tighter mb-2 italic">Invoice</h1>
                        <p className="text-lg font-black text-gray-900 uppercase">#{order._id.slice(-8).toUpperCase()}</p>
                        <div className={`mt-4 inline-block px-4 py-1.5 rounded-xl border-2 font-black text-[10px] uppercase tracking-[0.2em] ${order.paymentStatus === 'completed'
                            ? 'border-green-500 text-green-600 bg-green-50'
                            : 'border-amber-500 text-amber-600 bg-amber-50'
                            }`}>
                            {order.paymentStatus === 'completed' ? 'PAID' : 'PAYMENT PENDING'}
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Customer Details</h3>
                        <p className="font-black text-xl text-gray-900 uppercase tracking-tight mb-2">{order.shippingAddress.name}</p>
                        <div className="space-y-1 text-gray-600 text-xs font-medium leading-relaxed">
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
                            <p>{order.shippingAddress.country}</p>
                            <div className="pt-2 flex flex-col gap-1">
                                <p className="text-gray-900 font-bold"><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Phone:</span> {order.shippingAddress.phoneNumber}</p>
                                <p className="text-gray-900 font-bold"><span className="text-gray-400 font-black uppercase tracking-widest mr-2">Email:</span> {order.shippingAddress.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Order Information</h3>
                        <div className="space-y-3">
                            <div className="flex justify-end gap-6">
                                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Order Date</span>
                                <span className="text-gray-900 text-sm font-bold">{format(new Date(order.createdAt), "dd MMM yyyy")}</span>
                            </div>
                            <div className="flex justify-end gap-6">
                                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Payment</span>
                                <span className="text-gray-900 text-sm font-bold capitalize">{order.paymentMethod === 'whatsapp' ? 'WhatsApp Order' : 'Razorpay Secure'}</span>
                            </div>
                            {(order.paymentDetails?.gatewayPaymentId || order.manualPaymentDetails?.upiTransactionId) && (
                                <div className="flex justify-end gap-6">
                                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Transaction ID</span>
                                    <span className="text-gray-900 text-[10px] font-bold uppercase">{order.paymentDetails?.gatewayPaymentId || order.manualPaymentDetails?.upiTransactionId}</span>
                                </div>
                            )}
                            <div className="flex justify-end gap-6">
                                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Status</span>
                                <span className="text-gray-900 text-sm font-bold uppercase tracking-tight italic">{order.orderStatus.replace('_', ' ')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-12">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-900">
                                <th className="text-left py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] w-[55%]">Product Specification</th>
                                <th className="text-center py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Qty</th>
                                <th className="text-right py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Unit Price</th>
                                <th className="text-right py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {order.items.map((item: any, idx: number) => (
                                <tr key={idx}>
                                    <td className="py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="h-20 w-20 rounded-2xl bg-gray-50 border border-gray-100 p-1 flex-shrink-0">
                                                <img
                                                    src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                                                    alt={item.product?.name}
                                                    className="h-full w-full object-cover rounded-xl"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 text-sm uppercase tracking-tight">{item.product?.name}</p>
                                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black italic">Variant: {item.variantName || 'Universal'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center py-6 text-sm font-black text-gray-900">{item.quantity}</td>
                                    <td className="text-right py-6 text-sm font-bold text-gray-900">₹{item.price.toLocaleString()}</td>
                                    <td className="text-right py-6 text-sm font-black text-gray-900 uppercase">₹{(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="flex justify-end mb-16">
                    <div className="w-[320px] space-y-4">
                        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <span>Shipping</span>
                            <span className="text-green-600">{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <span>Discount</span>
                                <span className="text-green-600">-₹{discount.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="pt-4 border-t-2 border-gray-900 flex justify-between items-center">
                            <span className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] italic">Total Amount</span>
                            <span className="text-2xl font-black text-pink-500">₹{total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="mt-auto border-t-2 border-gray-100 pt-10 pb-6">
                    <div className="flex items-center justify-between">
                        <div className="max-w-md">
                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic mb-2">Thank you for your order!</h4>
                            <p className="text-[10px] text-gray-500 font-medium leading-relaxed uppercase tracking-widest">
                                This is a computer generated invoice and does not require a physical signature.
                                All items are checked for quality before dispatch.
                            </p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Official Store</p>
                            <a href="https://www.skingcosmetics.com" className="text-sm font-black text-pink-500">SKING COSMETICS</a>
                        </div>
                    </div>
                    <div className="text-center mt-12 text-[10px] text-gray-300 font-black uppercase tracking-[0.5em]">
                        &copy; {new Date().getFullYear()} Sking Cosmetics Original Quality
                    </div>
                </div>

                {/* Artistic Watermarks */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 bg-pink-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 bg-purple-500/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
            </div>
        );
    }
);

OrderInvoice.displayName = "OrderInvoice";
