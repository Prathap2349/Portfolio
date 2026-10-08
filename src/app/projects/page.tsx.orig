"use client";

import { useState } from "react";
import Link from "next/link";
import { profile } from "@/data/profile";
import { ExternalLink } from "lucide-react";

export default function ProjectsPage() {
  const [filter, setFilter] = useState("ALL");
  const categories = ["ALL", "AI", "WEB", "ANDROID", "DATA", "TOOLS", "DESKTOP", "EXTENSION"];

  const filteredProjects = profile.projects.filter(
    p => filter === "ALL" || p.category === filter
  );

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12 lg:px-[8vw]">
      <div className="mb-16">
        <Link href="/#projects" className="text-secondary-text hover:text-accent-cyan transition-colors text-sm font-semibold tracking-widest uppercase">
          ← BACK TO HOME
        </Link>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-primary-text mb-12 tracking-tight">
        ALL PROJECTS
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-16">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-widest transition-colors border ${
              filter === cat 
                ? "bg-accent-cyan/10 border-accent-cyan text-accent-cyan" 
                : "border-white/10 text-secondary-text hover:border-white/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map(project => (
          <div key={project.slug} className="group relative flex flex-col p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors">
            <h3 className="text-xl font-bold text-primary-text mb-3 tracking-tight group-hover:text-accent-cyan transition-colors">
              {project.name}
            </h3>
            <p className="text-secondary-text text-sm mb-6 flex-grow">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.slice(0, 3).map(tech => (
                <span key={tech} className="text-[10px] tracking-wider text-accent-cyan/70 bg-accent-cyan/10 px-2 py-1 rounded-sm">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex gap-4 items-center mt-auto">
              {project.visibility === "private" ? (
                <span className="text-[10px] font-medium tracking-widest text-secondary-text/50 uppercase">
                  PRIVATE
                </span>
              ) : project.githubUrl ? (
                <a 
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium tracking-widest text-primary-text hover:text-accent-cyan transition-colors uppercase"
                >
                  SOURCE
                </a>
              ) : null}
              
              {project.liveUrl && (
                <a 
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-medium tracking-widest text-primary-text hover:text-accent-cyan transition-colors uppercase"
                >
                  <ExternalLink size={14} />
                  LIVE
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
