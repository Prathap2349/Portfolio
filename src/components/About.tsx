"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Very subtle reveal for the about section
      gsap.fromTo(
        ".about-reveal",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
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
      className="py-24 md:py-32 scroll-mt-[100px] bg-background relative overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-[8vw] z-10 relative w-full">
        <h2 className="text-accent-cyan font-semibold tracking-[0.25em] text-xs mb-16 uppercase about-reveal flex items-center gap-4">
          <span className="w-8 h-[1px] bg-accent-cyan/50 inline-block"></span>
          ABOUT ME
        </h2>

        <div ref={textRef} className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          <div className="lg:w-2/3">
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary-text leading-tight about-reveal" style={{ letterSpacing: "-0.02em" }}>
              AI & Data Science student building software, exploring AI, web development and automation.
            </h3>
            
            <p className="mt-12 text-secondary-text text-xl leading-relaxed max-w-2xl about-reveal font-light">
              My focus lies at the intersection of modern software development and artificial intelligence. I enjoy exploring how data and AI can be integrated into functional, well-designed web applications.
            </p>
          </div>

          <div className="lg:w-1/3 flex flex-col gap-10 about-reveal pt-4 border-t border-white/5 lg:border-t-0 lg:border-l lg:pl-12 lg:pt-0">
            <div>
              <h4 className="text-[10px] tracking-[0.2em] text-secondary-text/50 mb-3 uppercase">STUDYING</h4>
              <p className="text-primary-text tracking-wide text-sm font-medium">{profile.education}</p>
            </div>
            
            <div>
              <h4 className="text-[10px] tracking-[0.2em] text-secondary-text/50 mb-3 uppercase">FOCUS</h4>
              <p className="text-primary-text tracking-wide text-sm font-medium leading-relaxed">
                {profile.focus.join(" • ")}
              </p>
            </div>
            
            <div>
              <h4 className="text-[10px] tracking-[0.2em] text-secondary-text/50 mb-3 uppercase">CURRENTLY</h4>
              <p className="text-primary-text tracking-wide text-sm font-medium">BUILDING & LEARNING</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
