"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";


export interface JourneyProject {
  slug: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  images?: string[];
  status: string;
  category: string;
}

export default function ProjectJourney({ projects }: { projects: JourneyProject[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const journeyStages = ["IDEA", "BUILD", "ENGINEER", "TEST", "SHIP"];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Check for mobile or reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 1024;
    
    if (prefersReducedMotion || isMobile) {
      // Simplified mobile/accessible version animations
      gsap.utils.toArray<HTMLElement>(".mobile-project-card").forEach((card) => {
        gsap.fromTo(card, 
          { opacity: 0, y: 30 },
          {
            opacity: 1, 
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none none",
            }
          }
        );
      });
      return;
    }

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".journey-panel");
      if (panels.length === 0) return;

      const track = trackRef.current;
      if (!track) return;

      const totalScroll = panels.length * 100; // 100vw per panel approx

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${totalScroll}%`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });

      // Horizontal scroll
      tl.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
      }, 0);

      // Node highlighting sync
      const nodes = gsap.utils.toArray<HTMLElement>(".journey-node");
      
      panels.forEach((_, i) => {
        // approximate stage index based on panel
        const stageIndex = Math.min(Math.floor((i / panels.length) * journeyStages.length), journeyStages.length - 1);
        
        // Progress bar fill
        tl.to(".journey-progress-fill", {
          height: `${((stageIndex + 1) / journeyStages.length) * 100}%`,
          ease: "none",
          duration: 1 / panels.length
        }, i / panels.length);

        // Active node styling
        nodes.forEach((node, nodeIdx) => {
          if (nodeIdx === stageIndex) {
            tl.to(node, {
              backgroundColor: "rgba(111,231,255,1)",
              boxShadow: "0 0 15px rgba(111,231,255,0.8)",
              scale: 1.2,
              duration: 0.1
            }, i / panels.length);
          } else if (nodeIdx < stageIndex) {
            tl.to(node, {
              backgroundColor: "rgba(111,231,255,0.4)",
              boxShadow: "none",
              scale: 1,
              duration: 0.1
            }, i / panels.length);
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, [projects.length, journeyStages.length]);

  return (
    <>
      {/* Desktop/Tablet Horizontal Scroll Journey */}
      <div className="hidden lg:block h-screen relative" ref={containerRef}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,var(--color-background)_0%,transparent_100%)] opacity-70 z-0 pointer-events-none" />
        
        <div className="absolute top-12 left-12 z-20">
          <h2 className="text-accent-cyan font-semibold tracking-[0.25em] text-xs uppercase flex items-center gap-4">
            <span className="w-8 h-[1px] bg-accent-cyan/50 inline-block"></span>
            PROJECT JOURNEY
          </h2>
        </div>

        {/* Vertical Journey Tracker */}
        <div className="absolute left-12 top-1/2 -translate-y-1/2 h-1/2 w-8 z-20 flex flex-col items-center justify-between pointer-events-none">
          <div className="absolute top-0 bottom-0 w-[1px] bg-white/10 left-1/2 -translate-x-1/2 z-0" />
          <div className="absolute top-0 w-[2px] bg-accent-cyan left-1/2 -translate-x-1/2 z-10 journey-progress-fill transition-all" style={{ height: "0%" }} />
          
          {journeyStages.map((stage) => (
            <div key={stage} className="relative z-20 flex items-center group">
              <div className="w-2 h-2 rounded-full bg-white/20 border border-background journey-node" />
              <span className="absolute left-6 text-[9px] tracking-[0.3em] font-bold text-secondary-text opacity-50 group-hover:opacity-100 transition-opacity">
                {stage}
              </span>
            </div>
          ))}
        </div>

        {/* Horizontal Track */}
        <div className="flex h-full w-[100vw] flex-nowrap" ref={trackRef}>
          {projects.map((project) => (
            <div key={project.slug} className="journey-panel w-[100vw] h-full flex-shrink-0 flex items-center justify-center relative pl-32 pr-12">
              
              <div className="w-full max-w-6xl grid grid-cols-2 gap-16 items-center">
                {/* Content */}
                <div className="flex flex-col" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className="text-[10px] tracking-widest text-secondary-text uppercase px-3 py-1 rounded-full border border-white/10 bg-white/5">
                      {project.category}
                    </span>
                    <span className={`text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border ${project.status === 'Building' ? 'border-accent-cyan/30 text-accent-cyan bg-accent-cyan/10' : 'border-white/10 text-secondary-text'}`}>
                      {project.status}
                    </span>
                  </div>

                  <h3 className="text-5xl xl:text-6xl font-bold text-primary-text mb-6 tracking-tight drop-shadow-lg">
                    {project.name}
                  </h3>
                  
                  <p className="text-secondary-text text-lg font-light mb-8 leading-relaxed max-w-xl">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-12 max-w-xl">
                    {project.technologies.slice(0, 6).map((tech, i) => (
                      <span key={i} className="text-[10px] font-medium tracking-wider text-primary-text uppercase border border-white/10 bg-white/5 px-3 py-1.5 rounded-sm">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-6">
                    <Link 
                      href={`/projects/${project.slug}`}
                      className="group inline-flex items-center gap-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
                    >
                      VIEW PROJECT <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                    
                    <div className="flex items-center gap-4">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link text-[10px] font-semibold tracking-widest text-secondary-text hover:text-primary-text transition-colors uppercase flex items-center gap-1"
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
                        >
                          LIVE <span className="inline-block transform transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-background shadow-2xl">
                  {project.images && project.images.length > 0 ? (
                    <Image
                      src={project.images[0]}
                      alt={`${project.name} preview`}
                      fill
                      sizes="50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-background to-white/5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(111,231,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]" />
                      <span className="text-secondary-text/30 font-bold text-5xl mb-4 uppercase tracking-widest opacity-20 text-center px-4">{project.name}</span>
                      <span className="text-accent-cyan/50 text-[10px] tracking-widest uppercase px-3 py-1 border border-accent-cyan/20 rounded-full backdrop-blur-sm z-10">TECHNICAL PREVIEW</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Mobile/Reduced Motion Vertical Layout */}
      <div className="lg:hidden py-24 px-6 md:px-12">
        <h2 className="text-accent-cyan font-semibold tracking-[0.25em] text-xs uppercase mb-16 flex items-center gap-4">
          <span className="w-8 h-[1px] bg-accent-cyan/50 inline-block"></span>
          PROJECTS
        </h2>

        <div className="flex flex-col gap-16">
          {projects.map((project) => (
            <div key={project.slug} className="mobile-project-card flex flex-col gap-6">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-background">
                {project.images && project.images.length > 0 ? (
                  <Image
                    src={project.images[0]}
                    alt={`${project.name} preview`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-background to-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(111,231,255,0.05)_1px,transparent_1px)] bg-[size:12px_12px]" />
                    <span className="text-secondary-text/30 font-bold text-2xl mb-2 uppercase tracking-widest opacity-20 text-center px-4">{project.name}</span>
                    <span className="text-accent-cyan/50 text-[8px] tracking-widest uppercase px-2 py-0.5 border border-accent-cyan/20 rounded-full backdrop-blur-sm z-10">TECHNICAL PREVIEW</span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-[9px] tracking-widest text-secondary-text uppercase px-2 py-1 rounded-full border border-white/10 bg-white/5">
                    {project.category}
                  </span>
                  <span className={`text-[9px] tracking-widest uppercase px-2 py-1 rounded-full border ${project.status === 'Building' ? 'border-accent-cyan/30 text-accent-cyan bg-accent-cyan/10' : 'border-white/10 text-secondary-text'}`}>
                    {project.status}
                  </span>
                </div>
                
                <h3 className="text-3xl font-bold text-primary-text mb-3 tracking-tight">{project.name}</h3>
                <p className="text-secondary-text text-sm font-light mb-6">{project.description}</p>
                
                <div className="flex items-center gap-4 flex-wrap">
                  <Link 
                    href={`/projects/${project.slug}`}
                    className="group inline-flex items-center gap-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan px-5 py-2.5 rounded-full text-[10px] font-semibold tracking-widest uppercase transition-colors"
                  >
                    VIEW PROJECT <span className="inline-block transform transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                  
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-semibold tracking-widest text-secondary-text hover:text-primary-text transition-colors uppercase"
                    >
                      SOURCE ↗
                    </a>
                  )}
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-semibold tracking-widest text-secondary-text hover:text-primary-text transition-colors uppercase"
                    >
                      LIVE ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
