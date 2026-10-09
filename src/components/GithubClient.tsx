"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GithubRepo, GithubProfile } from "@/lib/github";
import { profile as profileData } from "@/data/profile";
import { Lock } from "lucide-react";

const privateProjects = [
  {
    name: "Echo AI",
    description: "A local-first AI voice assistant designed to interact with the Mac using AI, voice commands and automation.",
    tech: "NEXT.JS · FASTAPI · OLLAMA · AI"
  },
  {
    name: "Ollama Pet",
    description: "A native macOS AI companion with local AI, voice interaction and desktop-focused features.",
    tech: "SWIFT · SWIFTUI · OLLAMA · APPKIT"
  },
  {
    name: "FocusVault",
    description: "An Android focus and protection application designed to help users protect their attention.",
    tech: "KOTLIN · ANDROID SDK"
  }
];

interface GithubClientProps {
  data: {
    profile: GithubProfile | null;
    repos: GithubRepo[];
    stars: number;
    error: string | null;
  };
}

// A stylized contribution heatmap using CSS grid and GSAP
function AnimatedHeatmap() {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    // Animate squares randomly to simulate live data flow
    gsap.to(".heatmap-cell", {
      opacity: () => 0.2 + Math.random() * 0.8,
      duration: () => 1 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        each: 0.05,
        from: "random"
      }
    });
  }, []);

  // Generate 7 rows by 30 cols
  const cells = Array.from({ length: 7 * 30 });
  
  return (
    <div ref={mapRef} className="w-full overflow-hidden flex justify-end opacity-60">
      <div className="grid grid-rows-7 gap-1" style={{ gridTemplateColumns: "repeat(30, minmax(0, 1fr))" }}>
        {cells.map((_, i) => {
          // Stable pseudo-random based on index
          const rand = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
          let color = "bg-white/5";
          if (rand > 0.9) color = "bg-accent-cyan/80";
          else if (rand > 0.7) color = "bg-accent-cyan/50";
          else if (rand > 0.5) color = "bg-accent-cyan/30";

          return (
            <div key={i} className={`heatmap-cell w-2 h-2 rounded-[1px] ${color}`} />
          );
        })}
      </div>
    </div>
  );
}

