"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";

export default function Connect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

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
          duration: 0.8,
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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.social.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoLink = `mailto:${profile.social.email}?subject=Portfolio Inquiry — Prathap&body=Hi Prathap,%0D%0A%0D%0AI found your portfolio and would like to get in touch regarding...%0D%0A%0D%0AThanks,`;

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="py-32 md:py-48 bg-background relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(111,231,255,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto max-w-4xl px-6 md:px-12 relative z-10 text-center">
        <h2 data-scroll-anchor className="text-5xl md:text-7xl lg:text-[6vw] font-bold tracking-tight text-primary-text mb-8 leading-[0.9] connect-item">
          LET&apos;S BUILD<br/>
          <span className="text-accent-cyan">SOMETHING</span><br/>
          USEFUL.
        </h2>
        
        <p className="text-secondary-text text-lg md:text-xl font-light mb-16 max-w-2xl mx-auto leading-relaxed connect-item">
          Have an idea, opportunity, internship, or project you&apos;d like to discuss?
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-6 connect-item">
          <a 
            href={mailtoLink}
            className="group inline-flex items-center gap-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan px-8 py-4 rounded-full text-sm font-semibold tracking-widest uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
          >
            EMAIL ME <span className="inline-block transform transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          
          <button 
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-primary-text px-8 py-4 rounded-full text-sm font-semibold tracking-widest uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
          >
            {copied ? "COPIED!" : "COPY EMAIL"}
          </button>
        </div>

        <div className="mt-32 pt-12 border-t border-white/5 flex flex-wrap justify-center gap-8 md:gap-16 text-xs font-semibold tracking-widest uppercase text-secondary-text connect-item">
          <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-accent-cyan transition-colors">GitHub</a>
          <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent-cyan transition-colors">LinkedIn</a>
          <a href={profile.social.resume} target="_blank" rel="noopener noreferrer" className="hover:text-accent-cyan transition-colors">Resume</a>
        </div>
        
        <div className="mt-12 text-[10px] tracking-widest text-secondary-text/40 connect-item uppercase">
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </div>
      </div>
    </section>
  );
}
