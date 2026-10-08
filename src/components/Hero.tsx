"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";
import { scrollToSection } from "@/utils/scroll";
import NetworkBackground from "./NetworkBackground";

// A simple scramble text effect component
function ScrambleText({ text, play }: { text: string; play: boolean }) {
  const [displayText, setDisplayText] = useState("");
  const chars = "!<>-_\\\\/[]{}—=+*^?#________";

  useEffect(() => {
    if (!play) return;
    let iteration = 0;
    let animationFrame: number;
    
    const animate = () => {
      setDisplayText((current) => 
        text.split("").map((letter, index) => {
          if (index < iteration) {
            return text[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );

      if (iteration >= text.length) {
        cancelAnimationFrame(animationFrame);
        return;
      }

      iteration += 1 / 3;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [text, play]);

  return <span>{play ? displayText : ""}</span>;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [bootText, setBootText] = useState<string[]>([]);

  // Preloader Logic
  useEffect(() => {
    const sequence = [
      "INIT SYSTEM...",
      "LOADING NEURAL WEIGHTS [████████--] 80%",
      "CONNECTING TO GITHUB API...",
      "RESOLVING DEPENDENCIES...",
      "SYSTEM READY."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setBootText(prev => [...prev, sequence[i]]);
      i++;
      if (i === sequence.length) {
        clearInterval(interval);
        setTimeout(() => setIsLoaded(true), 600);
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Intro animations
      gsap.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: "power2.inOut" });

      // Stagger letters instead of words for a cooler effect
      gsap.fromTo(
        ".hero-title-letter",
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, stagger: 0.05, ease: "back.out(1.7)", delay: 0.2 }
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

      // SCROLL ANIMATION (Anime to Real)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%", 
          scrub: 0.5, 
          pin: true, 
          anticipatePin: 1,
        }
      });

      // Images transition
      tl.to(".hero-anime-img", {
        opacity: 0,
        scale: 1.05,
        filter: "blur(10px)",
        x: "-2%",
        ease: "none"
      }, 0);

      tl.fromTo(".hero-real-img", {
        opacity: 0,
        scale: 1.05,
        filter: "blur(10px)",
        x: "2%",
      }, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        x: "0%",
        ease: "none"
      }, 0);

      // Text Transition: "IMAGINED." -> "BUILT."
      tl.to(".text-imagined", { opacity: 0, y: -20, ease: "power1.inOut" }, 0);
      tl.fromTo(".text-built", { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: "power1.inOut" }, 0.2);

      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  // Preloader Overlay
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-background z-[200] flex flex-col justify-end p-8 md:p-16 font-mono text-[10px] md:text-xs text-accent-cyan/80 uppercase tracking-widest leading-relaxed">
        <div className="max-w-xl flex flex-col gap-2">
          {bootText.map((text, i) => (
             <div key={i} className="animate-fade-in">{text}</div>
          ))}
          <div className="w-3 h-4 bg-accent-cyan animate-pulse mt-2" />
        </div>
      </div>
    );
  }

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
        <div className="hero-anime-img absolute inset-0 w-full h-full transform-gpu">
          <Image
            src="/images/hero-anime.webp"
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
        <div className="hero-real-img absolute inset-0 w-full h-full transform-gpu">
          <Image
            src="/images/original.webp"
            alt="Portrait of Prathap"
            fill
            priority
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
                <ScrambleText text="AI & DATA SCIENCE STUDENT / WEB DEVELOPER" play={isLoaded} />
              </span>
              <span className="px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-[10px] tracking-widest uppercase flex items-center gap-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
                AVAILABLE FOR INTERNSHIPS
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[7vw] leading-[0.9] font-bold tracking-tight text-primary-text mb-4 flex flex-wrap overflow-hidden drop-shadow-2xl" style={{ letterSpacing: "-0.02em" }}>
              {profile.name.toUpperCase().split("").map((char, i) => (
                <div key={i} className="overflow-hidden inline-block">
                  <span className="hero-title-letter inline-block">{char === " " ? "\u00A0" : char}</span>
                </div>
              ))}
            </h1>

            {/* Scroll-synced transition text */}
            <div className="h-10 md:h-14 relative mb-6 hero-text-elem overflow-hidden">
               <div className="text-imagined absolute top-0 left-0 text-2xl md:text-4xl font-light tracking-widest text-secondary-text/80 uppercase">
                 IMAGINED IN CODE.
               </div>
               <div className="text-built absolute top-0 left-0 text-2xl md:text-4xl font-semibold tracking-widest text-white uppercase opacity-0">
                 BUILT FOR REALITY.
               </div>
            </div>
            
            <div className="mb-10 text-primary-text/90 text-lg md:text-xl font-light tracking-wide hero-text-elem drop-shadow-lg max-w-lg leading-relaxed">
              <p>{profile.intro}</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 hero-text-elem pointer-events-auto">
              <a 
                href="#projects" data-cursor-text="EXPLORE"
                onClick={(e) => { e.preventDefault(); scrollToSection("#projects", -50); }}
                className="group bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none"
              >
                EXPLORE MY WORK
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <a 
                href="https://resume-gamma-bice.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-primary-text px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none"
              >
                DOWNLOAD RESUME
              </a>
              <a 
                href="#contact"
                onClick={(e) => { e.preventDefault(); scrollToSection("#contact"); }}
                className="text-secondary-text hover:text-accent-cyan px-4 py-3 text-xs font-semibold tracking-widest uppercase transition-colors focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none rounded-full"
              >
                LET&apos;S TALK
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator absolute bottom-12 left-[8vw] z-20 hidden md:flex items-center gap-4 rotate-90 origin-left">
        <span className="text-[10px] tracking-[0.3em] font-medium text-secondary-text">SCROLL</span>
        <div className="w-16 h-[2px] bg-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1/3 bg-accent-cyan scroll-line-horizontal" />
        </div>
      </div>
    </section>
  );
}
