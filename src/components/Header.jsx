import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_SECTIONS, SECTIONS, scrollToSection } from "../lib/sections.js";
import { useMagnetic } from "../lib/interactions.js";

// eslint-disable-next-line react/prop-types
const Header = ({ onContact, activeIndex }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const cta = useMagnetic(0.22, 60);
  // The footer has no nav entry, so the last section that does stays lit rather than
  // leaving the whole nav unhighlighted at the bottom of the page.
  const activeId = SECTIONS.slice(0, activeIndex + 1).reverse().find((section) => section.nav)?.id;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const jump = (selector) => () => {
    setOpen(false);
    scrollToSection(selector);
  };

  return (
    <header className={scrolled ? "site-header scrolled" : "site-header"}>
      <nav className="nav-shell" aria-label="Main navigation">
        <button className="brand" type="button" onClick={jump("#home")} aria-label="Wilson Huang, back to top">
          <span className="brand-mark">■</span>
          <span className="brand-copy"><strong>Wilson Huang</strong><small>— Software Engineer</small></span>
        </button>
        <div className="desktop-nav">
          {NAV_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className={section.id === activeId ? "active" : undefined}
              aria-current={section.id === activeId ? "true" : undefined}
              onClick={jump(section.selector)}
            >
              <span className="roll"><span>{section.nav}</span><span aria-hidden="true">{section.nav}</span></span>
              {section.id === activeId && (
                <motion.i className="nav-active-bar" layoutId="nav-bar" aria-hidden="true" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
              )}
            </button>
          ))}
        </div>
        <div className="nav-actions">
          <a className="resume-nav" href="/Wilson-Huang-Resume.pdf" target="_blank" rel="noreferrer">
            <span className="roll"><span>Résumé ↗</span><span aria-hidden="true">Résumé ↗</span></span>
          </a>
          <motion.button className="nav-cta" type="button" ref={cta.ref} style={{ x: cta.x, y: cta.y }} onClick={onContact}>
            Say hello
          </motion.button>
        </div>
        <button className="menu-button" type="button" aria-label="Toggle navigation menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-nav" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }}>
            {NAV_SECTIONS.map((section, index) => (
              <motion.button
                key={section.id}
                type="button"
                onClick={jump(section.selector)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .06 + index * .05, ease: [.22, 1, .36, 1] }}
              >
                <span>0{index + 1}</span>{section.nav}
              </motion.button>
            ))}
            <a className="resume-mobile" href="/Wilson-Huang-Resume.pdf" target="_blank" rel="noreferrer"><span>06</span>Résumé <i>↗</i></a>
            <button type="button" onClick={() => { setOpen(false); onContact(); }}>Start a conversation ↗</button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
