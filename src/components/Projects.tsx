import { Suspense } from "react";
import ProjectJourney, { JourneyProject } from "./projects/ProjectJourney";
import { projects as fallbackProjects } from "@/data/projects";

export default function Projects() {
  const mappedProjects = fallbackProjects.filter(p => p.featured);

  return (
    <section id="projects" className="bg-background relative w-full">
      <Suspense fallback={
        <div className="h-screen flex items-center justify-center text-xs tracking-widest text-primary-text uppercase gap-4 min-h-screen">
          <span className="w-4 h-4 rounded-full border-2 border-primary-text/30 border-t-primary-text animate-spin" />
          Loading Projects...
        </div>
      }>
        <ProjectJourney projects={mappedProjects as JourneyProject[]} />
      </Suspense>
    </section>
  );
}
