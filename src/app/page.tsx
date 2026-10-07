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
      <Suspense fallback={
        <section className="py-24 md:py-32 scroll-mt-[100px] min-h-[60svh] bg-deep-navy relative flex items-center justify-center">
          <div className="text-secondary-text text-xs tracking-[0.2em] uppercase font-medium">LOADING GITHUB DATA...</div>
        </section>
      }>
        <Github />
      </Suspense>
      <Skills />
      <Projects />
      <Connect />
    </>
  );
}
