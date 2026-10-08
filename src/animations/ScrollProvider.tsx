"use client";

import { useEffect, createContext, useContext, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

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
    
    // Global Scroll Progress Bar
    const progressTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.to("#global-scroll-progress", {
          scaleX: self.progress,
          duration: 0.1,
          ease: "none",
        });
      }
    });
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenisInstance(lenis); (window as unknown as { lenis: Lenis }).lenis = lenis;

    return () => {
      progressTrigger.kill();
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
