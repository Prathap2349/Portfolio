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

      // Do not update scroll-spy if user just clicked a nav link
      if (isClickScrolling.current) return;

      const viewportCenter = window.innerHeight / 2;
      let newActiveSection = currentSectionRef.current;

      // Force contact if at absolute bottom of page
      if (window.innerHeight + Math.round(window.scrollY) >= document.documentElement.scrollHeight - 50) {
        newActiveSection = "contact";
      } else {
        // Find which section occupies the viewport center
        for (const link of navLinks) {
          const id = link.href.substring(1);
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            // A section is active if it spans across the viewport center
            if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
              newActiveSection = id;
              break; // Found it
            }
          }
        }
      }

      if (newActiveSection !== currentSectionRef.current) {
        setActiveSection(newActiveSection);
        if (newActiveSection === "hero") {
          window.history.replaceState(null, '', window.location.pathname);
        } else {
          window.history.replaceState(null, '', `#${newActiveSection}`);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Give DOM time to render, then run once
    const timeoutId = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
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

    // Smooth scroll manually to respect the offset and Lenis
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 100; // Match the scroll-padding-top
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }

    setTimeout(() => {
      isClickScrolling.current = false;
    }, 1000); // 1s is usually enough for a smooth scroll to finish
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
      />
    </>
  );
}
