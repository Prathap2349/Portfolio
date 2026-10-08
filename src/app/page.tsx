import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Github from "@/components/Github";
import Connect from "@/components/Connect";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Suspense fallback={
        <section className="py-24 md:py-32 min-h-[50svh] bg-deep-navy relative flex items-center justify-center border-y border-white/5">
          <div className="text-secondary-text text-xs tracking-[0.2em] uppercase font-medium flex items-center gap-4">
            <span className="w-4 h-4 rounded-full border-2 border-accent-cyan/30 border-t-accent-cyan animate-spin" />
            LOADING GITHUB DATA...
          </div>
        </section>
      }>
        <Github />
      </Suspense>
      <Connect />
    </>
  );
}
