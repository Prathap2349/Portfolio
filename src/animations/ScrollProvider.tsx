"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollProvider({ children }: { children: React.ReactNode }) {
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
    });

    lenis.on('scroll', ScrollTrigger.update);
    
    // Named callback to ensure deterministic cleanup
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);
    
    // Expose lenis instance globally for navigation
    // This allows Navigation components to use lenis.scrollTo() safely
    (window as any).lenis = lenis;

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
      if ((window as any).lenis === lenis) {
        delete (window as any).lenis;
      }
    };
  }, []);

  return <>{children}</>;
}
