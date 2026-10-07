"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string; disabled: boolean }[];
  activeSection: string;
}

export default function MobileMenu({ isOpen, onClose, links, activeSection }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(menuRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out"
      });
    } else {
      gsap.to(menuRef.current, {
        autoAlpha: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }, [isOpen]);

  return (
    <div 
      ref={menuRef}
      className="fixed inset-0 bg-background z-40 flex flex-col justify-center px-8 opacity-0 pointer-events-none invisible"
      style={{ visibility: isOpen ? 'visible' : 'hidden', pointerEvents: isOpen ? 'auto' : 'none' }}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex flex-col gap-6 text-2xl font-semibold tracking-wider">
        {links.map((link) => {
          const isActive = activeSection === link.href.substring(1);
          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (link.disabled) e.preventDefault();
                else onClose();
              }}
              className={
                link.disabled 
                  ? "opacity-30 cursor-not-allowed" 
                  : isActive 
                    ? "text-accent-cyan" 
                    : "hover:text-accent-cyan transition-colors"
              }
              aria-disabled={link.disabled}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
