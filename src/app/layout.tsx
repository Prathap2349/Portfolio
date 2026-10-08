import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ScrollProvider from "@/animations/ScrollProvider";
import Cursor from "@/components/Cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://resume-gamma-bice.vercel.app"),
  title: {
    default: "Prathap | AI & Data Science Student & Developer",
    template: "%s | Prathap"
  },
  description: "Portfolio of Prathap, a creative front-end engineer and AI & Data Science student. Exploring web development, AI, and building intuitive digital experiences.",
  keywords: ["Prathap", "AI Student", "Data Science", "Web Developer", "React", "Next.js", "Portfolio"],
  authors: [{ name: "Prathap" }],
  creator: "Prathap",
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
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-primary-text selection:bg-accent-cyan/30">
        
        {/* Global Cinematic Texture Overlay */}
        <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        <div className="fixed inset-0 z-40 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] mix-blend-multiply"></div>

        <Cursor />
        <ScrollProvider>
          {/* Scroll Progress Bar */}
          <div id="global-scroll-progress" className="fixed top-0 left-0 h-[2px] bg-accent-cyan z-[100] origin-left scale-x-0" />
          
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
