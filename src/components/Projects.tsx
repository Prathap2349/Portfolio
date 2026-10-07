"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);

  const featuredProjects = projects.filter(p => p.featured).slice(0, 6);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".project-section").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
              once: true
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
      className="py-24 md:py-32 bg-deep-navy relative"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--color-background)_0%,transparent_100%)] opacity-70" />

      <div className="container mx-auto w-full px-6 md:px-12 lg:px-[8vw] relative z-10">
        <h2 className="text-accent-cyan font-semibold tracking-[0.25em] text-xs mb-12 uppercase project-section flex items-center gap-4">
          <span className="w-8 h-[1px] bg-accent-cyan/50 inline-block"></span>
          SELECTED WORK
        </h2>

        <div className="flex flex-col border-t border-white/5">
          {featuredProjects.map((project, index) => (
            <div key={project.slug} className="project-section group border-b border-white/5 py-8 md:py-10 hover:bg-white/[0.02] transition-colors duration-500 relative -mx-6 px-6 md:mx-0 md:px-6 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 w-full">
                
                {/* Number */}
                <div className="text-secondary-text/30 font-bold text-xl md:text-2xl w-8 shrink-0 group-hover:text-accent-cyan/50 transition-colors">
                  {String(index + 1).padStart(2, "0")}
                </div>
                
                {/* Title & Desc */}
                <div className="flex-grow">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary-text mb-2 tracking-tight group-hover:text-accent-cyan transition-colors duration-300">
                    {project.name}
                  </h3>
                  <p className="text-secondary-text text-sm md:text-base md:max-w-2xl font-light">
                    {project.description}
                  </p>
                </div>
                
                {/* Meta & Tags */}
                <div className="flex flex-col gap-3 shrink-0 md:w-48 lg:w-64">
                  <div className="flex gap-4 items-center">
                    <span className="text-[10px] tracking-widest text-secondary-text uppercase font-semibold">
                      {project.year}
                    </span>
                    <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full border ${project.status === 'Active' ? 'border-accent-cyan/30 text-accent-cyan bg-accent-cyan/10' : 'border-white/10 text-secondary-text'}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-[10px] tracking-wider text-secondary-text/70 uppercase border border-white/10 px-2 py-0.5 rounded-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-start md:justify-end shrink-0 md:w-32 mt-2 md:mt-0 gap-4">
                  {project.visibility === "private" ? (
                    <span className="text-[10px] font-medium tracking-widest text-secondary-text/50 uppercase">
                      PRIVATE
                    </span>
                  ) : project.githubUrl ? (
                    <a 
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-medium tracking-widest text-primary-text hover:text-accent-cyan transition-colors uppercase"
                    >
                      SOURCE
                    </a>
                  ) : null}
                  
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-medium tracking-widest text-primary-text hover:text-accent-cyan transition-colors uppercase"
                    >
                      LIVE <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center project-section">
          <Link 
            href="/projects"
            className="flex items-center gap-4 border border-white/10 rounded-full px-8 py-4 hover:border-accent-cyan/50 hover:bg-accent-cyan/5 text-primary-text hover:text-accent-cyan transition-all duration-300"
          >
            <span className="text-xs tracking-[0.2em] font-semibold uppercase">VIEW ALL PROJECTS</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
