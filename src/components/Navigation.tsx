"use client";

import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { useState, useEffect, useRef } from "react";
import { scrollToSection } from "@/utils/scroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const navLinks = [
  { href: "/#hero", label: "HOME", disabled: false },
  { href: "/#about", label: "ABOUT", disabled: false },
  { href: "/#projects", label: "PROJECTS", disabled: false },
  { href: "/#skills", label: "SKILLS", disabled: false },
  { href: "/#github", label: "GITHUB", disabled: false },
  { href: "/#contact", label: "CONTACT", disabled: false },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const isClickScrolling = useRef(false);
  const currentSectionRef = useRef(activeSection);
  
  useEffect(() => {
    currentSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    navLinks.forEach(link => {
      const id = link.href.split("#")[1];
      const el = document.getElementById(id);
      if (el) {
        // Use ScrollTrigger instead of IntersectionObserver to handle pinned sections correctly
        ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
             if (self.isActive && !isClickScrolling.current) {
                if (id !== currentSectionRef.current) {
                   setActiveSection(id);
                   if (id === "hero") {
                     window.history.replaceState(null, '', window.location.pathname);
                   } else {
                     window.history.replaceState(null, '', `#${id}`);
                   }
                }
             }
          }
        });
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      // ScrollTriggers are automatically cleaned up if we killed them, but we let them persist or we could kill them all
      ScrollTrigger.getAll().forEach(st => {
         const trigger = st.vars.trigger;
         if (trigger && typeof trigger !== 'string' && 'id' in trigger && navLinks.some(l => l.href.includes(trigger.id as string))) {
            st.kill();
         }
      });
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, rawHref: string) => {
    const isHomePage = window.location.pathname === "/";
    
    if (!isHomePage) {
      // Let standard Next.js Link handle the navigation to the home page route
      return;
    }

    e.preventDefault();
    
    const id = rawHref.split("#")[1]; // gets "hero", "projects", etc.
    
    isClickScrolling.current = true;
    setActiveSection(id);
    
    if (id === "hero") {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.history.pushState(null, '', `#${id}`);
    }

    // Scroll using the centralized utility with an offset for the header
    scrollToSection(`#${id}`, -20);
    
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 1200);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add("lenis-stopped");
    } else {
      document.body.style.overflow = '';
      document.documentElement.classList.remove("lenis-stopped");
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center transition-all duration-500
          ${scrolled ? 'bg-background/20 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent'}
        `}
      >
        <Link 
          href="/" 
          className="text-xl font-bold tracking-[0.2em] text-primary-text drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] z-10 hover:text-accent-cyan transition-colors"
        >
          PRATHAP
        </Link>
        
        <div className="hidden md:flex gap-10 items-center z-10 text-[10px] tracking-[0.2em] font-semibold">
          {navLinks.map((link) => {
            const id = link.href.split("#")[1];
            const isActive = activeSection === id;
            return (
              <Link 
                key={link.label} 
                href={link.href} 
                className={`transition-colors relative group py-2
                  ${link.disabled ? 'text-secondary-text/40 cursor-not-allowed' : 
                    isActive ? 'text-accent-cyan' : 'text-primary-text/70 hover:text-primary-text'}
                `}
                aria-disabled={link.disabled}
                aria-current={isActive ? "page" : undefined}
                onClick={(e) => {
                  if (link.disabled) {
                    e.preventDefault();
                  } else {
                    handleNavClick(e, link.href);
                  }
                }}
              >
                {link.label}
                {isActive && (
                  <span className="absolute top-0 left-0 w-full h-[2px] bg-accent-cyan" />
                )}
              </Link>
            );
          })}
        </div>

        <button 
          className="md:hidden z-[60] relative focus-visible:ring-2 focus-visible:ring-accent-cyan outline-none text-xs tracking-widest font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? 'CLOSE' : 'MENU'}
        </button>
      </nav>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        links={navLinks}
        activeSection={activeSection}
        onNavClick={handleNavClick}
      />
    </>
  );
}