export default function GithubClient({ data }: GithubClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [repoCount, setRepoCount] = useState(0);
  const [starCount, setStarCount] = useState(0);
  const [hoursAgo, setHoursAgo] = useState("UNKNOWN");

  // Calculate hours ago for the last commit based on updated_at
  const lastRepo = data.repos.length > 0 ? data.repos[0] : null;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (lastRepo) {
      timeoutId = setTimeout(() => {
        const diff = Date.now() - new Date(lastRepo.updated_at).getTime();
        setHoursAgo(Math.max(1, Math.floor(diff / (1000 * 60 * 60))).toString());
      }, 0);
    }

    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".github-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            once: true
          },
        }
      );

      // Count up numbers
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          const targetRepos = data.profile?.public_repos || 0;
          const targetStars = data.stars || 0;
          
          gsap.to({ val: 0 }, {
            val: targetRepos,
            duration: 2,
            ease: "power3.out",
            onUpdate: function() {
              setRepoCount(Math.ceil(this.targets()[0].val));
            }
          });

          gsap.to({ val: 0 }, {
            val: targetStars,
            duration: 2.5,
            ease: "power3.out",
            onUpdate: function() {
              setStarCount(Math.ceil(this.targets()[0].val));
            }
          });
        }
      });
    }, containerRef);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => { ctx.revert(); if (timeoutId) clearTimeout(timeoutId); };
  }, [data]);

  return (
    <section 
      id="github" 
      ref={containerRef}
      className="py-32 bg-background relative border-t border-white/5 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl px-6 md:px-12 lg:px-[8vw] relative z-10">
        
        <div className="mb-16 github-item flex items-center gap-4">
          <h2 className="text-[10px] font-semibold tracking-[0.4em] text-accent-cyan uppercase">05 / Projects I built</h2>
          <div className="h-[1px] bg-gradient-to-r from-accent-cyan/50 to-transparent flex-grow max-w-[200px]" />
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16 github-item">
          
          <div className="flex-1">
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white hover:text-accent-cyan transition-colors mb-4 leading-none">
              <a href={profileData.github.primary.url} target="_blank" rel="noopener noreferrer">
                @{profileData.github.primary.username}
              </a>
            </h3>
            <p className="text-secondary-text font-light text-lg mb-8">A live window into what I&apos;m building and contributing.</p>
            
            {/* Stats Row */}
            <div className="flex flex-wrap gap-8 md:gap-16">
               <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-bold text-accent-cyan">{repoCount}</span>
                  <span className="text-[10px] font-semibold tracking-widest text-secondary-text uppercase">Repositories</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-bold text-[#FFB86B]">{starCount}</span>
                  <span className="text-[10px] font-semibold tracking-widest text-secondary-text uppercase">Total Stars</span>
               </div>
               {lastRepo && (
                 <div className="flex flex-col justify-end pb-1">
                    <span className="flex items-center gap-2 text-[10px] font-semibold tracking-widest text-white uppercase bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                       <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                       Last commit {hoursAgo}h ago
                    </span>
                 </div>
               )}
            </div>
          </div>
          
          {/* Animated Heatmap */}
          <div className="w-full lg:w-1/2 flex justify-end">
             <AnimatedHeatmap />
          </div>
        </div>

        {data.error ? (
          <div className="flex flex-col items-center justify-center bg-white/[0.01] border border-white/5 rounded-2xl p-12 text-center github-item">
            <p className="text-secondary-text text-sm font-light">
              GitHub data is temporarily unavailable.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
            
            {/* Private Projects */}
            {privateProjects.map((p, i) => (
              <div 
                key={`private-${i}`} 
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;
                  const rotateX = ((y - centerY) / centerY) * -2;
                  const rotateY = ((x - centerX) / centerX) * 2;
                  gsap.to(e.currentTarget, { rotateX, rotateY, duration: 0.5, ease: "power2.out", transformPerspective: 1000 });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
                }}
                className="github-item github-card flex flex-col justify-between p-6 bg-white/[0.02] border border-white/5 transition-all duration-300 rounded-xl shadow-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] relative overflow-hidden cursor-default group hover:border-[#FFB86B]/30"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative z-10 transition-transform duration-300 group-hover:translate-z-[30px]" style={{ transform: "translateZ(20px)" }}>
                  <div className="text-[9px] font-bold text-[#FFB86B] tracking-widest uppercase mb-3 flex items-center gap-1.5">
                    <Lock size={10} /> PRIVATE PROJECT
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2 transition-colors line-clamp-1 group-hover:text-[#FFB86B]">
                    {p.name}
                  </h4>
                  <p className="text-secondary-text text-xs font-light line-clamp-3 h-12 leading-relaxed">
                    {p.description}
                  </p>
                </div>
                <div className="mt-6 flex flex-col gap-3 relative z-10 transition-transform duration-300" style={{ transform: "translateZ(30px)" }}>
                  <div className="text-[10px] font-semibold text-secondary-text tracking-[0.2em]">{p.tech}</div>
                  <div className="text-[9px] font-bold text-white/40 tracking-widest uppercase flex items-center gap-1.5 pt-3 border-t border-white/5">
                    PRIVATE REPOSITORY <Lock size={10} />
                  </div>
                </div>
              </div>
            ))}

            {/* Public Repositories */}
            {data.repos.slice(0, 6).map((repo) => (
              <a 
                key={repo.id} 
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;
                  const rotateX = ((y - centerY) / centerY) * -2;
                  const rotateY = ((x - centerX) / centerX) * 2;
                  gsap.to(e.currentTarget, { rotateX, rotateY, duration: 0.5, ease: "power2.out", transformPerspective: 1000 });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
                }}
                className="github-item github-card flex flex-col justify-between p-6 bg-white/[0.02] border border-white/5 hover:border-accent-cyan/30 hover:bg-white/[0.04] transition-all duration-300 group rounded-xl shadow-xl hover:shadow-[0_0_20px_rgba(111,231,255,0.1)] relative overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-accent-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="relative z-10 transition-transform duration-300 group-hover:translate-z-[30px]" style={{ transform: "translateZ(20px)" }}>
                  <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-accent-cyan transition-colors line-clamp-1">
                    {repo.name}
                  </h4>
                  <p className="text-secondary-text text-xs font-light line-clamp-2 h-8 leading-relaxed">
                    {repo.description || "No description provided."}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6 relative z-10 transition-transform duration-300" style={{ transform: "translateZ(30px)" }}>
                  <div className="flex items-center gap-2 text-[10px] font-medium text-secondary-text uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan/60" />
                    {repo.language || "Unknown"}
                  </div>
                  {repo.stargazers_count > 0 && (
                     <div className="flex items-center gap-1 text-[10px] font-medium text-[#FFB86B]">
                        ★ {repo.stargazers_count}
                     </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
        
        <div className="mt-12 flex justify-center github-item">
          <a 
            href="https://github.com/Prathap2349?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 text-[10px] font-semibold tracking-widest text-secondary-text hover:text-accent-cyan uppercase transition-colors"
          >
            VIEW ALL REPOSITORIES <span className="transform transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
