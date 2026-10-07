"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";

export default function Connect() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".connect-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
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
      id="contact" 
      ref={containerRef}
      className="py-24 md:py-32 min-h-[80svh] bg-background relative border-t border-white/5 flex flex-col justify-between"
    >
      <div className="container mx-auto w-full px-6 md:px-12 lg:px-[8vw] text-center flex flex-col items-center flex-grow justify-center">
        <div className="connect-item mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan text-xs font-semibold tracking-widest uppercase">
           <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></span>
           {profile.internshipStatus}
        </div>
        
        <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter text-primary-text mb-16 connect-item leading-none">
          LET'S BUILD <br />
          <span className="text-secondary-text/80 font-light italic">SOMETHING</span> <br />
          USEFUL.
        </h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 connect-item mb-20 flex-wrap">
          {profile.social.email && (
            <a 
              href={`mailto:${profile.social.email}`}
              className="flex items-center gap-3 text-secondary-text hover:text-accent-cyan transition-colors group relative"
            >
              <span className="tracking-widest text-sm font-medium">EMAIL</span>
              <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-accent-cyan transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100" />
            </a>
          )}

          <a 
            href={profile.github.primary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-secondary-text hover:text-accent-cyan transition-colors group relative"
          >
            <span className="tracking-widest text-sm font-medium">GITHUB</span>
            <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-accent-cyan transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100" />
          </a>

          {profile.social.linkedin && (
            <a 
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-secondary-text hover:text-accent-cyan transition-colors group relative"
            >
              <span className="tracking-widest text-sm font-medium">LINKEDIN</span>
              <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-accent-cyan transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100" />
            </a>
          )}
          
          {profile.social.resume && (
            <a 
              href={profile.social.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-secondary-text hover:text-accent-cyan transition-colors group relative"
            >
              <span className="tracking-widest text-sm font-medium">RESUME</span>
              <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-accent-cyan transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100" />
            </a>
          )}
        </div>
      </div>
      
      <footer className="border-t border-white/5 py-8 mt-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-[8vw] flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest text-secondary-text/60 uppercase">
          <div>{profile.name} • {profile.focus[0]}</div>
          <div>{currentYear}</div>
        </div>
      </footer>
    </section>
  );
}
