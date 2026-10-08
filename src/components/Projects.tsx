import { Suspense } from "react";
import ProjectJourney from "./projects/ProjectJourney";
import { projects as fallbackProjects } from "@/data/projects";

export default function Projects() {
  const mappedProjects = fallbackProjects
    .filter(p => p.featured)
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
      category: p.category,
      problem: p.problem,
    }));

  return (
    <section id="projects" className="bg-background relative w-full">
      <Suspense fallback={
        <div className="h-screen flex items-center justify-center text-xs tracking-widest text-primary-text uppercase gap-4 min-h-screen">
          <span className="w-4 h-4 rounded-full border-2 border-primary-text/30 border-t-primary-text animate-spin" />
          Loading Projects...
        </div>
      }>
        <ProjectJourney projects={mappedProjects} />
      </Suspense>
    </section>
  );
}
