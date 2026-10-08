import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ScrollProvider from "@/animations/ScrollProvider";
import Cursor from "@/components/Cursor";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://resume-gamma-bice.vercel.app"),
  title: {
    default: "Prathap | AI & Data Science Student",
    template: "%s | Prathap"
  },
  description: "Portfolio of Prathap, an AI & Data Science student. TODO(prathap): Add your real city in Tamil Nadu here.",
  keywords: ["Prathap", "AI Student", "Data Science", "Web Developer", "Portfolio"],
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
      className={`${inter.variable} ${lora.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-primary-text selection:bg-amber-500/30 font-sans">
        
        <ScrollProvider>
        <Cursor />
          {/* Scroll Progress Bar */}
          <div id="global-scroll-progress" className="fixed top-0 left-0 h-[2px] bg-amber-500 z-[100] origin-left scale-x-0" />
          
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-amber-500 text-background px-4 py-2 font-bold">
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
