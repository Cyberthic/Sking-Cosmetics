import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Have questions about our products or your order? Reach out to the Sking Cosmetics team for expert skincare advice and customer support.',
    keywords: ['contact sking cosmetics', 'skincare support', 'beauty consultation', 'order inquiries'],
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
