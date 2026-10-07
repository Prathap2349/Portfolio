"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Centralized configuration for easy fine-tuning
export const REVEAL_CONFIG = {
  radius: 150, // 100-160px
  feather: 80, // 50-100px
  originalScale: 1.0, 
  originalX: "0%", 
  originalY: "0%", 
  objectPosition: "right", // Matches the anime image positioning
  cursorSmoothing: 0.15, // lerp factor
  // Face Region bounds relative to the actual image coordinates
  // (Assuming face is at 65% X and 35% Y of the 3:2 source image)
  faceRegionX: 0.65, 
  faceRegionY: 0.35, 
  faceRegionRadius: 250, // pixels
  
  // Image aspect ratio (e.g., 1536x1024 = 1.5)
  imageAspectRatio: 1.5,
};

export default function InteractiveImageReveal({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const mouse = useRef({ x: 0, y: 0, active: false });
  const smoothedMouse = useRef({ x: 0, y: 0, active: 0 }); // active is 0 to 1 for opacity
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsDesktop(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Center initial mask position to avoid jumps from 0,0
    const rect = container.getBoundingClientRect();
    smoothedMouse.current.x = rect.width * REVEAL_CONFIG.faceRegionX;
    smoothedMouse.current.y = rect.height * REVEAL_CONFIG.faceRegionY;

    const updateMouse = (e: MouseEvent) => {
      const containerRect = container.getBoundingClientRect();
      const x = e.clientX - containerRect.left;
      const y = e.clientY - containerRect.top;
      
      // Calculate actual image rendering dimensions inside the container due to object-cover and object-position: right
      const containerRatio = containerRect.width / containerRect.height;
      let renderedImgWidth = containerRect.width;
      let renderedImgHeight = containerRect.height;
      let imgOffsetX = 0;
      let imgOffsetY = 0;

      if (containerRatio > REVEAL_CONFIG.imageAspectRatio) {
        // Container is wider than image. Image scales to width, top/bottom are cropped.
        renderedImgWidth = containerRect.width;
        renderedImgHeight = containerRect.width / REVEAL_CONFIG.imageAspectRatio;
        imgOffsetY = (containerRect.height - renderedImgHeight) / 2; // object-position center vertical
      } else {
        // Container is taller than image. Image scales to height, left is cropped (because object-position is right).
        renderedImgHeight = containerRect.height;
        renderedImgWidth = containerRect.height * REVEAL_CONFIG.imageAspectRatio;
        imgOffsetX = containerRect.width - renderedImgWidth; // object-position right horizontal
      }

      const faceCenterX = imgOffsetX + (renderedImgWidth * REVEAL_CONFIG.faceRegionX);
      const faceCenterY = imgOffsetY + (renderedImgHeight * REVEAL_CONFIG.faceRegionY);
      
      // We activate the reveal whenever hovering the container so the user doesn't lose their cursor
      // without any visual feedback. We can constrain the mask's maximum travel distance if needed, 
      // but making it active everywhere guarantees they see the effect.
      mouse.current = { x, y, active: true };
    };

    const handleMouseLeave = () => {
      mouse.current.active = false;
    };

    container.addEventListener("mousemove", updateMouse);
    container.addEventListener("mouseleave", handleMouseLeave);

    const lerp = (start: number, end: number, amt: number) => {
      return (1 - amt) * start + amt * end;
    };

    const animate = () => {
      smoothedMouse.current.x = lerp(smoothedMouse.current.x, mouse.current.x, REVEAL_CONFIG.cursorSmoothing);
      smoothedMouse.current.y = lerp(smoothedMouse.current.y, mouse.current.y, REVEAL_CONFIG.cursorSmoothing);
      
      const targetActive = mouse.current.active ? 1 : 0;
      smoothedMouse.current.active = lerp(smoothedMouse.current.active, targetActive, REVEAL_CONFIG.cursorSmoothing);

      if (container) {
        container.style.setProperty("--mask-x", `${smoothedMouse.current.x}px`);
        container.style.setProperty("--mask-y", `${smoothedMouse.current.y}px`);
        container.style.setProperty("--mask-opacity", `${smoothedMouse.current.active}`);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener("mousemove", updateMouse);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full ${className || ""}`}
      style={{ cursor: isDesktop ? 'none' : 'default' }}
      data-cursor-text="REAL"
    >
      {/* Base Anime Image */}
      <div className="absolute inset-0 w-full h-full opacity-100">
        <Image
          src="/images/anime.png"
          alt="Anime portrait of Prathap"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
          style={{ 
            maskImage: "linear-gradient(to right, black 80%, transparent 100%), linear-gradient(to bottom, black 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, black 80%, transparent 100%), linear-gradient(to bottom, black 80%, transparent 100%)",
            WebkitMaskComposite: "source-in",
            maskComposite: "intersect"
          }}
        />
      </div>

      {/* Reveal Original Image Layer */}
      {isDesktop && (
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            opacity: "var(--mask-opacity, 0)",
            maskImage: `radial-gradient(circle ${REVEAL_CONFIG.radius}px at var(--mask-x, -100px) var(--mask-y, -100px), black 0%, rgba(0,0,0,0.5) ${REVEAL_CONFIG.radius - REVEAL_CONFIG.feather}px, transparent ${REVEAL_CONFIG.radius}px)`,
            WebkitMaskImage: `radial-gradient(circle ${REVEAL_CONFIG.radius}px at var(--mask-x, -100px) var(--mask-y, -100px), black 0%, rgba(0,0,0,0.5) ${REVEAL_CONFIG.radius - REVEAL_CONFIG.feather}px, transparent ${REVEAL_CONFIG.radius}px)`,
          }}
        >
          {/* We apply the same fading mask as the anime image so edges don't leak */}
          <div className="absolute inset-0 w-full h-full opacity-100" style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 30%), linear-gradient(to bottom, black 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 30%), linear-gradient(to bottom, black 80%, transparent 100%)",
          }}>
            <div className="absolute inset-0 w-full h-full">
              {/* Identical rendering to anime image to ensure perfect geometric matching */}
              <Image
                src="/images/original.png"
                alt="Original portrait of Prathap"
                fill
                priority
                sizes="100vw"
                className="object-cover object-right saturate-[1.1] contrast-[1.05]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Soft atmospheric gradient overlays to integrate both images */}
      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-background via-background/80 to-transparent w-full md:w-3/5 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-transparent to-transparent h-1/4 pointer-events-none" />
    </div>
  );
}
