import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Story & Philosophy',
    description: 'Learn about the vision behind Sking Cosmetics. We combine pure ingredients with precise formulations to redefine modern beauty.',
    keywords: ['sking cosmetics about us', 'clean beauty philosophy', 'skincare innovation', 'luxury grooming story'],
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
