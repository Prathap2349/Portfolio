"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { profile } from "@/data/profile";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string; disabled: boolean }[];
  activeSection: string;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

export default function MobileMenu({ isOpen, onClose, links, activeSection, onNavClick }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isOpen) return;
    
    // Focus trap logic
    const focusableElements = menuRef.current?.querySelectorAll('a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select') as NodeListOf<HTMLElement>;
    if (!focusableElements || focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus the first element when menu opens
    firstElement.focus();
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col pt-32 px-6 md:hidden touch-none"
      aria-modal="true"
      role="dialog"
      aria-label="Mobile Navigation Menu"
      ref={menuRef}
    >
      <div className="flex flex-col gap-8 text-2xl font-bold tracking-widest">
        {links.map((link) => {
          const isActive = activeSection === link.href.split("#")[1];
          return (
            <Link 
              key={link.label}
              href={link.href}
              className={`transition-colors ${link.disabled ? 'text-secondary-text/40' : isActive ? 'text-accent-cyan' : 'text-primary-text'}`}
              onClick={(e) => {
                if (link.disabled) {
                  e.preventDefault();
                } else {
                  onNavClick(e, link.href);
                  onClose();
                }
              }}
              aria-disabled={link.disabled}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto mb-12 flex flex-col gap-6 text-sm">
        <a 
          href={profile.social.resume} 
          target="_blank"
          rel="noreferrer"
          className="text-primary-text border border-white/10 text-center py-4 rounded-full font-semibold tracking-widest uppercase hover:bg-white/5 transition-colors"
          onClick={onClose}
        >
          Download Resume
        </a>
        <div className="flex justify-between items-center px-4 text-xs tracking-widest text-secondary-text">
          <a href={profile.social.github} target="_blank" rel="noreferrer" className="hover:text-accent-cyan transition-colors uppercase">GitHub</a>
          <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent-cyan transition-colors uppercase">LinkedIn</a>
          <a href={`mailto:${profile.social.email}`} className="hover:text-accent-cyan transition-colors uppercase">Email</a>
        </div>
      </div>
    </div>
  );
}
