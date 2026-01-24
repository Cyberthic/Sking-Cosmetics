"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/user/Navbar";
import HeroSection from "@/components/user/home/HeroSection";
import CategoryPromo from "@/components/user/home/CategoryPromo";
import CategoryGrid from "@/components/user/home/CategoryGrid";
import BestSellers from "@/components/user/home/BestSellers";
import OfferBanner from "@/components/user/home/OfferBanner";
import NewLaunches from "@/components/user/home/NewLaunches";
import USPSection from "@/components/user/home/USPSection";
import ReviewsSection from "@/components/user/home/ReviewsSection";
import InstagramGrid from "@/components/user/home/InstagramGrid";
import Footer from "@/components/user/Footer";
import { userHomeService } from "@/services/user/userHomeApiService";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Optional: Fetch real data if needed, otherwise components use mock data
    const fetchData = async () => {
      try {
        const data = await userHomeService.getHomeData();
        if (data.success && data.newArrivals) {
          // We could map these to our components if the schema matches
          setProducts(data.newArrivals);
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
        <CategoryGrid />
        {/* Pass real products if available, otherwise BestSellers uses internal mock */}
        <BestSellers products={products.length > 0 ? products : undefined} />
        <OfferBanner />
        <NewLaunches />
        <USPSection />
        <ReviewsSection />
        <InstagramGrid />
      </main>

      <Footer />
    </div>
  );
}
