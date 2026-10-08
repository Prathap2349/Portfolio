"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GithubRepo, GithubProfile } from "@/lib/github";
import { profile as profileData } from "@/data/profile";

interface GithubClientProps {
  data: {
    profile: GithubProfile | null;
    repos: GithubRepo[];
    stars: number;
    error: string | null;
  };
}

export default function GithubClient({ data }: GithubClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
            toggleActions: "play none none none",
            once: true
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="github" 
      ref={containerRef}
      className="py-24 md:py-32 bg-deep-navy relative border-t border-white/5"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-background)_0%,transparent_100%)] opacity-30 pointer-events-none" />
      
      <div className="container mx-auto max-w-5xl px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 github-item">
          <div>
            <h2 data-scroll-anchor className="text-accent-cyan font-semibold tracking-[0.25em] text-xs mb-4 uppercase flex items-center gap-4">
              <span className="w-4 h-[1px] bg-accent-cyan/50 inline-block"></span>
              GITHUB
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-text hover:text-accent-cyan transition-colors mb-4">
              <a href={profileData.github.primary.url} target="_blank" rel="noopener noreferrer">
                @{profileData.github.primary.username}
              </a>
            </h3>
            <p className="text-secondary-text font-light text-lg">A live window into what I&apos;m building.</p>
          </div>
          
          <div className="mt-8 md:mt-0">
            <a 
              href={profileData.github.primary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-primary-text px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
            >
              OPEN GITHUB <span className="inline-block transform transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </a>
          </div>
        </div>

        {data.error ? (
          <div className="flex flex-col items-center justify-center bg-white/[0.01] border border-white/5 rounded-2xl p-12 text-center github-item">
            <p className="text-secondary-text text-sm font-light">
              GitHub data is temporarily unavailable.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.repos.map((repo) => (
              <a 
                key={repo.id} 
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="github-item flex flex-col justify-between p-6 bg-white/[0.01] border border-white/5 hover:border-accent-cyan/30 hover:bg-white/[0.03] transition-all duration-300 group rounded-xl"
              >
                <div>
                  <h4 className="text-lg font-medium text-primary-text mb-2 group-hover:text-accent-cyan transition-colors line-clamp-1">
                    {repo.name}
                  </h4>
                  <p className="text-secondary-text text-xs font-light line-clamp-2 h-8">
                    {repo.description || "No description."}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4 text-[10px] font-medium text-secondary-text/60 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan/60" />
                  {repo.language || "Unknown"}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
