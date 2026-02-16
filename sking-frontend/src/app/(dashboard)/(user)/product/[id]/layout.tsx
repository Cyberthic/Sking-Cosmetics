import { Metadata, ResolvingMetadata } from 'next';
import axios from 'axios';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
        const response = await axios.get(`${apiUrl}/api/users/products/${id}`);
        const product = response.data.product;

        if (!product) return { title: 'Product Not Found' };

        const previousImages = (await parent).openGraph?.images || [];

        return {
            title: `${product.name} | Luxury Skincare`,
            description: product.shortDescription || product.description?.substring(0, 160),
            keywords: [
                product.name,
                product.category?.name || 'skincare',
                'luxury beauty',
                'Sking Cosmetics',
                ...(product.tags || [])
            ],
            openGraph: {
                title: product.name,
                description: product.shortDescription || product.description?.substring(0, 160),
                images: product.images?.[0] ? [product.images[0], ...previousImages] : previousImages,
            },
        };
    } catch (error) {
        return {
            title: 'Luxury Product | Sking Cosmetics',
            description: 'Experience pure, potent, and precise formulations designed for modern skin health.',
        };
    }
}

export default async function ProductLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    let productData = null;

    try {
        const response = await axios.get(`${apiUrl}/api/users/products/${id}`);
        productData = response.data.product;
    } catch (error) {
        console.error("Failed to fetch product for JSON-LD", error);
    }

    const jsonLd = productData ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": productData.name,
        "image": productData.images,
        "description": productData.shortDescription || productData.description,
        "brand": {
            "@type": "Brand",
            "name": "Sking Cosmetics"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://skingcosmetics.com/product/${id}`,
            "priceCurrency": "PKR",
            "price": productData.finalPrice || productData.price,
            "availability": productData.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5",
            "reviewCount": productData.soldCount || "10"
        }
    } : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            {children}
        </>
    );
}
