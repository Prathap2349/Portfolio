"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Very subtle reveal for the about section
      gsap.fromTo(
        ".about-reveal",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
            once: true
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="py-24 md:py-32 bg-background relative overflow-hidden border-t border-white/5"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-[8vw] z-10 relative w-full">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          <div className="lg:w-2/3">
            <h2 className="text-accent-cyan font-semibold tracking-[0.25em] text-xs mb-10 uppercase about-reveal flex items-center gap-4">
              <span className="w-8 h-[1px] bg-accent-cyan/50 inline-block"></span>
              ABOUT ME
            </h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary-text leading-tight about-reveal mb-8" style={{ letterSpacing: "-0.02em" }}>
              {profile.intro}
            </h3>
            
            <div className="space-y-6 text-secondary-text text-lg leading-relaxed max-w-2xl about-reveal font-light">
              <p>
                I'm Prathap, an AI & Data Science student with a passion for software engineering. I enjoy taking complex problems and building robust, well-designed solutions that work in the real world.
              </p>
              <p>
                Currently, I am heavily focused on developing applications that leverage artificial intelligence, computer vision, and modern web architectures. My goal is to secure an internship where I can contribute to impactful projects and learn from experienced engineers.
              </p>
            </div>
            
            <div className="mt-12 about-reveal inline-block">
               <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan text-xs font-semibold tracking-widest uppercase">
                  <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></span>
                  {profile.internshipStatus}
               </span>
            </div>
          </div>

          <div className="lg:w-1/3 w-full flex flex-col gap-10 about-reveal pt-4 border-t border-white/5 lg:border-t-0 lg:border-l lg:pl-12 lg:pt-0">
            <div>
              <h4 className="text-[10px] tracking-[0.2em] text-secondary-text/50 mb-3 uppercase">EDUCATION</h4>
              <p className="text-primary-text tracking-wide text-sm font-medium">{profile.education}</p>
            </div>
            
            <div>
              <h4 className="text-[10px] tracking-[0.2em] text-secondary-text/50 mb-3 uppercase">FOCUS</h4>
              <p className="text-primary-text tracking-wide text-sm font-medium leading-relaxed">
                {profile.focus.join(" • ")}
              </p>
            </div>
            
            <div>
              <h4 className="text-[10px] tracking-[0.2em] text-secondary-text/50 mb-3 uppercase">ACTIVITY</h4>
              <p className="text-primary-text tracking-wide text-sm font-medium">
                Building {projects.length} verified projects
              </p>
            </div>
            
            <div>
              <h4 className="text-[10px] tracking-[0.2em] text-secondary-text/50 mb-3 uppercase">LOCATION</h4>
              <p className="text-primary-text tracking-wide text-sm font-medium">{profile.location}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
