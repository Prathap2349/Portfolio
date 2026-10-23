"use client";

import { useEffect, createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Check reduced motion BEFORE initializing
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReducedMotion.matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      autoRaf: false, // We will manually handle raf via GSAP ticker
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
    });

    lenis.on('scroll', ScrollTrigger.update);
    
    // Named callback to ensure deterministic cleanup
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);
    
    // Global Scroll Progress Bar
    const progressTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.to("#global-scroll-progress", {
          scaleX: self.progress,
          duration: 0.05,
          ease: "none",
        });
      }
    });
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenisInstance(lenis);
    (window as unknown as { lenis: Lenis | null }).lenis = lenis;

    // Refresh ScrollTrigger once fonts are loaded to prevent pin jumps
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      progressTrigger.kill();
      lenis.destroy();
      (window as unknown as { lenis: Lenis | null }).lenis = null;
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  // Recalculate ScrollTrigger measurements across route transitions
  useEffect(() => {
    if (!lenisInstance) return;
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname, lenisInstance]);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
