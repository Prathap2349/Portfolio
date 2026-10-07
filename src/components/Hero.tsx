"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { profile } from "@/data/profile";
import InteractiveImageReveal from "./InteractiveImageReveal";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const mobilePortraitRef = useRef<HTMLDivElement>(null);
  const [showRealMobile, setShowRealMobile] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animation
      const tl = gsap.timeline();

      // Set initial states to avoid flash
      gsap.set(bgRef.current, { opacity: 0 });
      gsap.set(portraitRef.current, { opacity: 0, x: 20, scale: 1.02 });
      gsap.set(mobilePortraitRef.current, { opacity: 0, y: 20, scale: 1.02 });
      gsap.set(".hero-text-elem", { opacity: 0, y: 15 });
      gsap.set(".hero-scroll-indicator", { opacity: 0 });

      // 1-4. Text elements fade in sequentially
      tl.to(bgRef.current, { opacity: 1, duration: 1.2, ease: "power2.inOut" })
        .to(".hero-text-elem", { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }, "-=0.6")
        // 5. Hero image settles into position
        .to([portraitRef.current, mobilePortraitRef.current], { opacity: 1, x: 0, y: 0, scale: 1, duration: 1.4, ease: "power3.out" }, "-=0.8")
        .to(".hero-scroll-indicator", { opacity: 1, duration: 1, ease: "power2.out" }, "-=0.4");

      // Scroll Indicator animation
      gsap.to(".scroll-line-horizontal", {
        x: 40,
        opacity: 0.5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Cinematic Parallax Effect (Desktop only)
      let textXTo = gsap.quickTo(textRef.current, "x", { duration: 1.2, ease: "power3" });
      let textYTo = gsap.quickTo(textRef.current, "y", { duration: 1.2, ease: "power3" });

      const handleMouseMove = (e: MouseEvent) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (window.innerWidth < 1024) return;

        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const yPos = (clientY / window.innerHeight - 0.5) * 2; // -1 to 1
        
        textXTo(xPos * 4);
        textYTo(yPos * 4);
      };

      window.addEventListener("mousemove", handleMouseMove);
      
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="hero"
      ref={containerRef} 
      className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Cinematic Background Lighting Layers */}
      <div 
        ref={bgRef}
        className="absolute inset-0 opacity-0"
        aria-hidden="true"
      >
        {/* Base dark ambient */}
        <div className="absolute inset-0 bg-background" />
        
        {/* Soft cyan glow matching artwork */}
        <div className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] bg-accent-cyan/5 rounded-full blur-[120px] mix-blend-screen" />
        
        {/* Soft warm orange ambient light */}
        <div className="absolute bottom-0 right-1/3 w-[30vw] h-[30vw] bg-accent-warm/5 rounded-full blur-[100px] mix-blend-screen" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-background)_100%)] z-0" />
      </div>

      <div className="container mx-auto px-6 lg:px-[8vw] relative z-10 w-full h-[100svh] flex flex-col justify-center">
        
        {/* Mobile Portrait (shows first on mobile, now with tap interaction) */}
        <div 
          ref={mobilePortraitRef}
          className="lg:hidden absolute top-0 left-0 w-full h-[60svh] cursor-pointer"
          onClick={() => setShowRealMobile(!showRealMobile)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowRealMobile(!showRealMobile);
            }
          }}
          aria-label={showRealMobile ? "Show illustrated version" : "Show real photo"}
          role="button"
          tabIndex={0}
        >
          <div className="relative w-full h-full opacity-90 transition-all duration-500">
            <Image
              src={showRealMobile ? "/images/original.png" : "/images/anime.png"}
              alt={showRealMobile ? "Real portrait of Prathap" : "Anime portrait of Prathap"}
              fill
              priority
              sizes="100vw"
              className="object-contain object-top pt-20 transition-opacity duration-300"
              style={{ maskImage: "linear-gradient(to bottom, black 50%, transparent 95%)", WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 95%)" }}
            />
            {/* Subtle visual hint that it's interactive */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur text-[9px] tracking-widest px-2 py-1 rounded border border-white/10 text-white/70">
              TAP TO REVEAL
            </div>
          </div>
        </div>

        {/* Text Content - Positioned naturally in the scene */}
        <div 
          ref={textRef} 
          className="relative z-10 w-full lg:w-3/5 flex flex-col justify-center h-full pt-[45svh] lg:pt-0 lg:-mt-10 pointer-events-none"
        >
          {/* Subtle gradient scrim behind text for readability against complex artwork */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent -ml-6 md:-ml-12 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-accent-cyan font-semibold tracking-[0.25em] text-[10px] md:text-xs mb-5 hero-text-elem drop-shadow-[0_0_8px_rgba(111,231,255,0.3)]">
              {profile.role.toUpperCase()}
            </h2>
            
            <h1 className="text-6xl md:text-7xl lg:text-[7vw] leading-[0.9] font-bold tracking-tight text-primary-text mb-8 hero-text-elem drop-shadow-2xl" style={{ letterSpacing: "-0.02em" }}>
              {profile.name.toUpperCase()}
            </h1>
            
            <div className="space-y-1 mb-8 text-primary-text/90 text-lg md:text-2xl font-light tracking-wide hero-text-elem drop-shadow-lg">
              <p>AI & DATA SCIENCE STUDENT.</p>
              <p>ENGINEERING INTELLIGENT SYSTEMS.</p>
            </div>
            
            <p className="text-xs md:text-sm tracking-[0.15em] font-medium text-secondary-text/80 hero-text-elem uppercase">
              {profile.focus.join(" • ")}
            </p>
          </div>
        </div>

        {/* Desktop Portrait - Blended naturally with interactive reveal */}
        <div 
          ref={portraitRef} 
          className="hidden lg:block absolute inset-0 w-full h-full z-0"
          aria-hidden="true"
        >
          <InteractiveImageReveal />
        </div>
      </div>

      {/* Scroll Indicator (Left) */}
      <div className="absolute bottom-12 left-[8vw] z-20 flex items-center gap-4 rotate-90 origin-left">
        <span className="text-[10px] tracking-[0.3em] font-medium text-secondary-text">SCROLL</span>
        <div className="w-16 h-[2px] bg-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1/3 bg-accent-cyan scroll-line-horizontal" />
        </div>
      </div>

      {/* Explore Button (Right) */}
      <a 
        href="#projects"
        className="absolute bottom-12 right-[8vw] z-20 flex items-center gap-4 border border-white/10 rounded-full px-6 py-3 hover:border-accent-cyan/50 hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-2 h-2 rounded-full bg-accent-cyan" />
        <span className="text-[10px] tracking-[0.2em] font-semibold text-primary-text">EXPLORE MY WORK</span>
        <span className="text-secondary-text ml-2">→</span>
      </a>
    </section>
  );
}
