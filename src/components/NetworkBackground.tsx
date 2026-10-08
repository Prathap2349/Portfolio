"use client";

import { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseVx: number;
  baseVy: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.baseVx = (Math.random() - 0.5) * 0.4; // Slower for calm feel
    this.baseVy = (Math.random() - 0.5) * 0.4;
    this.vx = this.baseVx;
    this.vy = this.baseVy;
    this.radius = Math.random() * 1.5 + 0.5;
  }

  update(canvasWidth: number, canvasHeight: number, scrollMultiplier: number) {
    this.x += this.vx * scrollMultiplier;
    this.y += this.vy * scrollMultiplier;

    if (this.x < 0 || this.x > canvasWidth) this.vx = -this.vx;
    if (this.y < 0 || this.y > canvasHeight) this.vy = -this.vy;
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

class Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 300;
    this.alpha = 0.5;
  }

  update() {
    this.radius += 8;
    this.alpha -= 0.015;
  }

  draw(ctx: CanvasRenderingContext2D, colorRGB: string) {
    if (this.alpha <= 0) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${colorRGB}, ${this.alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const isVisible = useRef(true);
  const isTouchDevice = useRef(false);
  const scrollSpeed = useRef(1);
  const ripples = useRef<Ripple[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    isTouchDevice.current = window.matchMedia("(pointer: coarse)").matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let resizeTimeout: NodeJS.Timeout;
    let lastScrollY = window.scrollY;

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      // Kept low for cheap O(n^2) loop on weak devices
      const particleDensity = isTouchDevice.current ? 40 : 25;
      const particleCount = Math.min(Math.floor(rect.width / particleDensity), isTouchDevice.current ? 30 : 60);
      
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(rect.width, rect.height));
      }
    };

    const animate = () => {
      if (!isVisible.current) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      
      // Decay scroll speed back to 1
      scrollSpeed.current += (1 - scrollSpeed.current) * 0.05;

      // Color shift based on Y scroll (Cyan to Warm Orange)
      const scrollRatio = Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1), 1);
      const r = Math.floor(111 + (255 - 111) * scrollRatio);
      const g = Math.floor(231 + (184 - 231) * scrollRatio);
      const b = Math.floor(255 + (107 - 255) * scrollRatio);
      const colorRGB = `${r}, ${g}, ${b}`;
      const color = `rgba(${colorRGB}, 0.5)`;
      
      // Draw mouse glow
      if (!isTouchDevice.current && mouseRef.current.x !== -1000) {
        const gradient = ctx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 400
        );
        gradient.addColorStop(0, `rgba(${colorRGB}, 0.1)`);
        gradient.addColorStop(1, `rgba(${colorRGB}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 400, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Ripples
      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const ripple = ripples.current[i];
        ripple.update();
        ripple.draw(ctx, colorRGB);
        if (ripple.alpha <= 0) ripples.current.splice(i, 1);
      }
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(rect.width, rect.height, scrollSpeed.current);
        particles[i].draw(ctx, color);
        
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = Math.max(0, Math.min(0.2 * (1 - distance / 120), 0.2));
            ctx.strokeStyle = `rgba(${colorRGB}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        
        // Push away from ripples
        for (const ripple of ripples.current) {
           const dx = particles[i].x - ripple.x;
           const dy = particles[i].y - ripple.y;
           const dist = Math.sqrt(dx * dx + dy * dy);
           if (Math.abs(dist - ripple.radius) < 20) {
              particles[i].x += (dx / dist) * 2;
              particles[i].y += (dy / dist) * 2;
           }
        }
        
        if (!isTouchDevice.current) {
          const mouseDx = particles[i].x - mouseRef.current.x;
          const mouseDy = particles[i].y - mouseRef.current.y;
          const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
          
          if (mouseDistance < 250) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            const alpha = Math.max(0, Math.min(0.4 * (1 - mouseDistance / 250), 0.4));
            ctx.strokeStyle = `rgba(${colorRGB}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Interaction
            particles[i].x -= mouseDx * 0.02;
            particles[i].y -= mouseDy * 0.02;
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(init, 200);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isTouchDevice.current) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      };
    };
    
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = Math.abs(currentScroll - lastScrollY);
      scrollSpeed.current = Math.min(scrollSpeed.current + delta * 0.05, 5); // Max speed 5x
      lastScrollY = currentScroll;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripples.current.push(new Ripple(e.clientX - rect.left, e.clientY - rect.top));
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible.current = entry.isIntersecting;
      });
    });
    observer.observe(canvas);

    init();
    animate();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("click", handleClick);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60"
      aria-hidden="true"
    />
  );
}
