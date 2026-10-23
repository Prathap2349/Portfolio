import { projects } from "./projects";

export const profile = {
  name: "Prathap",
  role: "AI & Data Science Student",
  education: "B.Tech Artificial Intelligence & Data Science",
  intro: "I'm a student who likes building apps that solve real problems. I've built everything from offline file transfer tools to local AI assistants.",
  focus: ["Software Engineering", "Artificial Intelligence", "Native Apps"],
  location: "Tamil Nadu, India",
  internshipStatus: "OPEN TO INTERNSHIPS",
  currentlyLearning: ["Native macOS development (Swift)", "Next.js", "Local LLMs"],
  // TODO(prathap): Timeline chronology conflict — 2024 projects (MangaUltra, SpendWise, Smart Vision Sentry, MediaTool, FocusVault) precede the 2025 B.Tech start date and 'wrote my first lines of code'. Confirm whether programming journey began in 2022/2023 (as indicated in earlier commit history) or if 2024 projects represent early self-taught prototypes prior to university.
  timeline: [
    { year: "2025", title: "Started B.Tech AI & Data Science", description: "Began my formal education in Artificial Intelligence and Data Science. Wrote my first lines of code." },
    { year: "2026", title: "2nd Year - Building Native & AI", description: "Focusing on offline-first desktop apps like USBBridge and Ollama Pet while deepening my ML knowledge." },
    { year: "2027", title: "Full-Stack & Automations", description: "Planning to build scalable applications and automated tools to solve complex daily problems." },
    { year: "2028", title: "Advanced AI Projects", description: "Diving deeper into advanced local LLMs, computer vision, and complex data engineering." },
    { year: "2029", title: "Graduation (Expected)", description: "Completing my B.Tech degree and ready to join the industry." }
  ],
  github: {
    primary: {
      username: "Prathap2349",
      label: "MAIN",
      url: "https://github.com/Prathap2349",
    }
  },
  skills: {
    // Verified across projects (SpendWise, MangaUltra, USBBridge, MediaTool, etc.)
    // Note: Java and C++ retained based on academic curriculum foundation; TODO(prathap): confirm specific project repositories for Java & C++.
    languages: ["Python", "TypeScript", "JavaScript", "Kotlin", "Swift", "Java", "C++"],
    frontend: ["React", "Next.js", "Tailwind CSS", "HTML/CSS"],
    backend: ["FastAPI", "Node.js"],
    native_desktop: ["Android SDK", "SwiftUI", "Electron"],
    ai_ml: ["Machine Learning", "Data Science", "Computer Vision", "Ollama", "TensorFlow", "OpenCV"],
    data: ["Data Analytics", "Firebase"],
    tools: ["Git", "GitHub", "VS Code", "Vercel", "FFmpeg", "ADB"],
  },
  social: {
    email: "prathapsenthilkumar9@gmail.com",
    linkedin: "https://www.linkedin.com/in/prathap-s-77a366374",
    github: "https://github.com/Prathap2349",
    resume: "https://resume-gamma-bice.vercel.app/"
  }
};

export { projects };
