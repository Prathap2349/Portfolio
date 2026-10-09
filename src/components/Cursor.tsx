"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    const spotlight = spotlightRef.current;
    const textEl = textRef.current;
    if (!cursor || !spotlight || !textEl) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.25 });
    gsap.set(spotlight, { xPercent: -50, yPercent: -50, opacity: 0 });

    const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
    const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });
    const xToSpotlight = gsap.quickTo(spotlight, "x", { duration: 0.5, ease: "power3" });
    const yToSpotlight = gsap.quickTo(spotlight, "y", { duration: 0.5, ease: "power3" });

    let hasMoved = false;
    let isHovering = false;
    let magneticTarget: HTMLElement | null = null;
    let magMoveFn: ((e: MouseEvent) => void) | null = null;

    let magX: gsap.QuickToFunc | null = null;
    let magY: gsap.QuickToFunc | null = null;

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

    const handleMouseDown = () => {
      gsap.to(cursor, { scale: 0.2, duration: 0.1, ease: "power2.out", overwrite: "auto" });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, { scale: isHovering ? 1 : 0.25, duration: 0.2, ease: "power2.out", overwrite: "auto" });
    };

    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const interactable = target.closest("a, button, .project-card, .github-card, .copy-control") as HTMLElement | null;

      if (interactable) {
        isHovering = true;
        
        let label = "";
        if (interactable.closest(".project-card")) label = "VIEW";
        else if (interactable.closest(".github-card") || interactable.hasAttribute('target')) label = "OPEN";
        else if (interactable.closest(".copy-control")) label = "COPY";
        
        textEl.textContent = label;
        
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: "rgba(245, 158, 11, 0.1)", // Amber-500
          border: "1px solid rgba(245, 158, 11, 0.5)",
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto"
        });

        if (interactable.tagName.toLowerCase() === "button" || interactable.tagName.toLowerCase() === "a") {
          const rect = interactable.getBoundingClientRect();
          if (rect.width < 150) {
            magneticTarget = interactable;
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            magX = gsap.quickTo(interactable, "x", { duration: 0.3, ease: "power2.out" });
            magY = gsap.quickTo(interactable, "y", { duration: 0.3, ease: "power2.out" });
            
            magMoveFn = (me: MouseEvent) => {
              const dx = (me.clientX - cx) * 0.3;
              const dy = (me.clientY - cy) * 0.3;
              if (magX && magY) {
                magX(dx);
                magY(dy);
              }
            };
            
            interactable.addEventListener("mousemove", magMoveFn);
          }
        }
      }
    };

    const handlePointerOut = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const interactable = target.closest("a, button, .project-card, .github-card, .copy-control") as HTMLElement | null;
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      
      if (interactable && relatedTarget && interactable.contains(relatedTarget)) {
        return;
      }

      if (interactable) {
        isHovering = false;
        textEl.textContent = "";
        
        gsap.to(cursor, {
          scale: 0.25,
          backgroundColor: "#F59E0B",
          border: "none",
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto"
        });

        if (magneticTarget && magMoveFn) {
          magneticTarget.removeEventListener("mousemove", magMoveFn);
          gsap.to(magneticTarget, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)", overwrite: "auto" });
          magneticTarget = null;
          magMoveFn = null;
          magX = null;
          magY = null;
        }
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      
      if (magneticTarget && magMoveFn) {
        magneticTarget.removeEventListener("mousemove", magMoveFn);
        gsap.set(magneticTarget, { x: 0, y: 0 });
      }
    };
  }, [isMounted]);

  if (!isMounted) return null;
  if (typeof window !== "undefined" && (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return null;

  return (
    <>
      <div 
        ref={spotlightRef}
        className="fixed top-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.03)_0%,transparent_70%)] rounded-full pointer-events-none z-[9998] mix-blend-screen"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-12 h-12 bg-amber-500 rounded-full pointer-events-none z-[9999] flex items-center justify-center transition-colors shadow-[0_0_10px_rgba(245,158,11,0.5)]"
      >
        <span ref={textRef} className="text-[10px] font-bold tracking-widest text-amber-500 whitespace-nowrap opacity-100 mix-blend-screen" />
      </div>
    </>
  );
}
