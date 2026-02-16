import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | Our Story & Philosophy",
    description: "Learn about Sking Cosmetics - how we merge nature with science to create soulful skincare. Discover our mission, values, and commitment to pure beauty.",
    keywords: ["about sking cosmetics", "skincare philosophy", "natural beauty brand", "science meets soul", "pure cosmetics mission"],
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
