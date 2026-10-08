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
  title: {
    default: "Prathap | AI & Data Science Student & Developer",
    template: "%s | Prathap"
  },
  description: "Portfolio of Prathap, a creative front-end engineer and AI & Data Science student. Exploring web development, AI, and building intuitive digital experiences.",
  keywords: ["Prathap", "AI Student", "Data Science", "Web Developer", "React", "Next.js", "Portfolio"],
  authors: [{ name: "Prathap" }],
  creator: "Prathap",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prathap.dev", // UPDATE THIS LATER
    title: "Prathap | Creative Developer & AI Student",
    description: "Portfolio of Prathap, a creative front-end engineer and AI & Data Science student.",
    siteName: "Prathap Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prathap | Developer Portfolio",
    description: "Portfolio of Prathap, a creative front-end engineer and AI & Data Science student.",
    creator: "@prathap", // UPDATE THIS LATER
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: "#05070D",
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
