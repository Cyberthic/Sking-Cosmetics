import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | Customer Support & Inquiries",
    description: "Connect with Sking Cosmetics. Get 24/7 support for your orders, product inquiries, and beauty advice. Reach us via WhatsApp, email, or visit our studio.",
    keywords: ["contact sking cosmetics", "customer support", "skincare help", "beauty advisor contact", "sking cosmetics address"],
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
