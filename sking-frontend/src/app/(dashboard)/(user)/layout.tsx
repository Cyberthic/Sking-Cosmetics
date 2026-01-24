import React from "react";
import Navbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Navbar />
            <main className="flex-1 w-full">
                {children}
            </main>
            <Footer />
        </div>
    );
}
