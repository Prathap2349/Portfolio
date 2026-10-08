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
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
            once: true
          },
        }
      );
      
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="github" 
      ref={containerRef}
      className="py-24 md:py-32 min-h-[50svh] bg-deep-navy relative border-y border-white/5"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-background)_0%,transparent_100%)] opacity-50" />
      
      <div className="container mx-auto w-full px-6 md:px-12 lg:px-[8vw] relative z-10">
        <h2 data-scroll-anchor className="text-accent-cyan font-semibold tracking-[0.25em] text-xs mb-12 uppercase github-item flex items-center gap-4">
          <span className="w-8 h-[1px] bg-accent-cyan/50 inline-block"></span>
          GITHUB
        </h2>

        {data.error ? (
          <div className="flex flex-col items-center justify-center bg-white/[0.01] border border-white/5 rounded-3xl p-12 text-center github-item">
            <h3 className="text-3xl font-bold tracking-tight text-primary-text mb-2">
              @{profileData.github.primary.username}
            </h3>
            <p className="text-secondary-text text-sm font-light mb-8">
              GitHub activity is temporarily unavailable.
            </p>
            <a 
              href={profileData.github.primary.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-primary-text px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors"
            >
              OPEN GITHUB <span className="inline-block transform transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
            </a>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 github-item">
              <div>
                <div className="text-secondary-text/80 text-xs tracking-[0.2em] mb-2 uppercase">
                  {profileData.github.primary.label} ACCOUNT
                </div>
                <h3 className="text-4xl font-bold tracking-tight text-primary-text hover:text-accent-cyan transition-colors">
                  <a href={profileData.github.primary.url} target="_blank" rel="noopener noreferrer">
                    @{profileData.github.primary.username}
                  </a>
                </h3>
              </div>
              
              <div className="flex gap-8 mt-8 md:mt-0">
                <div className="flex flex-col">
                  <span className="text-3xl font-light text-primary-text">{data.profile?.public_repos || 0}</span>
                  <span className="text-xs tracking-wider text-secondary-text uppercase">Repositories</span>
                </div>
                {data.stars > 0 && (
                  <div className="flex flex-col">
                    <span className="text-3xl font-light text-primary-text">{data.stars}</span>
                    <span className="text-xs tracking-wider text-secondary-text uppercase">Stars</span>
                  </div>
                )}
                {(data.profile?.followers || 0) > 0 && (
                  <div className="flex flex-col">
                    <span className="text-3xl font-light text-primary-text">{data.profile?.followers}</span>
                    <span className="text-xs tracking-wider text-secondary-text uppercase">Followers</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.repos.map((repo) => (
                <a 
                  key={repo.id} 
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-item block p-8 bg-white/[0.01] border border-white/5 hover:border-accent-cyan/30 hover:bg-white/[0.03] transition-all duration-300 group rounded-2xl"
                >
                  <h4 className="text-xl font-medium text-primary-text mb-3 group-hover:text-accent-cyan transition-colors">
                    {repo.name}
                  </h4>
                  <p className="text-secondary-text text-sm mb-6 line-clamp-2 h-10 font-light">
                    {repo.description || "No description provided."}
                  </p>
                  <div className="flex justify-between items-center text-xs font-medium text-secondary-text/60">
                    <span className="flex items-center gap-2 uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-accent-cyan/60" />
                      {repo.language || "Unknown"}
                    </span>
                    <span className="uppercase tracking-wider">
                      Updated {new Date(repo.updated_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </a>
              ))}
            </div>
            
            <div className="mt-12 flex justify-center github-item">
              <a 
                href={profileData.github.primary.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 border border-white/10 rounded-full px-6 py-3 hover:border-accent-cyan/50 hover:bg-accent-cyan/5 text-secondary-text hover:text-accent-cyan transition-all duration-300"
              >
                <span className="text-xs tracking-[0.2em] font-semibold uppercase">VIEW ALL REPOSITORIES</span>
                <span className="inline-block transform transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
