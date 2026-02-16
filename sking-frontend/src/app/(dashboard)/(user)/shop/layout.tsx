import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shop All Products | Luxury Skincare Collection",
    description: "Browse our complete collection of luxury skincare and beauty products. From serums to moisturizers, find the perfect ritual for your skin health.",
    keywords: ["shop skincare", "luxury beauty shop", "sking cosmetics collection", "premium serums", "best moisturizers online"],
};

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
