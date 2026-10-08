import { Suspense } from "react";
import ProjectJourney from "./projects/ProjectJourney";
import { fetchGithubData } from "@/lib/github";
import { profile } from "@/data/profile";
import { projects as fallbackProjects } from "@/data/projects";
import { JourneyProject } from "./projects/ProjectJourney";

export default async function Projects() {
  const { allRepos, error } = await fetchGithubData(profile.github.primary.username);

  let mappedProjects: JourneyProject[] = [];

  if (!error && allRepos && allRepos.length > 0) {
    const portfolioRepos = allRepos.filter(repo => repo.topics?.includes("portfolio"));

    if (portfolioRepos.length > 0) {
      portfolioRepos.sort((a, b) => {
        const aFeatured = a.topics?.includes("featured") ? 1 : 0;
        const bFeatured = b.topics?.includes("featured") ? 1 : 0;
        if (aFeatured !== bFeatured) return bFeatured - aFeatured;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });

      mappedProjects = portfolioRepos.map(repo => {
        const localData = fallbackProjects.find(
          p => p.slug === repo.name ||
               p.slug === repo.name.toLowerCase() ||
               p.githubUrl === repo.html_url
        );

        const slug = localData?.slug || repo.name.toLowerCase().replace(/\s+/g, "-");

        return {
          slug,
          name: localData?.name || repo.name.replace(/-/g, " ").toUpperCase(),
          description: localData?.description || repo.description || "No description provided.",
          technologies: localData?.technologies ||
            repo.topics?.filter(t => !["portfolio", "featured", "building"].includes(t)) || [],
          githubUrl: repo.html_url,
          liveUrl: localData?.liveUrl,
          images: localData?.images || [],
          videoUrl: localData?.videoUrl,
          mockupUrl: localData?.mockupUrl,
          status: repo.topics?.includes("building") ? "Building" : localData?.status || "Completed",
          category: localData?.category || "Open Source"
        };
      });
    }
  }

  if (mappedProjects.length === 0) {
    mappedProjects = fallbackProjects
      .filter(p => p.featured || p.isBuilding)
      .map(p => ({
        slug: p.slug,
        name: p.name,
        description: p.description,
        technologies: p.technologies,
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
        images: p.images || [],
        videoUrl: p.videoUrl,
        mockupUrl: p.mockupUrl,
        status: p.status,
        category: p.category
      }));
  }

  return (
    <section id="projects" className="bg-background relative w-full overflow-hidden">
      <Suspense fallback={
        <div className="h-screen flex items-center justify-center text-xs tracking-widest text-accent-cyan uppercase gap-4">
          <span className="w-4 h-4 rounded-full border-2 border-accent-cyan/30 border-t-accent-cyan animate-spin" />
          Preparing Project Journey...
        </div>
      }>
        <ProjectJourney projects={mappedProjects} />
      </Suspense>
    </section>
  );
}
