"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { View } from "lucide-react";
import { Project } from "@/types";

export type JourneyProject = Project;

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
      const getScrollAmount = () => {
        if (!trackRef.current) return 0;
        const trackWidth = trackRef.current.scrollWidth;
        return -(trackWidth - window.innerWidth);
      };

      // Horizontal Scroll Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1, 
          end: () => `+=${trackRef.current ? trackRef.current.scrollWidth - window.innerWidth : 0}`,
          invalidateOnRefresh: true, // Fix for layout shifts
          anticipatePin: 1,
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
      tl.to(trackRef.current, {
        x: getScrollAmount,
        ease: "none",
        duration: 1
      });
      // Hold at end
      tl.to({}, { duration: 0.05 });

      // Parallax and clip-path reveal using containerAnimation
      sections.forEach((section) => {
        const image = section.querySelector(".parallax-image");
        
        if (image) {
          // Reveal animation
          gsap.fromTo(image, 
            { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)", scale: 1.1 }, 
            {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
              scale: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                containerAnimation: tl,
                start: "left 80%",
                end: "left 40%",
                scrub: 1,
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

        <div className="h-full flex flex-nowrap w-max" ref={trackRef}>
          {projects.map((project) => {
            const currentStageIndex = getStageIndex(project.status);
             
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
                            className="group inline-flex items-center gap-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan backdrop-blur-md"
                          >
                            EXPLORE <span className="inline-block transform transition-all duration-300 group-hover:translate-x-1 opacity-70 group-hover:opacity-100">→</span>
                          </Link>
                        ) : project.githubUrl ? (
                          <a 
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-white/30 backdrop-blur-md"
                          >
                            SOURCE CODE <span className="inline-block transform transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 opacity-70 group-hover:opacity-100">↗</span>
                          </a>
                        ) : project.liveUrl ? (
                          <a 
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-white/30 backdrop-blur-md"
                          >
                            VIEW LIVE <span className="inline-block transform transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 opacity-70 group-hover:opacity-100">↗</span>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Right: Media */}
                  <div 
                    className="col-span-7 h-[60vh] relative parallax-image"
                    style={{ transformStyle: "preserve-3d" }}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const centerX = rect.width / 2;
                      const centerY = rect.height / 2;
                      const rotateX = ((y - centerY) / centerY) * -5;
                      const rotateY = ((x - centerX) / centerX) * 5;
                      gsap.to(e.currentTarget, { rotateX, rotateY, duration: 0.5, ease: "power2.out", transformPerspective: 1000 });
                      
                      const innerMedia = e.currentTarget.querySelector('.media-content-wrapper');
                      if (innerMedia) {
                        gsap.to(innerMedia, { z: 40, duration: 0.5, ease: "power2.out" });
                      }
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
                      const innerMedia = e.currentTarget.querySelector('.media-content-wrapper');
                      if (innerMedia) {
                        gsap.to(innerMedia, { z: 0, duration: 0.5, ease: "power2.out" });
                      }
                    }}
                  >
                    <div className="w-full h-full media-content-wrapper relative" style={{ transformStyle: "preserve-3d" }}>
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

              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile/Reduced Motion Vertical List */}
      <div className="lg:hidden w-full bg-background py-16 px-6 relative">
        <h2 className="text-xs text-amber-500 font-semibold tracking-widest uppercase mb-12 flex items-center gap-4">
          03 / PROJECTS
          <span className="w-8 h-[1px] bg-amber-500/50 inline-block"></span>
        </h2>

        <div className="w-full flex flex-col gap-12">
          {projects.map((project, i) => {
             
            
            return (
              <div key={project.slug} className="w-full flex flex-col gap-4 relative group">
                <div className="relative z-10 w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black shadow-xl">
                  {project.problem ? (
                    <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-20">
                      <span className="sr-only">View {project.name}</span>
                    </Link>
                  ) : project.githubUrl || project.liveUrl ? (
                    <a href={project.liveUrl || project.githubUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20">
                      <span className="sr-only">View {project.name}</span>
                    </a>
                  ) : null}

                  {project.videoUrl ? (
                    <video src={project.videoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                  ) : project.mockupUrl ? (
                    <Image src={project.mockupUrl} alt={project.name} fill sizes="90vw" className="object-cover" />
                  ) : project.images && project.images.length > 0 ? (
                    <Image src={project.images[0]} alt={project.name} fill sizes="90vw" className="object-cover" />
                  ) : (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black to-white/5 p-6 text-center">
                        <span className="text-white/40 font-bold text-2xl uppercase tracking-widest drop-shadow-md">{project.name}</span>
                        <span className="text-white/20 font-light text-xs uppercase tracking-[0.3em] mt-3">PREVIEW</span>
                     </div>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm pointer-events-none z-10">
                    <span className="px-6 py-3 rounded border border-white/20 bg-white/10 text-white text-xs tracking-widest uppercase font-semibold">
                       {project.problem ? "Read Case Study" : project.liveUrl ? "View Live" : "Source Code"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 relative z-10">
                  <div className="text-white/40 text-[10px] font-mono tracking-widest">{(i + 1).toString().padStart(2, '0')} / {totalStr} — {project.year}</div>
                  <h3 className="text-xl font-bold text-white tracking-wide">{project.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {project.technologies.slice(0, 3).map(tech => (
                      <span key={tech} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-secondary-text uppercase tracking-wider">{tech}</span>
                    ))}
                  </div>
                  <p className="text-secondary-text text-sm leading-relaxed mt-2">{project.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
