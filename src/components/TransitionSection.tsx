"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";

export default function TransitionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Big text scrub
      gsap.fromTo(textRef.current,
        { scale: 0.8, letterSpacing: "0.1em", opacity: 0.2 },
        {
          scale: 1.2,
          letterSpacing: "0.4em",
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        }
      );

      // Tech Marquee continuous rotation
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          ease: "none",
          duration: 30,
          repeat: -1,
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const allTech = [...profile.skills.languages, ...profile.skills.frontend, ...profile.skills.backend, ...profile.skills.ai_ml];
  const marqueeItems = [...allTech, ...allTech, ...allTech]; // triple for smooth infinite scroll

  return (
    <section ref={containerRef} className="py-32 relative bg-background overflow-hidden flex flex-col items-center justify-center gap-24">
      
      {/* Tech Marquee Strip (Top) */}
      <div className="w-full w-full overflow-hidden border-y border-white/5 py-4 bg-white/[0.02] transform -rotate-2">
        <div className="flex whitespace-nowrap w-[200%]" ref={marqueeRef}>
          {marqueeItems.map((item, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-6 text-xs font-bold tracking-[0.2em] text-accent-cyan/60 uppercase">{item}</span>
              <span className="text-secondary-text/30 text-xs">+</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Transition Text */}
      <h2 
        ref={textRef}
        className="text-4xl md:text-7xl font-bold text-primary-text whitespace-nowrap px-4"
      >
        ELEVATING IDEAS
      </h2>

    </section>
  );
}
