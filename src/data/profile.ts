import { Profile } from "@/types";
import { projects } from "./projects";

export const profile: Profile = {
  name: "Prathap",
  role: "AI & Data Science Student",
  education: "B.Tech Artificial Intelligence & Data Science",
  intro: "Building data-driven applications, AI tools and practical software.",
  focus: ["Software Engineering", "Artificial Intelligence", "Real-world Products"],
  location: "India",
  internshipStatus: "OPEN TO INTERNSHIPS",
  github: {
    primary: {
      username: "Prathap2349",
      label: "MAIN",
      url: "https://github.com/Prathap2349",
    }
  },
  skills: {
    languages: ["Python", "TypeScript", "JavaScript", "Java", "C++"],
    frontend: ["React", "Next.js", "Tailwind CSS", "HTML/CSS"],
    backend: ["Node.js"],
    ai_ml: ["Machine Learning", "Data Science", "Computer Vision", "Ollama", "TensorFlow", "OpenCV"],
    data: ["Data Analytics"],
    tools: ["Git", "GitHub", "VS Code", "Vercel", "FFmpeg"],
  },
  social: {
    email: "prathapsenthilkumar9@gmail.com",
    linkedin: "https://www.linkedin.com/in/prathap-s-77a366374",
    github: "https://github.com/Prathap2349",
  }
};

export { projects };
