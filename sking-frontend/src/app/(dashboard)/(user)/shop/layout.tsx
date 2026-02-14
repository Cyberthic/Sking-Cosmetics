import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shop Premium Skincare',
    description: 'Explore our curated collection of luxury skincare products. From hydrating cleansers to potent anti-aging serums, find everything you need for a radiant complexion.',
    keywords: ['shop skincare', 'luxury beauty shop', 'buy face serums online', 'premium moisturizers', 'best cleansers for glowing skin'],
    openGraph: {
        title: 'Shop Sking Cosmetics | Luxury Beauty Collection',
        description: 'Elevate your skincare routine with our professional-grade products.',
        images: ['/shop-og.jpg'],
    },
};

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
