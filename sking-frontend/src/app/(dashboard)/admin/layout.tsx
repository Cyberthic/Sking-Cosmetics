import { Outfit } from 'next/font/google';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/admin/SidebarContext';
import { ThemeProvider } from '@/context/admin/ThemeContext';
import AdminProtectedRoute from '@/components/admin/auth/AdminProtectedRoute';
import { Metadata, Viewport } from 'next';

const outfit = Outfit({
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Sking Admin Dashboard",
  description: "Administrative control panel for Sking Cosmetics",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sking Admin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AdminProtectedRoute>
          {children}
        </AdminProtectedRoute>
      </SidebarProvider>
    </ThemeProvider>
  );
}
