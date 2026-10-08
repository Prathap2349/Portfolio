import { projects } from "@/data/projects";
import Link from "next/link";
import ProjectFilter from "@/components/projects/ProjectFilter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Projects | Prathap",
  description: "Browse all my software engineering and AI projects.",
  openGraph: {
    title: "All Projects | Prathap",
    description: "Browse all my software engineering and AI projects.",
  },
};

export default function ProjectsPage() {
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

      <ProjectFilter projects={projects} />
    </div>
  );
}
