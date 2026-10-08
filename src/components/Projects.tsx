import { Suspense } from "react";
import ProjectJourney from "./projects/ProjectJourney";
import { JourneyProject } from "./projects/ProjectJourney";

import { fetchGithubData } from "@/lib/github";
import { profile } from "@/data/profile";
import { projects as fallbackProjects } from "@/data/projects";

export default async function Projects() {
  const { allRepos, error } = await fetchGithubData(profile.github.primary.username);

  let mappedProjects: JourneyProject[] = [];

  if (!error && allRepos && allRepos.length > 0) {
    // Filter repos with "portfolio" topic
    const portfolioRepos = allRepos.filter(repo => repo.topics?.includes("portfolio"));
    
    // Sort: featured first, then updated_at
    portfolioRepos.sort((a, b) => {
      const aFeatured = a.topics?.includes("featured") ? 1 : 0;
      const bFeatured = b.topics?.includes("featured") ? 1 : 0;
      if (aFeatured !== bFeatured) return bFeatured - aFeatured;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    mappedProjects = portfolioRepos.map(repo => {
      // Find extra local data if exists (like screenshots, problems, etc)
      const localData = fallbackProjects.find(p => p.slug === repo.name || p.githubUrl === repo.html_url);
      
      return {
        slug: localData?.slug || repo.name,
        name: repo.name.replace(/-/g, " ").toUpperCase(),
        description: localData?.description || repo.description || "No description provided.",
        technologies: localData?.technologies || repo.topics?.filter(t => t !== "portfolio" && t !== "featured" && t !== "building") || [],
        githubUrl: repo.html_url,
        liveUrl: localData?.liveUrl,
        images: localData?.images || [],
        status: repo.topics?.includes("building") ? "Building" : "Completed",
        category: localData?.category || "Open Source"
      };
    });
  }

  // If github failed or returned no portfolio topics, use fallback
  if (mappedProjects.length === 0) {
    mappedProjects = fallbackProjects.filter(p => p.featured || p.isBuilding);
  }

  return (
    <section id="projects" className="bg-background relative w-full overflow-hidden">
      <Suspense fallback={<div className="h-screen flex items-center justify-center text-xs tracking-widest text-accent-cyan uppercase">Loading Journey...</div>}>
        <ProjectJourney projects={mappedProjects} />
      </Suspense>
    </section>
  );
}
