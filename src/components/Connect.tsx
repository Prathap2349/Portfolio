"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";
import { Code2 } from "lucide-react";

export default function Connect() {
  const containerRef = useRef<HTMLDivElement>(null);

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
            toggleActions: "play none none reverse",
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
      className="py-20 bg-background relative border-t border-white/5"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-[8vw] text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter text-primary-text mb-16 connect-item leading-none">
          LET'S BUILD <br />
          <span className="text-secondary-text/80 font-light italic">SOMETHING</span> <br />
          INTERESTING.
        </h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-16 connect-item mb-32">
          {((profile.social as any).email) && (
            <a 
              href={`mailto:${(profile.social as any).email}`}
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

          {profile.social.leetcode && (
            <a 
              href={profile.social.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-secondary-text hover:text-accent-cyan transition-colors group relative"
            >
              <span className="tracking-widest text-sm font-medium">LEETCODE</span>
              <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-accent-cyan transition-all duration-300 group-hover:w-full group-hover:left-0 opacity-0 group-hover:opacity-100" />
            </a>
          )}
        </div>
      </div>
      
      <footer className="border-t border-white/5 py-8 mt-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-[8vw] flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest text-secondary-text/60 uppercase">
          <div>{profile.name} • {profile.focus[0]}</div>
          <div>&copy; 2024 {profile.name}</div>
        </div>
      </footer>
    </section>
  );
}
