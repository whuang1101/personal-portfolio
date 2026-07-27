// One ordered list of route stops, shared by the header nav, the traverse rail,
// and the scroll-position hook so they can never disagree with each other.
export const SECTIONS = [
  { id: "home", label: "Start", nav: "Index", selector: "#home" },
  { id: "about", label: "About", nav: "About", selector: "#about" },
  { id: "experience", label: "Experience", nav: "Experience", selector: "#experience" },
  { id: "project", label: "Work", nav: "Work", selector: "#project" },
  { id: "skills", label: "Toolkit", nav: "Toolkit", selector: "#skills" },
  { id: "contact", label: "Contact", selector: ".site-footer" },
];

export const NAV_SECTIONS = SECTIONS.filter((section) => section.nav);

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// scroll-padding-top in global.css keeps the target clear of the fixed header.
export const scrollToSection = (selector) => {
  document.querySelector(selector)?.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
};
