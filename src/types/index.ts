export interface Project {
  slug: string;
  name: string;
  shortName?: string;
  description: string;
  detailedDescription?: string;
  category: string;
  technologies: string[];
  status: string;
  visibility: "public" | "private";
  featured: boolean;
  isBuilding: boolean;
  year: number;
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  images?: string[];
  videoUrl?: string;
  mockupUrl?: string;
  problem?: string;
  solution?: string;
  result?: string;
  role?: string;
}

export interface GithubConfig {
  primary: {
    username: string;
    label: string;
    url: string;
  };
  secondary?: {
    username: string;
    label: string;
    url: string;
  };
}

export interface SkillGroups {
  languages: string[];
  frontend: string[];
  backend: string[];
  ai_ml: string[];
  data: string[];
  tools: string[];
}

export interface SocialLinks {
  email: string;
  linkedin?: string;
  github?: string;
  resume?: string;
}

export interface Profile {
  name: string;
  role: string;
  education: string;
  intro: string;
  focus: string[];
  location: string;
  github: GithubConfig;
  skills: SkillGroups;
  social: SocialLinks;
  internshipStatus: string;
}
