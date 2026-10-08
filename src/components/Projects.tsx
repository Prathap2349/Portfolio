"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";
import Link from "next/link";
import Image from "next/image";

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);

  const featuredProjects = projects.filter(p => p.featured).slice(0, 5);

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
              start: "top 85%",
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
          FEATURED WORK
        </h2>

        <div className="flex flex-col gap-12 lg:gap-24">
          {featuredProjects.map((project, index) => (
            <div key={project.slug} className="project-section group relative">
              <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-10" aria-label={`View ${project.name} case study`} />
              
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center w-full bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-accent-cyan/30 rounded-3xl p-6 lg:p-12 transition-all duration-500">
                
                {/* Text Content */}
                <div className="flex-1 w-full flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="text-accent-cyan/50 font-bold text-xl lg:text-2xl w-8 shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <span className="text-[10px] tracking-widest text-secondary-text uppercase px-3 py-1 rounded-full border border-white/10 bg-white/5">
                      {project.category}
                    </span>
                    <span className={`text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border ${project.status === 'Active' ? 'border-accent-cyan/30 text-accent-cyan bg-accent-cyan/10' : 'border-white/10 text-secondary-text'}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl lg:text-5xl font-bold text-primary-text mb-4 tracking-tight group-hover:text-accent-cyan transition-colors duration-300">
                    {project.name}
                  </h3>
                  
                  <p className="text-secondary-text text-base lg:text-lg lg:max-w-xl font-light mb-8 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-10">
                    {project.technologies.slice(0, 5).map((tech, i) => (
                      <span key={i} className="text-[10px] font-medium tracking-wider text-primary-text uppercase border border-white/10 bg-white/5 px-3 py-1.5 rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <span className="inline-flex items-center gap-2 text-primary-text group-hover:text-accent-cyan transition-colors text-xs font-semibold tracking-widest uppercase relative z-20 pointer-events-none">
                      VIEW CASE STUDY
                      <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                    
                    <div className="flex items-center gap-4 relative z-20">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link text-[10px] font-semibold tracking-widest text-secondary-text hover:text-primary-text transition-colors uppercase flex items-center gap-1"
                          aria-label={`Open ${project.name} source code on GitHub`}
                        >
                          SOURCE <span className="inline-block transform transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">↗</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link flex items-center gap-1 text-[10px] font-semibold tracking-widest text-secondary-text hover:text-primary-text transition-colors uppercase"
                          aria-label={`Open ${project.name} live demo`}
                        >
                          LIVE <span className="inline-block transform transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Image Preview */}
                <div className="flex-1 w-full lg:w-auto relative aspect-video rounded-2xl overflow-hidden border border-white/10 group-hover:border-accent-cyan/20 transition-colors duration-500 bg-background">
                  <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
                  {project.images && project.images.length > 0 ? (
                    <Image
                      src={project.images[0]}
                      alt={`${project.name} preview`}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center transform transition-transform duration-700 ease-out group-hover:scale-105 bg-gradient-to-br from-background to-white/5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(111,231,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]" />
                      <span className="text-secondary-text/30 font-bold text-4xl mb-4 uppercase tracking-widest opacity-20">{project.name}</span>
                      <span className="text-accent-cyan/50 text-[10px] tracking-widest uppercase px-3 py-1 border border-accent-cyan/20 rounded-full backdrop-blur-sm z-10">TECHNICAL PREVIEW</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex justify-center project-section">
          <Link 
            href="/projects"
            className="group flex items-center gap-4 border border-white/10 rounded-full px-8 py-4 hover:border-accent-cyan/50 hover:bg-accent-cyan/5 text-primary-text hover:text-accent-cyan transition-all duration-300"
          >
            <span className="text-xs tracking-[0.2em] font-semibold uppercase">VIEW ALL PROJECTS</span>
            <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
