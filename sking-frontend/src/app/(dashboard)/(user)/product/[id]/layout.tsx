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

export default function ProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
