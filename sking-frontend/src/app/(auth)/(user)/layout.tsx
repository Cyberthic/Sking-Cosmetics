'use client';

import { useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';
import Navbar from '@/components/user/Navbar';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            router.replace('/');
        }
    }, [isInitialized, isAuthenticated, router]);

    if (isInitialized && isAuthenticated) {
        return null; // Don't render auth pages if redirected
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Suspense fallback={<div className="h-20 bg-white" />}>
                <Navbar />
            </Suspense>
            <main className="flex-grow overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}

