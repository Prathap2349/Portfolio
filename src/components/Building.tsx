"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";

export default function Building() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".building-item",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="building" 
      ref={containerRef}
      className="py-20 bg-background relative border-t border-white/5"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-[8vw]">
        <h2 className="text-accent-cyan font-semibold tracking-[0.25em] text-xs mb-10 uppercase building-item">
          WHAT I'M BUILDING
        </h2>

        <div className="flex flex-col">
          {profile.projects.filter(p => (p as any).isBuilding).map((project, index) => (
            <div 
              key={project.id} 
              className="building-item group relative py-6 border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] hover:border-transparent transition-all duration-300 cursor-pointer -mx-4 px-4 md:mx-0 md:px-4 rounded-md"
            >
              {/* Desktop Layout: 3 Column Grid */}
              <div className="hidden md:grid md:grid-cols-[3rem_minmax(12rem,16rem)_1fr] gap-4 items-baseline">
                <div className="text-secondary-text/40 font-light text-sm group-hover:text-accent-cyan/60 group-hover:-translate-y-0.5 transition-all duration-300">
                  {String(index + 1).padStart(2, "0")}
                </div>
                
                <h3 className="text-lg font-semibold text-primary-text tracking-wide group-hover:text-accent-cyan group-hover:translate-x-2 transition-all duration-300">
                  {project.name}
                </h3>
                
                <p className="text-secondary-text text-base">
                  {project.description}
                </p>
              </div>

              {/* Mobile Layout: Stacked */}
              <div className="flex flex-col md:hidden gap-2">
                <div className="flex items-baseline gap-4">
                  <div className="text-secondary-text/40 font-light text-sm group-hover:text-accent-cyan/60 transition-colors">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-lg font-semibold text-primary-text tracking-wide group-hover:text-accent-cyan transition-colors">
                    {project.name}
                  </h3>
                </div>
                <p className="text-secondary-text text-sm pl-8">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
