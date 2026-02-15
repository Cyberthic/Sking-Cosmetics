"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/user/Navbar";
import HeroSection from "@/components/user/home/HeroSection";
import CategoryPromo from "@/components/user/home/CategoryPromo";
import FlashSale from "@/components/user/home/FlashSale";
import FeaturedProducts from "@/components/user/home/FeaturedProducts";
import TrendingBanner from "@/components/user/home/TrendingBanner";
import NewInStore from "@/components/user/home/NewInStore";
import InstagramSection from "@/components/user/home/InstagramSection";
import FAQSection from "@/components/user/home/FAQSection";
import NewsletterSection from "@/components/user/home/NewsletterSection";
import Footer from "@/components/user/Footer";
import { userHomeService } from "@/services/user/userHomeApiService";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [flashSale, setFlashSale] = useState<any>(null);
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await userHomeService.getHomeData();
        if (data.success) {
          setProducts(data.newArrivals || []);
          setFlashSale(data.flashSale);
          setFeatured(data.featured || []);
        }
      } catch (err) {
        console.error("Failed to fetch home data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-white font-sans text-black selection:bg-sking-pink selection:text-white">
      <Navbar />

      <main className="flex flex-col w-full">
        <HeroSection />
        <CategoryPromo />
        <FlashSale data={flashSale} />
        <FeaturedProducts data={featured} />
        <TrendingBanner />
        <NewInStore products={products} />
        <InstagramSection />
        <FAQSection />
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}
