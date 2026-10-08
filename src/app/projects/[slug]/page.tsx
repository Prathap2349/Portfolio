import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { fetchGithubData } from "@/lib/github";
import { profile } from "@/data/profile";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectCarousel from "@/components/projects/ProjectCarousel";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// Unified project type for this page
interface DetailProject {
  slug: string;
  name: string;
  description: string;
  category: string;
  technologies: string[];
  status: string;
  githubUrl?: string;
  liveUrl?: string;
  images?: string[];
  videoUrl?: string;
  mockupUrl?: string;
  problem?: string;
  solution?: string;
  result?: string;
  role?: string;
}

async function getProject(slug: string): Promise<DetailProject | null> {
  // First check local data (exact match)
  const local = projects.find(p => p.slug === slug);
  if (local) return local;

  // If not in local data, check GitHub portfolio repos
  try {
    const { allRepos } = await fetchGithubData(profile.github.primary.username);
    const portfolioRepos = allRepos.filter(r => r.topics?.includes("portfolio"));
    const repo = portfolioRepos.find(r =>
      r.name.toLowerCase().replace(/\s+/g, "-") === slug ||
      r.name === slug
    );

    if (repo) {
      return {
        slug,
        name: repo.name.replace(/-/g, " ").toUpperCase(),
        description: repo.description || "No description provided.",
        category: repo.topics?.find(t => !["portfolio", "featured", "building"].includes(t))?.toUpperCase() || "OPEN SOURCE",
        technologies: repo.topics?.filter(t => !["portfolio", "featured", "building"].includes(t)) || [],
        status: repo.topics?.includes("building") ? "Building" : "Active",
        githubUrl: repo.html_url,
        images: []
      };
    }
  } catch {
    // GitHub failed — just 404
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.name} | Prathap`,
    description: project.description,
  };
}

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12 lg:px-[8vw] animate-page-enter">
      {/* Navigation */}
      <div className="mb-12">
        <Link 
          href="/#projects" 
          className="inline-flex items-center gap-2 text-secondary-text hover:text-accent-cyan transition-colors text-xs font-semibold tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none rounded-sm"
        >
          <ArrowLeft size={14} /> BACK TO PROJECTS
        </Link>
      </div>

      {/* Header */}
      <header className="mb-16">
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="text-[10px] tracking-widest text-secondary-text uppercase px-3 py-1 rounded-full border border-white/10 bg-white/5">
            {project.category}
          </span>
          <span className={`text-[10px] tracking-widest uppercase px-3 py-1 rounded-full border ${project.status === 'Active' ? 'border-accent-cyan/30 text-accent-cyan bg-accent-cyan/10' : 'border-white/10 text-secondary-text'}`}>
            {project.status}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-primary-text mb-6 tracking-tight">
          {project.name}
        </h1>
        
        <p className="text-secondary-text text-lg md:text-xl max-w-3xl font-light leading-relaxed">
          {project.description}
        </p>
      </header>

      {/* Media (Video or Carousel) */}
      {project.videoUrl ? (
        <div className="mb-24 relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
           <video src={project.videoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
        </div>
      ) : project.images && project.images.length > 0 ? (
        <div className="mb-24">
          <ProjectCarousel images={project.images} title={project.name} />
        </div>
      ) : null}

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-16">
          {project.problem && (
            <section>
              <h2 className="text-xs font-semibold tracking-[0.25em] text-accent-cyan uppercase mb-6 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-accent-cyan/50 inline-block"></span>
                THE PROBLEM
              </h2>
              <div className="text-secondary-text leading-relaxed font-light whitespace-pre-wrap">
                {project.problem}
              </div>
            </section>
          )}

          {project.solution && (
            <section>
              <h2 className="text-xs font-semibold tracking-[0.25em] text-accent-cyan uppercase mb-6 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-accent-cyan/50 inline-block"></span>
                THE SOLUTION
              </h2>
              <div className="text-secondary-text leading-relaxed font-light whitespace-pre-wrap">
                {project.solution}
              </div>
            </section>
          )}
          
          {project.result && (
            <section>
              <h2 className="text-xs font-semibold tracking-[0.25em] text-accent-cyan uppercase mb-6 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-accent-cyan/50 inline-block"></span>
                RESULT
              </h2>
              <div className="text-secondary-text leading-relaxed font-light whitespace-pre-wrap">
                {project.result}
              </div>
            </section>
          )}

          {/* Fallback message for GitHub-only projects */}
          {!project.problem && !project.solution && !project.result && (
            <div className="border border-white/5 rounded-2xl p-8 bg-white/[0.01] text-center">
              <p className="text-secondary-text text-sm font-light">
                Full case study coming soon. Check the source code for details.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-12">
          {project.role && (
            <div>
              <h3 className="text-[10px] font-semibold tracking-widest text-secondary-text uppercase mb-4">MY ROLE</h3>
              <p className="text-primary-text/90 font-light text-sm">{project.role}</p>
            </div>
          )}

          {project.technologies.length > 0 && (
            <div>
              <h3 className="text-[10px] font-semibold tracking-widest text-secondary-text uppercase mb-4">TECH STACK</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <span key={tech} className="text-[10px] tracking-wider text-primary-text uppercase bg-white/5 border border-white/10 px-3 py-1.5 rounded-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
            {project.liveUrl && (
              <a 
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full flex items-center justify-center gap-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan px-6 py-4 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none"
              >
                LIVE DEMO <span className="inline-block transform transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
              </a>
            )}
            
            {project.githubUrl && (
              <a 
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-primary-text px-6 py-4 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none"
              >
                SOURCE CODE <span className="inline-block transform transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
              </a>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}
