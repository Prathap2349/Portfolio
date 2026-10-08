"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".skill-group",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            once: true
          },
        }
      );

      // Random float animation for skill pills
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.utils.toArray(".skill-pill").forEach((pill: HTMLElement) => {
           gsap.to(pill, {
             y: () => (Math.random() - 0.5) * 6,
             duration: () => 1.5 + Math.random() * 2,
             repeat: -1,
             yoyo: true,
             ease: "sine.inOut",
             delay: () => Math.random() * 2
           });
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const categories = [
    { title: "LANGUAGES", items: profile.skills.languages },
    { title: "FRONTEND", items: profile.skills.frontend },
    { title: "BACKEND", items: profile.skills.backend },
    { title: "AI / ML", items: profile.skills.ai_ml },
    { title: "DATA", items: profile.skills.data },
    { title: "TOOLS / PLATFORMS", items: profile.skills.tools },
  ];

  return (
    <section 
      id="skills" 
      ref={containerRef}
      className="py-32 bg-background relative border-t border-white/5 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-accent-cyan/5 rounded-full blur-[150px] mix-blend-screen opacity-30 pointer-events-none" />

      <div className="container mx-auto w-full px-6 md:px-12 lg:px-[8vw] relative z-10">
        <h2 data-scroll-anchor className="text-accent-cyan font-semibold tracking-[0.4em] text-[10px] mb-24 uppercase skill-group flex items-center gap-4">
          <span className="w-8 h-[1px] bg-accent-cyan/50 inline-block"></span>
          04 / SKILLS & ARCHITECTURE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24">
          {categories.map((category) => (
            <div key={category.title} className="skill-group flex flex-col relative">
              <h3 className="text-secondary-text font-bold tracking-[0.2em] text-[10px] mb-8 uppercase border-b border-white/10 pb-4 w-full">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-4 relative z-10">
                {category.items.map((skill) => (
                  <div 
                    key={skill} 
                    className="skill-pill group relative px-5 py-2.5 bg-black border border-white/10 text-primary-text/90 text-xs tracking-wider rounded-lg hover:border-accent-cyan/50 hover:text-accent-cyan hover:bg-accent-cyan/5 transition-all duration-300 cursor-default shadow-lg hover:shadow-[0_0_15px_rgba(111,231,255,0.2)]"
                  >
                    <span className="relative z-10">{skill}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
