"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";

// Focus card with performant CSS transitions instead of continuous JS mousemove tilt
function FocusCard({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div 
      className="what-i-do-card group relative bg-white/[0.02] border border-white/5 p-8 rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-500/30 hover:bg-white/[0.04] hover:-translate-y-1 shadow-lg"
    >
      <div className="relative z-10">
        <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-105 group-hover:border-amber-500/40 group-hover:text-amber-500 transition-all duration-300 shadow-xl">
          {icon}
        </div>
        <h4 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-amber-500 transition-colors">{title}</h4>
        <p className="text-secondary-text text-sm font-light leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Story text fade up with controlled stagger
      gsap.fromTo(".about-text",
        { opacity: 0, y: 24 },
        {
          opacity: 1, 
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          }
        }
      );

      // Progressive timeline-line scrubbed drawing
      gsap.fromTo(timelineLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 70%",
            end: "bottom 70%",
            scrub: 0.5,
          }
        }
      );

      // Scoped milestone entrance stagger
      gsap.fromTo(".timeline-item",
        { opacity: 0, x: -16 },
        {
          opacity: 1, 
          x: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 75%",
            once: true,
          }
        }
      );

      // What I Do Cards entrance
      gsap.fromTo(".what-i-do-card",
        { opacity: 0, y: 24 },
        {
          opacity: 1, 
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".what-i-do-container",
            start: "top 80%",
            once: true,
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-32 relative overflow-hidden bg-background">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[#FFB86B]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-[8vw] relative z-10">
        
        {/* Header */}
        <div className="mb-24 about-text flex items-center gap-4">
          <h2 className="text-[10px] font-semibold tracking-[0.4em] text-amber-500 uppercase">01 / About Me</h2>
          <div className="h-[1px] bg-gradient-to-r from-amber-500/50 to-transparent flex-grow max-w-[200px]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
          {/* Left Column: Story */}
          <div ref={textRef} className="space-y-8">
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight about-text">
              Bridging the gap between <span className="font-serif italic text-[#FFB86B] font-medium pr-1">data</span> and <span className="text-amber-500">design.</span>
            </h3>
            
            <div className="text-secondary-text text-lg space-y-6 font-light leading-relaxed about-text max-w-xl">
              <p>
                My journey started with a curiosity for how algorithms work and evolved into building full-stack products that users actually love to interact with.
              </p>
              <p>
                I thrive at the intersection of machine learning and modern front-end engineering. Whether I&apos;m designing a sleek UI with Next.js, or training models to analyze complex datasets, my goal is always the same: <span className="text-white">building something <span className="font-serif italic text-[#FFB86B] pr-1">useful</span> that solves a real problem.</span>
              </p>
              <p className="italic text-sm text-secondary-text/70 pt-2 border-t border-white/5">
                &quot;I build because I believe technology should feel like magic.&quot;
              </p>
            </div>
            
            <div className="pt-8 about-text">
              <a 
                href={profile.social.resume} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-amber-500 outline-none"
              >
                Download Resume
                <span className="transform transition-transform group-hover:translate-y-1">↓</span>
              </a>
            </div>
          </div>

          {/* Right Column: Timeline */}
          <div className="space-y-16 pt-4 lg:pt-0">
            <div className="timeline-container relative pl-8 border-l border-white/10">
              <div ref={timelineLineRef} className="absolute top-0 left-[-1px] w-[2px] h-full bg-gradient-to-b from-amber-500 via-[#FFB86B] to-transparent origin-top" />
              
              <div className="space-y-12">
                {profile.timeline.map((item, i) => {
                  const isCurrentMilestone = item.year === "2026" || i === profile.timeline.length - 1;
                  return (
                    <div key={i} className="timeline-item relative group">
                      <div 
                        className={`absolute top-1.5 rounded-full transition-all duration-300 ${
                          isCurrentMilestone 
                            ? "-left-[38px] w-3 h-3 bg-amber-500 border-2 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.8)]" 
                            : "-left-[37px] w-2.5 h-2.5 bg-background border-2 border-white/50 group-hover:border-[#FFB86B] group-hover:scale-125"
                        }`} 
                      />
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${isCurrentMilestone ? "text-amber-500" : "text-[#FFB86B]"}`}>
                          {item.year}
                        </span>
                        {isCurrentMilestone && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-semibold tracking-wider uppercase">
                            CURRENT MILESTONE
                          </span>
                        )}
                      </div>
                      <div className={`text-xl font-bold mb-2 ${isCurrentMilestone ? "text-amber-400" : "text-white"}`}>{item.title}</div>
                      <div className="text-sm text-secondary-text font-light leading-relaxed max-w-sm">{item.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* What I Do */}
        <div className="mt-48 what-i-do-container">
          <div className="mb-16 about-text flex items-center gap-4">
            <h3 className="text-[10px] font-semibold tracking-[0.4em] text-amber-500 uppercase">What I Do</h3>
            <div className="h-[1px] bg-gradient-to-r from-amber-500/50 to-transparent w-32" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FocusCard 
              title="Front-End Eng" 
              desc="Building responsive, accessible, and highly interactive user interfaces using React, Next.js, and GSAP."
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2 2 2 0 0 1 2-2h8a2 2 0 0 1 2 2 2 2 0 0 1-2 2H9z"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/></svg>}
            />
            
            <FocusCard 
              title="AI & ML" 
              desc="Training models, utilizing APIs, and integrating intelligent agentic workflows into modern web applications."
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
            />
            
            <FocusCard 
              title="Data Science" 
              desc="Analyzing datasets, creating insightful visualizations, and deriving actionable metrics from raw data."
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>}
            />
          </div>
        </div>

      </div>

      {/* Currently Learning / Focus Areas */}
      <div className="mt-32 w-full border-y border-white/5 py-6 bg-black/40 backdrop-blur-md relative z-10">
        <div className="container mx-auto px-6 lg:px-[8vw] flex flex-wrap items-center justify-between gap-4">
          <span className="text-[10px] font-bold tracking-[0.25em] text-amber-500 uppercase">
            CURRENTLY LEARNING & EXPLORING
          </span>
          <div className="flex flex-wrap items-center gap-6">
            {profile.currentlyLearning.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-medium tracking-wider text-secondary-text uppercase">{item}</span>
                {i < profile.currentlyLearning.length - 1 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
