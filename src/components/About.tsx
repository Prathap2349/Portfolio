"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";

gsap.registerPlugin(ScrollTrigger);

const StatCard = ({ title, value, suffix = "" }: { title: string, value: number, suffix?: string }) => {
  const numRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        gsap.fromTo(el, { innerHTML: 0 }, {
          innerHTML: value,
          duration: 2,
          ease: "power2.out",
          snap: { innerHTML: 1 },
          onUpdate: function() {
            if (el) el.innerHTML = Math.round(Number(this.targets()[0].innerHTML)) + suffix;
          }
        });
      },
      once: true
    });
  }, [value, suffix]);

  return (
    <div className="flex flex-col border border-white/5 bg-white/5 p-6 rounded-2xl">
      <div ref={numRef} className="text-4xl md:text-5xl font-bold text-accent-cyan mb-2">0</div>
      <div className="text-xs tracking-widest text-secondary-text uppercase">{title}</div>
    </div>
  );
};

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in text elements
      gsap.fromTo(".about-text", 
        { y: 30, opacity: 0 },
        { 
          y: 0, opacity: 1, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
          }
        }
      );

      // Timeline line draw
      gsap.fromTo(".timeline-line", 
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 80%",
            end: "bottom 80%",
            scrub: true,
          }
        }
      );

      // Timeline items fade
      gsap.fromTo(".timeline-item",
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".timeline-container",
            start: "top 75%",
          }
        }
      );

      // What I Do Cards
      gsap.fromTo(".what-i-do-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".what-i-do-container",
            start: "top 80%",
          }
        }
      );

      // Marquee animation
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -50,
          ease: "none",
          duration: 20,
          repeat: -1
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-6 lg:px-[8vw]">
        
        {/* Header */}
        <div className="mb-16 about-text flex items-center gap-4">
          <h2 className="text-sm font-semibold tracking-[0.3em] text-accent-cyan uppercase">About Me</h2>
          <div className="h-[1px] bg-white/10 flex-grow" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column: Story */}
          <div ref={textRef} className="space-y-6">
            <h3 className="text-3xl md:text-5xl font-bold text-primary-text leading-tight tracking-tight about-text">
              Bridging the gap between <span className="text-accent-warm">data</span> and <span className="text-accent-cyan">design.</span>
            </h3>
            
            <div className="text-secondary-text text-base md:text-lg space-y-4 font-light leading-relaxed about-text">
              <p>
                Hi, I&apos;m Prathap. I am an AI &amp; Data Science student who is deeply passionate about crafting intelligent, high-performance web applications. My journey started with a curiosity for how algorithms work and evolved into building full-stack products that users love.
              </p>
              <p>
                I thrive at the intersection of machine learning and modern front-end engineering. Whether I&apos;m designing a sleek UI with Next.js and Tailwind, or training models to analyze data, my goal is always the same: solving complex problems elegantly.
              </p>
            </div>
            
            <div className="pt-6 about-text">
              <a 
                href={profile.social.resume} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 text-primary-text border border-white/10 px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 group"
              >
                Download Resume
                <span className="transform transition-transform group-hover:translate-y-1">↓</span>
              </a>
            </div>
          </div>

          {/* Right Column: Stats & Timeline */}
          <div className="space-y-16">
            
            <div className="timeline-container relative pl-6 border-l border-white/5">
              <div className="absolute top-0 left-[-1px] w-[2px] bg-accent-cyan timeline-line origin-top" />
              
              <div className="space-y-8">
                {profile.timeline.map((item, i) => (
                  <div key={i} className="timeline-item relative">
                    <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full bg-background border-2 border-accent-cyan" />
                    <div className="text-xs font-bold text-accent-cyan tracking-widest mb-1">{item.year}</div>
                    <div className="text-lg font-semibold text-primary-text mb-2">{item.title}</div>
                    <div className="text-sm text-secondary-text font-light leading-relaxed">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* What I Do */}
        <div className="mt-32 what-i-do-container">
          <div className="mb-12 about-text flex items-center gap-4">
            <h2 className="text-sm font-semibold tracking-[0.3em] text-accent-cyan uppercase">What I Do</h2>
            <div className="h-[1px] bg-white/10 w-24" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="what-i-do-card bg-white/5 border border-white/5 p-8 rounded-2xl hover:bg-white/10 transition-colors duration-300">
              <div className="w-12 h-12 bg-accent-cyan/10 rounded-xl flex items-center justify-center text-accent-cyan mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2 2 2 0 0 1 2-2h8a2 2 0 0 1 2 2 2 2 0 0 1-2 2H9z"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/></svg>
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-3">Front-End Dev</h3>
              <p className="text-secondary-text text-sm font-light leading-relaxed">Building responsive, accessible, and highly interactive user interfaces using React, Next.js, and GSAP.</p>
            </div>
            
            <div className="what-i-do-card bg-white/5 border border-white/5 p-8 rounded-2xl hover:bg-white/10 transition-colors duration-300">
              <div className="w-12 h-12 bg-accent-warm/10 rounded-xl flex items-center justify-center text-accent-warm mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-3">AI & ML</h3>
              <p className="text-secondary-text text-sm font-light leading-relaxed">Training models, utilizing APIs, and integrating intelligent agentic workflows into modern web applications.</p>
            </div>
            
            <div className="what-i-do-card bg-white/5 border border-white/5 p-8 rounded-2xl hover:bg-white/10 transition-colors duration-300">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <h3 className="text-xl font-bold text-primary-text mb-3">Data Science</h3>
              <p className="text-secondary-text text-sm font-light leading-relaxed">Analyzing datasets, creating insightful visualizations, and deriving actionable metrics from raw data.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Marquee */}
      <div className="mt-32 w-full overflow-hidden border-y border-white/5 py-4 bg-white/[0.02]">
        <div className="flex whitespace-nowrap w-[200%]" ref={marqueeRef}>
          {[...profile.currentlyLearning, ...profile.currentlyLearning, ...profile.currentlyLearning].map((item, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-8 text-xs font-semibold tracking-widest text-secondary-text uppercase">{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan/30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
