'use client';

import { UserSidebar } from '@/layout/user/UserSidebar';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* Header */}
            <div className="relative h-[30vh] min-h-[200px] w-full bg-sking-black flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-neutral-900" />
                <div className="relative z-10 text-center space-y-2 px-4 mt-12">
                    <p className="text-sking-pink font-bold tracking-widest uppercase text-xs md:text-sm">
                        Welcome Back
                    </p>
                    <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
                        My Account
                    </h1>
                </div>
            </div>

            <div className="flex-grow max-w-7xl mx-auto flex flex-col md:flex-row gap-12 w-full px-4 md:px-8 py-16">
                <aside className="w-full md:w-64 flex-shrink-0">
                    <UserSidebar />
                </aside>
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </>
    );
}
