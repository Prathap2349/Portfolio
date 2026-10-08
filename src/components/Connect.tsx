"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/profile";
import { Copy, CheckCircle2 } from "lucide-react";

export default function Connect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [copied, setCopied] = useState(false);
  
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".connect-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 1, ease: "power2.out", scrollTrigger: { trigger: containerRef.current, start: "top 80%", toggleActions: "play none none none", once: true } }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleCopyEmail = () => {
    if (profile.social.email) {
      navigator.clipboard.writeText(profile.social.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    
    window.location.href = `mailto:${profile.social.email}?subject=${subject}&body=${body}`;
    
    setFormStatus("success");
    form.reset();
    setTimeout(() => setFormStatus("idle"), 3000);
  };

  return (
    <section id="contact" ref={containerRef} className="py-24 md:py-32 bg-background relative border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-[8vw]">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          <div className="flex flex-col justify-center">
            <div className="connect-item mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-semibold tracking-widest uppercase self-start">
               <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
               {profile.internshipStatus}
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-primary-text mb-8 connect-item leading-none">
              LET&apos;S BUILD <br />
              <span className="text-secondary-text/80 font-light italic">SOMETHING</span> <br />
              USEFUL.
            </h2>
            
            <div className="connect-item mb-12">
              <button 
                onClick={handleCopyEmail}
                className="flex items-center gap-3 text-secondary-text hover:text-accent-cyan transition-colors group relative"
              >
                <span className="tracking-widest text-sm font-medium">{profile.social.email}</span>
                {copied ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} className="opacity-50 group-hover:opacity-100" />}
                {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/10 text-white text-[10px] px-2 py-1 rounded">Copied!</span>}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 connect-item">
              <a href={profile.github.primary.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold tracking-widest uppercase text-secondary-text hover:text-white transition-colors">Github</a>
              <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold tracking-widest uppercase text-secondary-text hover:text-white transition-colors">LinkedIn</a>
              <a href={profile.social.resume} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold tracking-widest uppercase text-secondary-text hover:text-white transition-colors">Resume</a>
            </div>
          </div>

          <div className="connect-item bg-white/5 p-8 rounded-3xl border border-white/5">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold tracking-widest text-secondary-text uppercase mb-2">Name</label>
                <input name="name" required type="text" id="name" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-primary-text focus:outline-none focus:border-accent-cyan/50 transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-semibold tracking-widest text-secondary-text uppercase mb-2">Email</label>
                <input name="email" required type="email" id="email" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-primary-text focus:outline-none focus:border-accent-cyan/50 transition-colors" placeholder="john@example.com" />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-semibold tracking-widest text-secondary-text uppercase mb-2">Message</label>
                <textarea name="message" required id="message" rows={4} className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-primary-text focus:outline-none focus:border-accent-cyan/50 transition-colors resize-none" placeholder="Hello..." />
              </div>
              
              <button 
                type="submit" 
                disabled={formStatus === "loading" || formStatus === "success"}
                className={`w-full py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                  formStatus === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                  "bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30"
                }`}
              >
                {formStatus === "loading" ? (
                  <><span className="w-4 h-4 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" /> Sending...</>
                ) : formStatus === "success" ? (
                  <><CheckCircle2 size={16} /> Opening Mail Client...</>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
      
      <footer className="border-t border-white/5 py-8 mt-24">
        <div className="container mx-auto px-6 lg:px-[8vw] flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest text-secondary-text/60 uppercase">
          <div>{profile.name} • {profile.role}</div>
          <div>&copy; {currentYear} All rights reserved.</div>
        </div>
      </footer>
    </section>
  );
}
