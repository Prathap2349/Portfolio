export function scrollToSection(id: string, offset = 0) {
  const target = document.querySelector(id);
  if (!target) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenis = (window as any).lenis;

  if (lenis && !prefersReducedMotion) {
    lenis.scrollTo(id, { offset, duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  } else {
    const targetPosition = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({
      top: targetPosition,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  }
}
