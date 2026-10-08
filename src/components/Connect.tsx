"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";
import { Mail, Clock, CheckCircle2 } from "lucide-react";

export default function Connect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const emailBtnRef = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // Clock in IST
    const updateTime = () => {
      const now = new Date();
      const istTime = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setTime(`${istTime} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

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

    // Magnetic Button Effect
    const btn = emailBtnRef.current;
    if (btn) {
      const handleMouseMove = (e: MouseEvent) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
      };
      const handleMouseLeave = () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      };
      
      btn.addEventListener("mousemove", handleMouseMove);
      btn.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        btn.removeEventListener("mousemove", handleMouseMove);
        btn.removeEventListener("mouseleave", handleMouseLeave);
        ctx.revert();
      };
    }
    return () => ctx.revert();
  }, []);

  // Konami Code Easter Egg
  useEffect(() => {
    const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          alert("⚡ You found the easter egg! Keep building awesome things! ⚡");
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const createParticles = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      document.body.appendChild(particle);
      
      const size = Math.random() * 6 + 2;
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 60 + 20;
      
      gsap.set(particle, {
        position: "fixed",
        left: centerX,
        top: centerY,
        width: size,
        height: size,
        backgroundColor: Math.random() > 0.5 ? "#FFB86B" : "#6FE7FF", // warm and cyan
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 9999
      });
      
      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance + 30, // Gravity effect
        opacity: 0,
        duration: 0.6 + Math.random() * 0.4,
        ease: "power2.out",
        onComplete: () => particle.remove()
      });
    }
  };

  const handleCopyEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(profile.social.email);
    setCopied(true);
    createParticles(e);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoLink = `mailto:${profile.social.email}?subject=Portfolio Inquiry — Prathap&body=Hi Prathap,%0D%0A%0D%0AI found your portfolio and would like to get in touch regarding...%0D%0A%0D%0AThanks,`;

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="py-32 md:py-48 bg-background relative overflow-hidden"
    >
      {/* Warm Ambient Glow for the finale */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,184,107,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto max-w-4xl px-6 md:px-12 relative z-10 text-center flex flex-col items-center">
        
        <div className="mb-8 connect-item inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-400 text-xs font-medium tracking-wider">
           <Clock size={14} />
           <span>LOCAL TIME: {time}</span>
           <span className="mx-2 w-1 h-1 bg-orange-400/50 rounded-full" />
           <span>REPLIES WITHIN 24H</span>
        </div>

        <h2 data-scroll-anchor className="text-5xl md:text-7xl lg:text-[6vw] font-bold tracking-tight text-primary-text mb-8 leading-[0.9] connect-item">
          LET&apos;S BUILD<br/>
          <span className="text-[#FFB86B]">SOMETHING</span><br/>
          USEFUL.
        </h2>
        
        <p className="text-secondary-text text-lg md:text-xl font-light mb-16 max-w-2xl mx-auto leading-relaxed connect-item">
          Have an idea, opportunity, internship, or just want to say hi? <br className="hidden md:block"/>
          My inbox is always open.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-6 connect-item relative z-20">
          <a 
            ref={emailBtnRef}
            href={mailtoLink}
            className="group inline-flex items-center gap-2 bg-[#FFB86B]/10 hover:bg-[#FFB86B]/20 border border-[#FFB86B]/30 text-[#FFB86B] px-8 py-4 rounded-full text-sm font-semibold tracking-widest uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#FFB86B] shadow-[0_0_20px_rgba(255,184,107,0.15)] hover:shadow-[0_0_30px_rgba(255,184,107,0.3)]"
          >
            <Mail size={16} className="opacity-80" />
            SAY HELLO
          </a>
          
          <button 
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-primary-text px-8 py-4 rounded-full text-sm font-semibold tracking-widest uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan w-48 justify-center"
          >
            {copied ? (
              <span className="flex items-center gap-2 text-green-400"><CheckCircle2 size={16} /> COPIED</span>
            ) : "COPY EMAIL"}
          </button>
        </div>

        <div className="mt-32 pt-12 border-t border-white/5 flex flex-wrap justify-center gap-8 md:gap-16 text-xs font-semibold tracking-widest uppercase text-secondary-text connect-item">
          <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#FFB86B] transition-colors">GitHub</a>
          <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#FFB86B] transition-colors">LinkedIn</a>
          <a href={profile.social.resume} target="_blank" rel="noopener noreferrer" className="hover:text-[#FFB86B] transition-colors">Resume</a>
        </div>
        
        <div className="mt-12 text-[10px] tracking-widest text-secondary-text/40 connect-item uppercase flex flex-col gap-2 items-center">
          <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p className="opacity-50 flex items-center gap-2">
            DESIGNED & ENGINEERED WITH 🤍 <span className="opacity-0 hover:opacity-100 transition-opacity duration-300">↑↑↓↓←→←→BA</span>
          </p>
        </div>
      </div>
    </section>
  );
}
