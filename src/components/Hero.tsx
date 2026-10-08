"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { profile } from "@/data/profile";
import { scrollToSection } from "@/utils/scroll";
import NetworkBackground from "./NetworkBackground";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [showReal, setShowReal] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: "power2.inOut" });

      gsap.fromTo(
        ".hero-title-word",
        { yPercent: 100 },
        { yPercent: 0, duration: 1.2, stagger: 0.1, ease: "power4.out", delay: 0.2 }
      );

      gsap.fromTo(
        ".hero-text-elem",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power2.out", delay: 0.8 }
      );

      gsap.fromTo(
        ".hero-scroll-indicator",
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 2, ease: "power2.out" }
      );

      gsap.to(".scroll-line-horizontal", {
        x: 40,
        opacity: 0.5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      const handleMouseMove = (e: MouseEvent) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (window.innerWidth < 1024) return;
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 2;
        const yPos = (clientY / window.innerHeight - 0.5) * 2;
        gsap.to(textRef.current, { x: xPos * 4, y: yPos * 4, duration: 1.2, ease: "power3" });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="hero"
      ref={containerRef} 
      className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background Layer */}
      <div ref={bgRef} className="absolute inset-0 opacity-0" aria-hidden="true">
        <div className="absolute inset-0 bg-background" />
        <NetworkBackground />
        <div className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] bg-accent-cyan/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-background)_100%)] z-0" />
      </div>

      {/* Image Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        {/* Anime Image */}
        <div 
          className="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out"
          style={{ 
            opacity: showReal ? 0 : 1,
            transform: showReal ? "scale(1.05) translateX(-2%)" : "scale(1) translateX(0)",
            filter: showReal ? "blur(10px)" : "blur(0px)"
          }}
        >
          <Image
            src="/images/hero-anime.jpg"
            alt="Cinematic developer anime scene"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right md:object-right"
          />
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-background via-background/80 to-transparent w-full md:w-3/5" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-transparent to-transparent h-1/3" />
        </div>

        {/* Real Image */}
        <div 
          className="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out"
          style={{ 
            opacity: showReal ? 1 : 0,
            transform: showReal ? "scale(1) translateX(0)" : "scale(1.05) translateX(2%)",
            filter: showReal ? "blur(0px)" : "blur(10px)",
            pointerEvents: showReal ? "auto" : "none"
          }}
        >
          <Image
            src="/images/original.png"
            alt="Portrait of Prathap"
            fill
            priority={false}
            sizes="100vw"
            className="object-cover object-right md:object-right saturate-[1.1] contrast-[1.05]"
          />
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-background via-background/80 to-transparent w-full md:w-3/5" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-transparent to-transparent h-1/3" />
        </div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-6 lg:px-[8vw] relative z-10 w-full h-[100svh] flex flex-col justify-center">
        
        {/* Text Content */}
        <div ref={textRef} className="relative z-10 w-full lg:w-3/5 flex flex-col justify-center h-full pt-[45svh] lg:pt-0 lg:-mt-10 pointer-events-none">
          
          <div className="relative z-10">
            <div className="inline-flex flex-wrap items-center gap-3 mb-6 hero-text-elem">
              <span className="text-accent-cyan font-semibold tracking-[0.25em] text-[10px] md:text-xs drop-shadow-[0_0_8px_rgba(111,231,255,0.3)]">
                AI &amp; DATA SCIENCE STUDENT / WEB DEVELOPER
              </span>
              <span className="px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-[10px] tracking-widest uppercase flex items-center gap-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                AVAILABLE FOR INTERNSHIPS
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[7vw] leading-[0.9] font-bold tracking-tight text-primary-text mb-6 flex flex-wrap gap-x-4 overflow-hidden drop-shadow-2xl" style={{ letterSpacing: "-0.02em" }}>
              {profile.name.toUpperCase().split(" ").map((word, i) => (
                <div key={i} className="overflow-hidden">
                  <span className="hero-title-word inline-block">{word}</span>
                </div>
              ))}
            </h1>
            
            <div className="mb-10 text-primary-text/90 text-lg md:text-xl font-light tracking-wide hero-text-elem drop-shadow-lg max-w-lg leading-relaxed">
              <p>{profile.intro}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 hero-text-elem pointer-events-auto">
              <a 
                href="#projects" data-cursor-text="EXPLORE"
                onClick={(e) => { e.preventDefault(); scrollToSection("#projects", -50); }}
                className="group bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors flex items-center gap-2"
              >
                EXPLORE MY WORK
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <a 
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-primary-text px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors"
              >
                DOWNLOAD RESUME
              </a>
              <a 
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection("#contact"); }}
                className="text-secondary-text hover:text-accent-cyan px-4 py-3 text-xs font-semibold tracking-widest uppercase transition-colors"
              >
                LET&apos;S TALK
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toggle Button */}
      <div className="absolute bottom-6 right-6 lg:bottom-12 lg:right-12 z-20 hero-scroll-indicator">
        <button
          onClick={() => setShowReal(!showReal)}
          className="flex items-center gap-2 bg-background/80 hover:bg-background border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-semibold tracking-widest text-primary-text uppercase transition-colors focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none"
          aria-label={showReal ? "Switch to anime view" : "Switch to real photo view"}
        >
          <span className="w-2 h-2 rounded-full bg-accent-cyan"></span>
          {showReal ? "ANIME VIEW" : "REAL ME"}
        </button>
      </div>

      <div className="hero-scroll-indicator absolute bottom-12 left-[8vw] z-20 flex items-center gap-4 rotate-90 origin-left hidden md:flex">
        <span className="text-[10px] tracking-[0.3em] font-medium text-secondary-text">SCROLL</span>
        <div className="w-16 h-[2px] bg-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1/3 bg-accent-cyan scroll-line-horizontal" />
        </div>
      </div>
    </section>
  );
}
