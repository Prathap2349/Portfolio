"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    // Only run on desktop devices
    if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    setIsVisible(true);

    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        opacity: 1,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const onMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.3 });
    };

    const onMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactable = target.closest('a, button, [role="button"]') as HTMLElement;
      const textElem = target.closest('[data-cursor-text]') as HTMLElement;

      if (textElem) {
        setCursorText(textElem.getAttribute('data-cursor-text') || "");
        gsap.to(cursor, { 
          scale: 2.5, 
          backgroundColor: "rgba(5, 10, 21, 0.8)", 
          borderColor: "rgba(111, 231, 255, 1)", 
          duration: 0.3 
        });
      } else if (interactable) {
        setCursorText("");
        gsap.to(cursor, { 
          scale: 1.5, 
          backgroundColor: "rgba(111, 231, 255, 0.2)", 
          borderColor: "rgba(111, 231, 255, 0.8)", 
          duration: 0.3 
        });
      } else {
        setCursorText("");
        gsap.to(cursor, { 
          scale: 1, 
          backgroundColor: "transparent", 
          borderColor: "rgba(111, 231, 255, 0.5)", 
          duration: 0.3 
        });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseleave", onMouseLeave);
    document.body.addEventListener("mouseenter", onMouseEnter);
    document.body.addEventListener("mouseover", handleMouseOver);
    
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseleave", onMouseLeave);
      document.body.removeEventListener("mouseenter", onMouseEnter);
      document.body.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-6 h-6 border border-accent-cyan/50 rounded-full pointer-events-none z-[100] flex items-center justify-center hidden md:flex transition-colors"
      style={{ transform: "translate(-50%, -50%)" }}
    >
      {cursorText && (
        <span className="text-[5px] font-bold tracking-widest text-accent-cyan px-1 text-center leading-none">
          {cursorText}
        </span>
      )}
    </div>
  );
}
