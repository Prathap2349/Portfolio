"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [hoverText, setHoverText] = useState("");

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    
    setIsMobile(false);
    setIsVisible(true);

    const cursor = cursorRef.current;
    const spotlight = spotlightRef.current;
    if (!cursor || !spotlight) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(spotlight, { xPercent: -50, yPercent: -50, opacity: 0 });

    const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
    const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });
    const xToSpotlight = gsap.quickTo(spotlight, "x", { duration: 0.4, ease: "power3" });
    const yToSpotlight = gsap.quickTo(spotlight, "y", { duration: 0.4, ease: "power3" });

    let hasMoved = false;

    const moveCursor = (e: MouseEvent) => {
      if (!hasMoved) {
        gsap.to(cursor, { opacity: 1, duration: 0.3 });
        gsap.to(spotlight, { opacity: 1, duration: 0.3 });
        hasMoved = true;
      }
      xToCursor(e.clientX);
      yToCursor(e.clientY);
      xToSpotlight(e.clientX);
      yToSpotlight(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);

    const interactables = document.querySelectorAll("a, button, .project-card, .github-card");
    
    const handleMouseEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      
      if (target.closest(".project-card")) setHoverText("VIEW");
      else if (target.closest(".github-card")) setHoverText("OPEN");
      else setHoverText("");

      gsap.to(cursor, {
        scale: 2.5,
        backgroundColor: "rgba(245, 158, 11, 0.1)", // Amber-500
        border: "1px solid rgba(245, 158, 11, 0.5)",
        duration: 0.3
      });

      if (target.tagName.toLowerCase() === "a" || target.tagName.toLowerCase() === "button") {
        const rect = target.getBoundingClientRect();
        if (rect.width < 150) {
           const cx = rect.left + rect.width / 2;
           const cy = rect.top + rect.height / 2;
           
           const magMove = (e: Event) => {
              const me = e as MouseEvent;
              const dx = (me.clientX - cx) * 0.3;
              const dy = (me.clientY - cy) * 0.3;
              gsap.to(target, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
           };
           
           target.addEventListener("mousemove", magMove);
           target.addEventListener("mouseleave", () => {
              target.removeEventListener("mousemove", magMove);
              gsap.to(target, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
           }, { once: true });
        }
      }
    };

    const handleMouseLeave = () => {
      setHoverText("");
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: "#F59E0B", // Amber-500
        border: "none",
        duration: 0.3
      });
    };

    interactables.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    const observer = new MutationObserver(() => {
      const newInteractables = document.querySelectorAll("a, button, .project-card, .github-card");
      newInteractables.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      observer.disconnect();
      interactables.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  if (isMobile || !isVisible) return null;

  return (
    <>
      <div 
        ref={spotlightRef}
        className="fixed top-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.03)_0%,transparent_70%)] rounded-full pointer-events-none z-[9998] mix-blend-screen"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 bg-amber-500 rounded-full pointer-events-none z-[9999] flex items-center justify-center transition-colors shadow-[0_0_10px_rgba(245,158,11,0.5)]"
      >
        {hoverText && (
          <span className="text-[3px] font-bold tracking-widest text-amber-500 whitespace-nowrap opacity-100">
            {hoverText}
          </span>
        )}
      </div>
    </>
  );
}
