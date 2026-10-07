"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";
import { ExternalLink } from "lucide-react";

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".project-section").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="projects" 
      ref={containerRef}
      className="py-24 md:py-32 scroll-mt-[100px] bg-deep-navy relative"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--color-background)_0%,transparent_100%)] opacity-70" />

      <div className="container mx-auto w-full px-6 md:px-12 lg:px-[8vw] relative z-10">
        <h2 className="text-accent-cyan font-semibold tracking-[0.25em] text-xs mb-32 uppercase project-section">
          SELECTED WORK
        </h2>

        <div className="flex flex-col gap-24">
          {profile.projects.filter(p => p.featured).slice(0, 6).map((project, index) => (
            <div key={project.slug} className="project-section group relative flex flex-col md:flex-row gap-8 md:gap-16 items-start p-8 -mx-8 hover:bg-white/[0.02] rounded-2xl transition-colors duration-500 cursor-pointer">
              <div className="text-6xl md:text-8xl font-bold text-white/[0.03] group-hover:text-white/[0.08] group-hover:-translate-y-2 group-hover:-translate-x-2 transition-all duration-500 tracking-tighter shrink-0 select-none -mt-2 md:-mt-6">
                {String(index + 1).padStart(2, "0")}
              </div>
              
              <div className="flex-grow relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold text-primary-text mb-4 tracking-tight group-hover:text-accent-cyan group-hover:translate-x-2 transition-all duration-500">
                  {project.name}
                </h3>
                <p className="text-secondary-text text-lg max-w-2xl mb-6 leading-relaxed group-hover:text-secondary-text/90 transition-colors">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {project.technologies.map(tech => (
                    <span key={tech} className="text-xs tracking-wider text-accent-cyan/70 group-hover:text-accent-cyan bg-accent-cyan/10 group-hover:bg-accent-cyan/20 px-3 py-1.5 rounded-sm transition-colors duration-300">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-6 items-center">
                  {project.visibility === "private" ? (
                    <span className="text-xs font-medium tracking-widest text-secondary-text/50 uppercase border border-white/10 px-3 py-1.5 rounded-sm">
                      PRIVATE REPOSITORY
                    </span>
                  ) : project.githubUrl ? (
                    <a 
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium tracking-widest text-primary-text hover:text-accent-cyan transition-colors uppercase group"
                    >
                      SOURCE
                    </a>
                  ) : null}
                  
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium tracking-widest text-primary-text hover:text-accent-cyan transition-colors uppercase group"
                    >
                      <ExternalLink size={16} className="group-hover:scale-110 transition-transform" />
                      Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center project-section">
          <a 
            href="/projects"
            className="flex items-center gap-4 border border-white/10 rounded-full px-8 py-4 hover:border-accent-cyan/50 hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-xs tracking-[0.2em] font-semibold text-primary-text uppercase">VIEW ALL PROJECTS</span>
            <span className="text-accent-cyan">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
