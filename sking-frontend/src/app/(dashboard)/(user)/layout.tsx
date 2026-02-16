import React, { Suspense } from "react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full bg-white text-black selection:bg-sking-pink selection:text-white flex flex-col">
            <Suspense fallback={<div className="h-20 bg-white" />}>
                <Navbar />
            </Suspense>
            <main className="flex-1 w-full flex flex-col">
                {children}
            </main>
            <Footer />
        </div>
    );
}
