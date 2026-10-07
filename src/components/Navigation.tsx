"use client";

import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  { href: "#hero", label: "HOME", disabled: false },
  { href: "#about", label: "ABOUT", disabled: false },
  { href: "#building", label: "BUILDING", disabled: false },
  { href: "#github", label: "GITHUB", disabled: false },
  { href: "#skills", label: "SKILLS", disabled: false },
  { href: "#projects", label: "PROJECTS", disabled: false },
  { href: "#contact", label: "CONTACT", disabled: false },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isClickScrolling = useRef(false);
  const currentSectionRef = useRef(activeSection);
  
  // Keep ref in sync
  useEffect(() => {
    currentSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -50% 0px",
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isClickScrolling.current) return;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id && id !== currentSectionRef.current) {
            setActiveSection(id);
            if (id === "hero") {
              window.history.replaceState(null, '', window.location.pathname);
            } else {
              window.history.replaceState(null, '', `#${id}`);
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navLinks.forEach(link => {
      const id = link.href.substring(1);
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    
    isClickScrolling.current = true;
    setActiveSection(id);
    
    // Update URL immediately for responsive feel
    if (id === "hero") {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      window.history.pushState(null, '', `#${id}`);
    }

    const headerOffset = 100;
    
    // Check if Lenis instance is available globally
    const lenis = (window as any).lenis;
    
    if (lenis) {
      // Use Lenis for synchronized scrolling
      lenis.scrollTo(`#${id}`, {
        offset: -headerOffset,
        onComplete: () => {
          isClickScrolling.current = false;
        }
      });
    } else {
      // Fallback for native smooth scrolling (e.g. reduced motion)
      const el = document.getElementById(id);
      if (el) {
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        // In fallback, we unfortunately still need a timeout
        setTimeout(() => {
          isClickScrolling.current = false;
        }, 1000);
      } else {
        isClickScrolling.current = false;
      }
    }
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

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const lenisStopped = document.documentElement.classList;
      lenisStopped.add("lenis-stopped");
    } else {
      document.body.style.overflow = '';
      const lenisStopped = document.documentElement.classList;
      lenisStopped.remove("lenis-stopped");
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
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-10 items-center z-10 text-[10px] tracking-[0.2em] font-semibold">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
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
                    handleNavClick(e, link.href.substring(1));
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

        {/* Mobile Nav Button */}
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
