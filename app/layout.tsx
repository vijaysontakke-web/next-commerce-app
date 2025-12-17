import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { Button } from "@/components/ui/button"; // verify button is installed if needed, but not used directly here

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextStore | Premium E-commerce",
  description: "A modern e-commerce application built with Next.js and Shadcn UI",
};

import { CartProvider } from "@/lib/cart-context"; // Ensure import
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "@/components/providers/session-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <SessionProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </CartProvider>
          <Toaster richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
