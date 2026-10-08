export function scrollToSection(id: string, offset = 0) {
  const target = document.querySelector(id);
  if (!target) return;

  // @ts-ignore - window.lenis is dynamically added
  if (window.lenis) {
    // @ts-ignore - window.lenis is dynamically added
    window.lenis.scrollTo(id, { offset, duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  } else {
    const targetPosition = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  }
}
