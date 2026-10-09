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

    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(spotlight, { xPercent: -50, yPercent: -50, opacity: 0 });

    const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
    const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });
    const xToSpotlight = gsap.quickTo(spotlight, "x", { duration: 0.5, ease: "power3" });
    const yToSpotlight = gsap.quickTo(spotlight, "y", { duration: 0.5, ease: "power3" });

    let hasMoved = false;
    let isHovering = false;
    let magneticTarget: HTMLElement | null = null;
    let magMoveFn: ((e: MouseEvent) => void) | null = null;

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
      gsap.to(cursor, { scale: 0.8, duration: 0.1, ease: "power2.out" });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, { scale: isHovering ? 4 : 1, duration: 0.2, ease: "power2.out" });
    };

    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const interactable = target.closest("a, button, .project-card, .github-card, .copy-control") as HTMLElement | null;

      if (interactable) {
        isHovering = true;
        
        // Determine label
        let label = "";
        if (interactable.closest(".project-card")) label = "VIEW";
        else if (interactable.closest(".github-card") || interactable.hasAttribute('target')) label = "OPEN";
        else if (interactable.closest(".copy-control")) label = "COPY";
        
        textEl.textContent = label;
        
        gsap.to(cursor, {
          scale: 4,
          backgroundColor: "rgba(245, 158, 11, 0.1)", // Amber-500
          border: "0.25px solid rgba(245, 158, 11, 0.5)",
          duration: 0.3,
          ease: "power2.out"
        });

        // Magnetic effect for small buttons
        if (interactable.tagName.toLowerCase() === "button" || interactable.tagName.toLowerCase() === "a") {
          const rect = interactable.getBoundingClientRect();
          if (rect.width < 150) {
            magneticTarget = interactable;
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            
            magMoveFn = (me: MouseEvent) => {
              const dx = (me.clientX - cx) * 0.3;
              const dy = (me.clientY - cy) * 0.3;
              gsap.to(interactable, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
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
      
      // Prevent triggering if moving to a child of the same interactable
      if (interactable && relatedTarget && interactable.contains(relatedTarget)) {
        return;
      }

      if (interactable) {
        isHovering = false;
        textEl.textContent = "";
        
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: "#F59E0B",
          border: "none",
          duration: 0.3,
          ease: "power2.out"
        });

        if (magneticTarget && magMoveFn) {
          magneticTarget.removeEventListener("mousemove", magMoveFn);
          gsap.to(magneticTarget, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
          magneticTarget = null;
          magMoveFn = null;
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
        className="fixed top-0 left-0 w-3 h-3 bg-amber-500 rounded-full pointer-events-none z-[9999] flex items-center justify-center transition-colors shadow-[0_0_10px_rgba(245,158,11,0.5)]"
      >
        <span ref={textRef} className="text-[2px] font-bold tracking-widest text-amber-500 whitespace-nowrap opacity-100 mix-blend-screen" />
      </div>
    </>
  );
}
