"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { View } from "lucide-react";

export interface JourneyProject {
  slug: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  images?: string[];
  videoUrl?: string;
  mockupUrl?: string;
  status: string;
  problem?: string;
  category: string;
}

const MediaContent = ({ project }: { project: JourneyProject }) => (
  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
    {project.videoUrl ? (
      <video 
        src={project.videoUrl} 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    ) : project.images && project.images.length > 0 ? (
      <Image
        src={project.images[0]}
        alt={`${project.name} preview`}
        fill
        sizes="(max-width: 768px) 100vw, 60vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
    ) : (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-black to-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]" />
        <span className="text-white/40 font-bold text-4xl lg:text-5xl mb-4 uppercase tracking-widest text-center px-8 z-10 drop-shadow-lg">{project.name}</span>
        <span className="text-white/20 font-light text-sm uppercase tracking-[0.3em] z-10 mt-4">PROJECT PREVIEW</span>
      </div>
    )}
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
      <View className="text-white w-12 h-12" />
    </div>
  </div>
);

export default function ProjectJourney({ projects }: { projects: JourneyProject[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const journeyStages = ["IDEA", "BUILD", "ENGINEER", "TEST", "SHIP"];

  // Helper to map project status to a stage index
  const getStageIndex = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("idea") || s.includes("concept")) return 0;
    if (s.includes("development") || s.includes("building")) return 1;
    if (s.includes("engineer") || s.includes("alpha")) return 2;
    if (s.includes("beta") || s.includes("test")) return 3;
    return 4; // SHIP / Active / Completed
  };

  // Helper to get glow color by category
  const getGlowColor = (category: string) => {
    const c = category.toUpperCase();
    if (c === "AI" || c === "MACHINE LEARNING") return "bg-purple-500/20";
    if (c === "WEB" || c === "FRONTEND" || c === "BACKEND") return "bg-blue-500/20";
    if (c === "TOOLS" || c === "CLI") return "bg-green-500/20";
    return "bg-accent-cyan/20";
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 1024;
    
    if (prefersReducedMotion || isMobile) {
      // For mobile snap carousel, we don't need GSAP scroll pinning
      return;
    }

    const sections = gsap.utils.toArray<HTMLElement>(".journey-panel");
    if (sections.length === 0) return;

    const ctx = gsap.context(() => {
      // Horizontal Scroll Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1, 
          end: () => `+=${trackRef.current?.offsetWidth || 0}`,
          invalidateOnRefresh: true, // Fix for layout shifts
          onUpdate: (self) => {
             // Update counter manually based on progress
             const counter = containerRef.current?.querySelector(".project-counter");
             if (counter) {
                const activeIndex = Math.min(
                   Math.floor(self.progress * projects.length),
                   projects.length - 1
                );
                counter.textContent = (activeIndex + 1).toString().padStart(2, '0');
             }
          }
        }
      });

      // Hold at start
      tl.to({}, { duration: 0.05 });
      // Slide all sections
      tl.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        duration: 1
      });
      // Hold at end
      tl.to({}, { duration: 0.05 });

      // Parallax effect using containerAnimation
      sections.forEach((section, i) => {
        const image = section.querySelector(".parallax-image");
        const content = section.querySelector(".parallax-content");
        
        if (image && content) {
          gsap.fromTo(image, 
            { x: -50 }, 
            {
              x: 50,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                containerAnimation: tl,
                start: "left right",
                end: "right left",
                scrub: true,
              }
            }
          );
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, [projects]);

  const totalStr = projects.length.toString().padStart(2, '0');

  return (
    <>
      {/* Desktop Horizontal Scroll Layout */}
      <div className="hidden lg:block h-screen w-full relative z-20 bg-background" ref={containerRef}>
        <div className="absolute top-12 left-12 z-50 flex items-center gap-4 mix-blend-difference text-white">
          <span className="text-[10px] font-semibold tracking-[0.4em] uppercase">03 / PROJECTS</span>
          <span className="w-8 h-[1px] bg-white/50"></span>
        </div>
        
        <div className="absolute bottom-12 right-12 z-50 mix-blend-difference text-white text-lg font-light tracking-widest">
          <span className="project-counter">01</span> / <span className="text-white/50">{totalStr}</span>
        </div>

        <div className="h-full w-full flex" ref={trackRef} style={{ width: `${projects.length * 100}vw` }}>
          {projects.map((project, i) => {
            const currentStageIndex = getStageIndex(project.status);
            const numStr = (i + 1).toString().padStart(2, '0');
            const glow = getGlowColor(project.category);

            return (
              <div key={project.slug} className="journey-panel h-screen w-screen relative flex-shrink-0 flex items-center overflow-hidden px-[8vw]">
                {/* Ambient Category Glow */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] ${glow} rounded-full blur-[150px] mix-blend-screen opacity-50 pointer-events-none`} />

                {/* Main Content Grid */}
                <div className="w-full grid grid-cols-12 gap-12 items-center relative z-10">
                  
                  {/* Left: Tracker & Text */}
                  <div className="col-span-5 flex flex-col gap-12 parallax-content relative z-20">
                    
                    {/* Stage Tracker */}
                    <div className="flex flex-col gap-6 relative">
                      <div className="absolute left-[5px] top-2 bottom-2 w-[1px] bg-white/10 z-0"></div>
                      
                      {journeyStages.map((stage, sIdx) => {
                        const isActive = sIdx === currentStageIndex;
                        const isPast = sIdx < currentStageIndex;
                        return (
                          <div key={stage} className={`flex items-center gap-6 relative z-10 ${isActive ? "opacity-100" : isPast ? "opacity-40" : "opacity-20"}`}>
                            <div className={`w-3 h-3 rounded-full border-[1px] ${isActive ? "bg-accent-cyan border-accent-cyan shadow-[0_0_10px_rgba(111,231,255,0.8)]" : isPast ? "bg-white border-white" : "bg-background border-white"}`}></div>
                            <span className={`text-[10px] tracking-[0.2em] font-semibold uppercase ${isActive ? "text-accent-cyan" : "text-white"}`}>{stage}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="text-[10px] tracking-widest text-secondary-text uppercase px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                          {project.category}
                        </span>
                      </div>
                      
                      <h3 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-xl">{project.name}</h3>
                      <p className="text-white/80 text-lg font-light mb-8 max-w-md leading-relaxed drop-shadow-md">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-10">
                        {project.technologies.slice(0, 4).map((tech, i) => (
                          <span key={i} className="text-[10px] font-medium tracking-wider text-white uppercase border border-white/20 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-sm">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-6">
                        {project.problem && !project.problem.includes("[PLACEHOLDER") ? (
                          <Link 
                            href={`/projects/${project.slug}`}
                            className="group inline-flex items-center gap-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan backdrop-blur-md"
                          >
                            EXPLORE <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                          </Link>
                        ) : project.githubUrl ? (
                          <a 
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/30 backdrop-blur-md"
                          >
                            SOURCE CODE <span className="inline-block transform transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                          </a>
                        ) : project.liveUrl ? (
                          <a 
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/30 backdrop-blur-md"
                          >
                            VIEW LIVE <span className="inline-block transform transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Right: Media */}
                  <div className="col-span-7 h-[60vh] relative parallax-image">
                    {project.problem && !project.problem.includes("[PLACEHOLDER") ? (
                      <Link href={`/projects/${project.slug}`} className="block w-full h-full group">
                        <MediaContent project={project} />
                      </Link>
                    ) : project.githubUrl || project.liveUrl ? (
                      <a href={project.liveUrl || project.githubUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full group">
                        <MediaContent project={project} />
                      </a>
                    ) : (
                      <div className="block w-full h-full group">
                        <MediaContent project={project} />
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile/Reduced Motion Swipeable Carousel */}
      <div className="lg:hidden w-full overflow-hidden bg-background py-16 relative">
        <h2 className="text-[10px] text-accent-cyan font-semibold tracking-[0.4em] uppercase mb-8 px-6 flex items-center gap-4">
          03 / PROJECTS
          <span className="w-8 h-[1px] bg-accent-cyan/50 inline-block"></span>
        </h2>

        {/* Snap Carousel Container */}
        <div className="w-full overflow-x-auto snap-x snap-mandatory flex gap-6 px-6 pb-12 pt-4 scrollbar-hide" style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}>
          {projects.map((project, i) => {
            const glow = getGlowColor(project.category);
            const numStr = (i + 1).toString().padStart(2, '0');
            
            return (
              <div key={project.slug} className="snap-center shrink-0 w-[85vw] max-w-sm flex flex-col gap-6 relative">
                {/* Mobile glow */}
                <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[50%] ${glow} rounded-full blur-[80px] mix-blend-screen opacity-40 pointer-events-none z-0`} />

                <div className="relative z-10 w-full aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 bg-black shadow-xl group">
                  {project.problem && !project.problem.includes("[PLACEHOLDER") ? (
                    <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-20">
                      <span className="sr-only">View {project.name}</span>
                    </Link>
                  ) : project.githubUrl || project.liveUrl ? (
                    <a href={project.liveUrl || project.githubUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20">
                      <span className="sr-only">View {project.name}</span>
                    </a>
                  ) : null}

                  {/* Media */}
                  {project.videoUrl ? (
                    <video src={project.videoUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
                  ) : project.images && project.images.length > 0 ? (
                    <Image src={project.images[0]} alt={project.name} fill sizes="85vw" className="object-cover" />
                  ) : (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black to-white/5 p-6 text-center">
                        <span className="text-white/40 font-bold text-3xl uppercase tracking-widest drop-shadow-md">{project.name}</span>
                        <span className="text-white/20 font-light text-xs uppercase tracking-[0.3em] mt-3">PREVIEW</span>
                     </div>
                  )}

                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-10" />

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-6 z-10 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] tracking-widest text-white uppercase px-2 py-1 rounded border border-white/20 bg-white/10 backdrop-blur-md">
                        {project.category}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{project.name}</h3>
                    <p className="text-white/70 text-xs font-light line-clamp-2">{project.description}</p>
                  </div>
                  
                  {/* Counter */}
                  <div className="absolute top-4 right-4 z-10 text-white/50 text-[10px] font-bold tracking-widest px-2 py-1 bg-black/40 backdrop-blur-md rounded border border-white/10">
                    {numStr} / {totalStr}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
