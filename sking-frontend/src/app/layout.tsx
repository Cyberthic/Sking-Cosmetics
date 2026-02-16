import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./silky-theme.css";
import ReduxProvider from "@/components/user/providers/ReduxProvider";
import { Toaster } from "sonner";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sking Cosmetics | Premium Luxury Skincare & Beauty Products",
    template: "%s | Sking Cosmetics"
  },
  description: "Discover Sking Cosmetics - your destination for premium, luxury skincare and beauty products. Experience pure, potent, and precise formulations designed for modern skin health and radiance.",
  applicationName: "Sking Cosmetics",
  keywords: [
    "Sking Cosmetics", "S king Cosmetics", "S king", "luxury skincare", "premium beauty products", "natural cosmetics",
    "anti-aging serums", "organic skincare", "luxury beauty brand", "skin health",
    "radiant skin", "precision formulations", "dermatologist tested", "vegan beauty",
    "cruelty-free cosmetics", "best skincare 2026", "glowing skin tips", "skincare routine",
    "high-end makeup", "beauty essentials", "luxury moisture products", "skin rejuvenation",
    "professional skincare", "skincare technology", "modern beauty", "elegant skincare",
    "cosmetic shop", "online beauty store", "skincare for sensitive skin", "brightening serums",
    "hydrating creams", "luxury face oils", "skincare treatments", "beauty innovation",
    "Unisex Perfume", "Luxury Lipbalm", "Beard Growth Oil", "Papaya Face Wash", "Beauty Cream 10 days challenge",
    "Hair Oil with Shampoo", "Moisture Cream for skin", "Hand Whitening Solution", "Sun Protection cream",
    "Skin Whitening", "Beard Care", "Unisex Beauty Products", "Luxury Cosmetics Pakistan"
  ],
  metadataBase: new URL("https://www.skingcosmetics.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/sking/sking-bg-2.webp",
  },
  authors: [{ name: "Sking Cosmetics" }],
  creator: "Sking Cosmetics",
  publisher: "Sking Cosmetics",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.skingcosmetics.com",
    siteName: "Sking Cosmetics",
    title: "Sking Cosmetics | Premium Luxury Skincare & Beauty Products",
    description: "Experience the pinnacle of luxury skincare. Discover potent formulations that redefine beauty and skin health.",
    images: [
      {
        url: "/sking/sking-bg-2.webp",
        width: 1200,
        height: 630,
        alt: "Sking Cosmetics - Luxury Redefined",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sking Cosmetics | Premium Luxury Skincare",
    description: "Discover the secret to radiant, healthy skin with our luxury skincare collection.",
    creator: "@skingcosmetics",
    images: ["/sking/sking-bg-2.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-4XTM03R5L5"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-4XTM03R5L5');
          `}
        </Script>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Sking Cosmetics",
              "url": "https://www.skingcosmetics.com",
              "logo": "https://www.skingcosmetics.com/logo.png",
              "description": "Premium luxury skincare and beauty products.",
              "sameAs": [
                "https://www.facebook.com/skingcosmetics",
                "https://www.instagram.com/skingcosmetics",
                "https://twitter.com/skingcosmetics"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-555-SKING-CO",
                "contactType": "customer service"
              }
            })
          }}
        />
        <ReduxProvider>
          {children}
          <Toaster theme="dark" position="top-right" richColors />
        </ReduxProvider>
      </body>
    </html>
  );
}
