"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { profile } from "@/data/profile";

export default function TransitionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          ease: "none",
          duration: 40,
          repeat: -1,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const allTech = [...profile.skills.languages, ...profile.skills.frontend, ...profile.skills.backend, ...profile.skills.ai_ml];
  const marqueeItems = [...allTech, ...allTech, ...allTech, ...allTech];

  return (
    <section ref={containerRef} className="relative bg-background overflow-hidden py-12 flex items-center justify-center border-y border-white/5 bg-white/[0.01]">
      <div className="w-full overflow-hidden">
        <div className="flex whitespace-nowrap w-[200%]" ref={marqueeRef}>
          {marqueeItems.map((item, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-6 text-[10px] md:text-xs font-bold tracking-[0.2em] text-accent-cyan/50 uppercase">{item}</span>
              <span className="text-secondary-text/20 text-xs text-[10px]">/</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
