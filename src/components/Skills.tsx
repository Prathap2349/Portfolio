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
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        gsap.set([".skills-heading", ".skill-card"], { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true
        }
      });

      tl.fromTo(
        ".skills-heading",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );

      tl.fromTo(
        ".skill-card",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const categories = [
    { title: "LANGUAGES", items: profile.skills.languages, span: "lg:col-span-4" },
    { title: "FRONTEND", items: profile.skills.frontend, span: "lg:col-span-4" },
    { title: "BACKEND", items: profile.skills.backend, span: "lg:col-span-4" },
    { title: "MOBILE & DESKTOP", items: profile.skills.native_desktop || [], span: "lg:col-span-3" },
    { title: "AI / ML", items: profile.skills.ai_ml, span: "lg:col-span-3" },
    { title: "DATA & CLOUD", items: profile.skills.data, span: "lg:col-span-3" },
    { title: "TOOLS / PLATFORMS", items: profile.skills.tools, span: "lg:col-span-3" },
  ];

  return (
    <section 
      id="skills" 
      ref={containerRef}
      className="py-20 md:py-28 bg-background relative border-t border-white/10 overflow-hidden"
    >
      {/* Restrained Ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[40vw] h-[40vw] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[30vw] h-[30vw] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto w-full px-6 md:px-12 lg:px-[8vw] relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 md:mb-14 skills-heading flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-6 h-[1px] bg-amber-500 inline-block"></span>
              <h2 className="text-amber-500 font-semibold tracking-[0.35em] text-[10px] uppercase">
                03 / SKILLS & ARCHITECTURE
              </h2>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-primary-text tracking-tight">
              Technical Stack & Capabilities
            </h3>
          </div>
          <p className="text-secondary-text text-xs md:text-sm font-light max-w-md leading-relaxed">
            Core technologies and engineering foundations across full-stack applications, native clients, and intelligent systems.
          </p>
        </div>

        {/* 12-Column Structured Card Grid: Row 1 (3 x 4-col) + Row 2 (4 x 3-col) = 7 balanced cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 md:gap-6">
          {categories.map((category, idx) => (
            <div 
              key={category.title} 
              className={`skill-card col-span-1 md:col-span-1 ${category.span} flex flex-col justify-between p-6 bg-white/[0.02] border border-white/10 rounded-xl transition-all duration-300 hover:border-amber-500/30 hover:bg-white/[0.04] shadow-lg relative group overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
              
              <div>
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                  <h4 className="text-white font-mono text-[11px] font-semibold tracking-[0.2em] uppercase flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
                    {category.title}
                  </h4>
                  <span className="text-[9px] font-mono text-secondary-text/50">0{idx + 1}</span>
                </div>

                <div className="flex flex-wrap gap-2 relative z-10">
                  {category.items.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-2.5 py-1.5 bg-black/40 border border-white/10 text-primary-text/90 text-xs font-mono tracking-wider rounded transition-colors duration-200 hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/10 cursor-default shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
