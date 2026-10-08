"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function ProjectCarousel({ images, title }: { images: string[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-background to-white/5 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(111,231,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]" />
        <span className="text-secondary-text/30 font-bold text-4xl md:text-6xl mb-4 uppercase tracking-widest opacity-20 text-center px-4">{title}</span>
        <span className="text-accent-cyan/50 text-[10px] tracking-widest uppercase px-3 py-1 border border-accent-cyan/20 rounded-full backdrop-blur-sm z-10">TECHNICAL PREVIEW</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="w-full aspect-video rounded-3xl border border-white/10 relative overflow-hidden bg-background">
        <Image src={images[0]} alt={`${title} preview`} fill sizes="100vw" className="object-cover" priority />
      </div>
    );
  }

  return (
    <div className="w-full relative group">
      <div className="w-full aspect-video rounded-3xl border border-white/10 relative overflow-hidden bg-background">
        {images.map((img, i) => (
          <div 
            key={i}
            className="absolute inset-0 transition-opacity duration-500 ease-in-out"
            style={{ opacity: i === currentIndex ? 1 : 0, pointerEvents: i === currentIndex ? "auto" : "none" }}
          >
            <Image 
              src={img} 
              alt={`${title} screenshot ${i + 1}`} 
              fill 
              sizes="100vw" 
              className="object-cover" 
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6">
        <button 
          onClick={goToPrev}
          className="flex items-center gap-2 text-secondary-text hover:text-primary-text transition-colors px-4 py-2 border border-transparent focus-visible:border-accent-cyan rounded-full outline-none"
          aria-label="Previous screenshot"
        >
          <ArrowLeft size={16} /> <span className="text-xs font-semibold tracking-widest uppercase hidden md:inline">PREV</span>
        </button>

        <div className="flex items-center gap-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none ${i === currentIndex ? "bg-accent-cyan scale-125" : "bg-white/20 hover:bg-white/40"}`}
              aria-label={`Go to screenshot ${i + 1}`}
              aria-current={i === currentIndex}
            />
          ))}
        </div>

        <button 
          onClick={goToNext}
          className="flex items-center gap-2 text-secondary-text hover:text-primary-text transition-colors px-4 py-2 border border-transparent focus-visible:border-accent-cyan rounded-full outline-none"
          aria-label="Next screenshot"
        >
          <span className="text-xs font-semibold tracking-widest uppercase hidden md:inline">NEXT</span> <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
