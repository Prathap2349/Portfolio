import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, GitBranch } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const project = projects.find(p => p.slug === resolvedParams.slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.name} | Prathap`,
    description: project.description,
    openGraph: {
      title: `${project.name} | Prathap`,
      description: project.description,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = projects.find(p => p.slug === resolvedParams.slug);

  if (!project) return notFound();

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-[8vw]">
        
        {/* Back Button */}
        <Link 
          href="/#projects" 
          className="inline-flex items-center gap-2 text-secondary-text hover:text-accent-cyan transition-colors mb-12 text-sm font-semibold tracking-widest uppercase"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        {/* Header */}
        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="text-[10px] font-bold tracking-[0.2em] text-accent-cyan px-3 py-1.5 bg-accent-cyan/10 rounded-full">
              {project.category}
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-secondary-text uppercase px-3 py-1.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'Active' ? 'bg-green-400' : 'bg-accent-warm'}`} />
              {project.status}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-primary-text tracking-tight mb-6">{project.name}</h1>
          <p className="text-xl md:text-2xl text-secondary-text font-light max-w-3xl leading-relaxed">
            {project.description}
          </p>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-4 mt-10">
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300"
              >
                View Live Site
                <ArrowUpRight size={16} />
              </a>
            )}
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-primary-text border border-white/10 px-6 py-3 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300"
              >
                Source Code
                <GitBranch size={16} />
              </a>
            )}
          </div>
        </header>

        {/* Feature Image */}
        {project.image ? (
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-24 border border-white/10 bg-white/5">
             <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-24 border border-white/10 bg-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="absolute inset-0 flex items-center justify-center text-secondary-text font-light tracking-widest text-sm uppercase">
              {project.name} Preview
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="md:col-span-2 space-y-12">
            {project.problem && (
              <section>
                <h2 className="text-2xl font-bold text-primary-text mb-6">The Problem</h2>
                <div className="space-y-4 text-secondary-text font-light leading-relaxed whitespace-pre-line">
                  {project.problem}
                </div>
              </section>
            )}
            
            {project.solution && (
              <section>
                <h2 className="text-2xl font-bold text-primary-text mb-6">The Solution</h2>
                <div className="space-y-4 text-secondary-text font-light leading-relaxed whitespace-pre-line">
                  {project.solution}
                </div>
              </section>
            )}

            {project.result && (
              <section>
                <h2 className="text-2xl font-bold text-primary-text mb-6">The Result</h2>
                <div className="space-y-4 text-secondary-text font-light leading-relaxed whitespace-pre-line">
                  {project.result}
                </div>
              </section>
            )}

            {/* Default overview if no detailed fields exist */}
            {!project.problem && !project.solution && !project.result && (
              <section>
                <h2 className="text-2xl font-bold text-primary-text mb-6">Overview</h2>
                <div className="space-y-4 text-secondary-text font-light leading-relaxed">
                  <p>Detailed case study information for {project.name} is currently being compiled. Stay tuned for architectural details, problems solved, and technical implementations.</p>
                </div>
              </section>
            )}
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="text-sm font-semibold tracking-widest text-secondary-text uppercase mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <span key={tech} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-sm text-primary-text">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.role && (
              <div>
                <h3 className="text-sm font-semibold tracking-widest text-secondary-text uppercase mb-4">Role</h3>
                <p className="text-primary-text">{project.role}</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold tracking-widest text-secondary-text uppercase mb-4">Timeline</h3>
              <p className="text-primary-text">{project.year}</p>
            </div>
            
            <div>
               <h3 className="text-sm font-semibold tracking-widest text-secondary-text uppercase mb-4">Visibility</h3>
               <p className="text-primary-text capitalize">{project.visibility}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}
