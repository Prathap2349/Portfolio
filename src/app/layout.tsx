import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ScrollProvider from "@/animations/ScrollProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Cursor from "@/components/Cursor";

export const metadata: Metadata = {
  title: "Prathap — AI & Data Science Student | Developer",
  description: "Personal portfolio of Prathap, an AI & Data Science student building projects in web development, AI, data and software.",
};

export const viewport = {
  themeColor: "#050A15",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-primary-text selection:bg-accent-cyan/30">
        <Cursor />
        <ScrollProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-accent-cyan text-background px-4 py-2 font-bold">
            Skip to content
          </a>
          <Navigation />
          <main id="main-content" className="flex-grow">
            {children}
          </main>
        </ScrollProvider>
      </body>
    </html>
  );
}
