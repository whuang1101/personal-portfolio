// One ordered list of page sections, shared by the header nav and the
// scroll-position hook so they can never disagree with each other.
export const SECTIONS = [
  { id: "home", label: "Start", nav: "Home", selector: "#home" },
  { id: "about", label: "About", nav: "About", selector: "#about" },
  { id: "experience", label: "Experience", nav: "Experience", selector: "#experience" },
  { id: "project", label: "Work", nav: "Work", selector: "#project" },
  { id: "skills", label: "Toolkit", nav: "Skills", selector: "#skills" },
  { id: "contact", label: "Contact", selector: ".site-footer" },
];

export const NAV_SECTIONS = SECTIONS.filter((section) => section.nav);

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// scroll-padding-top in global.css keeps the target clear of the fixed header.
// When Lenis is running, anchor jumps route through it so they share the same
// inertia curve as wheel scrolling; otherwise fall back to native behavior.
export const scrollToSection = async (selector) => {
  const target = document.querySelector(selector);
  if (!target) return;
  const { getLenis } = await import("./smoothScroll.js");
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset: -90, duration: 1.2 });
    return;
  }
  target.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
};
