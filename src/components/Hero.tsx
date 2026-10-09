"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { profile } from "@/data/profile";
import { scrollToSection } from "@/utils/scroll";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-text-elem", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" }
      );
      
      gsap.fromTo(".hero-img-container",
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
        { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1.5, ease: "power3.inOut" }
      );
      
      gsap.fromTo(".hero-img", 
        { scale: 1.1, opacity: 0.5 }, 
        { scale: 1, opacity: 1, duration: 3, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="hero"
      ref={containerRef} 
      className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background & Image */}
      <div className="hero-img-container absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none" style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}>
        <div className="hero-img absolute inset-0 w-full h-full transform-gpu origin-center">
          <Image
            src="/images/original.webp"
            alt="Portrait of Prathap"
            fill
            priority
            sizes="100vw"
            className="object-cover object-right md:object-right opacity-80 mix-blend-luminosity"
          />
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-background via-background/80 to-transparent w-full md:w-3/5" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/50 to-transparent h-1/2" />
        </div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-6 lg:px-[8vw] relative z-10 w-full h-[100svh] flex flex-col justify-center">
        <div className="relative z-10 w-full lg:w-3/5 flex flex-col justify-center h-full pt-[45svh] lg:pt-0 lg:-mt-10">
          
          <div className="inline-flex flex-wrap items-center gap-3 mb-6 hero-text-elem">
            <span className="text-amber-500 font-semibold tracking-widest text-xs">
              {profile.role}
            </span>
            <span className="px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px] tracking-widest uppercase flex items-center gap-2 font-medium">
              AVAILABLE FOR INTERNSHIPS
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[7vw] leading-[0.9] font-bold tracking-tight text-primary-text mb-8 hero-text-elem text-left">
            {profile.name}
          </h1>
          
          <div className="mb-10 text-secondary-text text-lg md:text-xl font-light tracking-wide hero-text-elem max-w-lg leading-relaxed text-left">
            <p>{profile.intro}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 hero-text-elem">
            <a 
              href="#projects"
              onClick={(e) => { e.preventDefault(); scrollToSection("#projects", -50); }}
              className="bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 border border-amber-500/30 text-amber-500 px-6 py-3 text-xs font-semibold tracking-widest uppercase transition-all outline-none rounded"
            >
              Explore my work
            </a>
            <a 
              href="https://resume-gamma-bice.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-primary-text px-6 py-3 text-xs font-semibold tracking-widest uppercase transition-all outline-none rounded"
            >
              Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
