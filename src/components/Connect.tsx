"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";
import { Mail, Clock, Check, Copy } from "lucide-react";

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
    return () => ctx.revert();
  }, []);

  const handleCopyEmail = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(profile.social.email);
    } else {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = profile.social.email;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch {}
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const subjectText = "Hello Prathap";
  const bodyText = "Hi Prathap,\n\nI saw your portfolio and I'd like to chat about...\n\nThanks,";
  
  const subject = encodeURIComponent(subjectText);
  const body = encodeURIComponent(bodyText);
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.social.email}&su=${subject}&body=${body}`;
  const mailtoLink = `mailto:${profile.social.email}?subject=${subject}&body=${body}`;

  return (
    <section 
      id="contact" 
      ref={containerRef}
      className="py-16 md:py-24 bg-background relative"
    >
      <div className="container mx-auto max-w-4xl px-6 md:px-12 relative z-10 text-center flex flex-col items-center">
        
        <div className="mb-8 connect-item inline-flex items-center gap-2 px-4 py-2 rounded border border-amber-500/20 bg-amber-500/10 text-amber-500 text-xs font-medium tracking-wider">
           <Clock size={14} />
           <span>LOCAL TIME: {time}</span>
           <span className="mx-2 w-1 h-1 bg-amber-500/50 rounded-full" />
           <span>REPLIES WITHIN 24H</span>
        </div>

        <h2 data-scroll-anchor className="text-4xl md:text-5xl font-bold text-primary-text mb-6 connect-item">
          Get in touch
        </h2>
        
        <p className="text-secondary-text text-lg mb-12 max-w-xl mx-auto connect-item">
          Have an idea, opportunity, or just want to say hi? My inbox is always open.
        </p>
        
        <div className="flex flex-col items-center justify-center gap-4 connect-item relative z-20">
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              ref={emailBtnRef}
              href={gmailLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-500 text-background px-8 py-3 rounded text-sm font-semibold tracking-wider uppercase transition-transform hover:scale-105 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Mail size={16} />
              Open in Gmail
            </a>
            
            <button 
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-primary-text px-8 py-3 rounded text-sm font-semibold tracking-wider uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-400" />
                  <span className="text-green-400">COPIED!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  COPY EMAIL
                </>
              )}
            </button>
          </div>
          
          <a href={mailtoLink} className="text-xs text-secondary-text hover:text-amber-500 underline underline-offset-4 mt-2 transition-colors">
            or use your default mail app
          </a>
        </div>

        <div className="mt-32 pt-12 w-full border-t border-white/5 flex flex-wrap justify-center gap-8 md:gap-16 text-xs font-semibold tracking-widest uppercase text-secondary-text connect-item">
          <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">GitHub</a>
          <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">LinkedIn</a>
          <a href={profile.social.resume} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">Resume</a>
        </div>
        
        <div className="mt-12 text-[10px] tracking-widest text-secondary-text/40 connect-item uppercase flex flex-col gap-2 items-center">
          <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <p className="opacity-50 flex items-center gap-2">
            DESIGNED & ENGINEERED WITH 🤍
          </p>
        </div>
      </div>
    </section>
  );
}
