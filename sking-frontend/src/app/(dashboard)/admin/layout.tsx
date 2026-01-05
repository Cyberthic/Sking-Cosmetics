import { Outfit } from 'next/font/google';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/admin/SidebarContext';
import { ThemeProvider } from '@/context/admin/ThemeContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
  );
}
