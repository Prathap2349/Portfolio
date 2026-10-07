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
            toggleActions: "play none none none",
            once: true
          },
        }
      );
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
      className="py-24 md:py-32 min-h-[70svh] bg-background relative border-t border-white/5"
    >
      <div className="container mx-auto w-full px-6 md:px-12 lg:px-[8vw]">
        <h2 className="text-accent-cyan font-semibold tracking-[0.25em] text-xs mb-16 uppercase skill-group flex items-center gap-4">
          <span className="w-8 h-[1px] bg-accent-cyan/50 inline-block"></span>
          SKILLS & TECHNOLOGIES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {categories.map((category) => (
            <div key={category.title} className="skill-group flex flex-col">
              <h3 className="text-secondary-text font-semibold tracking-widest text-xs mb-6 uppercase border-b border-white/5 pb-4">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.items.map((skill) => (
                  <span 
                    key={skill} 
                    className="px-4 py-2 border border-white/10 text-primary-text/90 text-sm tracking-wide bg-white/[0.02] hover:border-accent-cyan/30 hover:text-accent-cyan transition-colors rounded-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
