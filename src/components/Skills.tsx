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
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const categories = [
    { title: "DEVELOPMENT", items: profile.skills.development },
    { title: "PROGRAMMING", items: profile.skills.programming },
    { title: "AI / DATA", items: profile.skills.ai_data },
    { title: "TOOLS", items: profile.skills.tools },
  ];

  return (
    <section 
      id="skills" 
      ref={containerRef}
      className="py-24 md:py-32 scroll-mt-[100px] min-h-[70svh] bg-background relative border-t border-white/5"
    >
      <div className="container mx-auto w-full px-6 md:px-12 lg:px-[8vw]">
        <h2 className="text-accent-cyan font-semibold tracking-[0.25em] text-xs mb-20 uppercase skill-group">
          SKILLS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {categories.map((category) => (
            <div key={category.title} className="skill-group">
              <h3 className="text-secondary-text/50 font-light tracking-[0.2em] text-xs mb-8 uppercase">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.items.map((skill) => (
                  <span 
                    key={skill} 
                    className="px-4 py-2 border border-white/10 text-primary-text/90 text-sm tracking-wide bg-white/[0.02]"
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
