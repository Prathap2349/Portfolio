"use client";

import { useState } from "react";
import Link from "next/link";
import { Project } from "@/types";
import { ExternalLink, ArrowRight } from "lucide-react";

export default function ProjectFilter({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("ALL");
  
  // Generate categories dynamically
  const availableCategories = Array.from(new Set(projects.map(p => p.category)));
  const categories = ["ALL", ...availableCategories.sort()];

  const filteredProjects = projects.filter(
    p => filter === "ALL" || p.category === filter
  );

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-16">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-widest transition-colors border uppercase ${
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
        {filteredProjects.map((project) => (
          <div key={project.slug} className="group relative flex flex-col p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors overflow-hidden">
            <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-10" aria-label={`View ${project.name} case study`} />
            
            <h3 className="text-xl font-bold text-primary-text mb-3 tracking-tight group-hover:text-accent-cyan transition-colors duration-300">
              {project.name}
            </h3>
            <p className="text-secondary-text text-sm mb-6 flex-grow leading-relaxed">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies.slice(0, 3).map((tech) => (
                <span key={tech} className="text-[10px] tracking-wider text-secondary-text uppercase bg-white/5 border border-white/10 px-2 py-1 rounded-sm">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between mt-auto">
              <span className="inline-flex items-center gap-2 text-primary-text group-hover:text-accent-cyan transition-colors text-[10px] font-semibold tracking-widest uppercase relative z-20 pointer-events-none">
                View Case Study
                <ArrowRight size={14} className="transform transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              
              <div className="flex gap-4 items-center relative z-20">
                {project.visibility === "private" ? (
                  <span className="text-[10px] font-medium tracking-widest text-secondary-text/50 uppercase">
                    PRIVATE
                  </span>
                ) : project.githubUrl ? (
                  <a 
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-medium tracking-widest text-secondary-text hover:text-primary-text transition-colors uppercase"
                  >
                    SOURCE
                  </a>
                ) : null}
                
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-medium tracking-widest text-secondary-text hover:text-primary-text transition-colors uppercase"
                  >
                    LIVE <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
