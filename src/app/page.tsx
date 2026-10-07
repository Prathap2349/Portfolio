import Hero from "@/components/Hero";
import TransitionSection from "@/components/TransitionSection";
import About from "@/components/About";
import Building from "@/components/Building";
import Github from "@/components/Github";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Connect from "@/components/Connect";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Hero />
      <TransitionSection />
      <About />
      <Building />
      <Suspense fallback={<div className="py-32 text-center bg-deep-navy text-secondary-text text-xs tracking-widest">LOADING GITHUB DATA...</div>}>
        <Github />
      </Suspense>
      <Skills />
      <Projects />
      <Connect />
    </>
  );
}
