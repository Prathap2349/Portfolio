"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";

export default function Building() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Strictly filter building projects from verified data
  const buildingProjects = projects.filter(p => p.isBuilding);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".building-item",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
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

  if (buildingProjects.length === 0) return null;

  return (
    <section 
      id="building" 
      ref={containerRef}
      className="py-24 md:py-32 bg-background relative border-t border-white/5"
    >
      <div className="container mx-auto w-full px-6 md:px-12 lg:px-[8vw]">
        <h2 data-scroll-anchor className="text-accent-cyan font-semibold tracking-[0.25em] text-xs mb-12 uppercase building-item flex items-center gap-4">
          <span className="w-8 h-[1px] bg-accent-cyan/50 inline-block"></span>
          BUILDING NOW
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {buildingProjects.map((project, index) => (
            <div 
              key={project.slug} 
              className="building-item flex flex-col p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors group"
            >
              <div className="text-secondary-text/30 font-bold text-lg mb-6 group-hover:text-accent-cyan/50 transition-colors">
                {String(index + 1).padStart(2, "0")}
              </div>
              
              <h3 className="text-xl font-bold tracking-tight text-primary-text mb-3 group-hover:text-accent-cyan transition-colors">
                {project.name}
              </h3>
              
              <p className="text-secondary-text text-sm mb-6 flex-grow font-light leading-relaxed">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 3).map((tech, i) => (
                  <span key={i} className="text-[10px] tracking-wider text-accent-cyan/80 uppercase">
                    {tech}
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
