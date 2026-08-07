import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { scrollToSection } from "../lib/sections.js";
import { useFinePointer, useCursorPosition, useMagnetic } from "../lib/interactions.js";
import { Chars } from "./effects.jsx";

// One graphic move instead of an ambient background: two routes carrying the
// same traffic — a live path and a standby path that rejoin downstream. The
// motif is redundancy, which is what the headline actually claims; a lightning
// bolt would have promised the opposite of reliability.
// eslint-disable-next-line react/prop-types
const HeroGesture = ({ ready }) => {
  const fine = useFinePointer();
  const { scrollYProgress } = useScroll();
  const pointer = useCursorPosition({ stiffness: 90, damping: 24, mass: 1 });
  const scrollY = useTransform(scrollYProgress, [0, 0.3], [0, -90]);
  const leanX = useTransform(pointer.x, [0, typeof window === "undefined" ? 1440 : window.innerWidth], [22, -22]);
  const leanY = useTransform(pointer.y, [0, typeof window === "undefined" ? 900 : window.innerHeight], [16, -16]);
  const x = useSpring(fine ? leanX : 0, { stiffness: 60, damping: 20 });
  const y = useSpring(fine ? leanY : 0, { stiffness: 60, damping: 20 });

  // The wrapper owns the entrance opacity so the stylesheet can still dial the
  // artwork back on small screens; framer's inline opacity would win otherwise.
  return (
    <motion.div
      className="hero-gesture"
      aria-hidden="true"
      style={{ x, y: scrollY, translateY: y }}
      initial={{ opacity: 0, scale: .94 }}
      animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: .94 }}
      transition={{ duration: 1.1, delay: .25, ease: [.22, 1, .36, 1] }}
    >
    <svg className="hero-gesture-art" viewBox="0 0 380 620" fill="none">
      {/* live route — runs off the right edge rather than sitting inside the page */}
      <motion.path
        d="M46 -20 V150 H196 V340 H96 V486 H392"
        stroke="var(--accent)"
        strokeWidth="30"
        strokeLinecap="butt"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: ready ? 1 : 0 }}
        transition={{ duration: 1.5, delay: .3, ease: [.22, 1, .36, 1] }}
      />
      {/* standby route — same journey, different path */}
      <motion.path
        d="M126 -20 V236 H302 V430 H176 V566 H392"
        stroke="var(--accent)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: ready ? 1 : 0 }}
        transition={{ duration: 1.7, delay: .5, ease: [.22, 1, .36, 1] }}
      />
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: .6, delay: 1.5 }}
      >
        <rect x="296" y="424" width="12" height="12" fill="var(--accent)" />
        <rect x="170" y="560" width="12" height="12" fill="var(--accent)" />
        <rect x="120" y="230" width="12" height="12" fill="var(--accent)" />
      </motion.g>
    </svg>
    </motion.div>
  );
};

// eslint-disable-next-line react/prop-types
const FirstPage = ({ onThemeToggle, ready }) => {
  const cta = useMagnetic();

  return (
    <section className="hero" id="home">
      <HeroGesture ready={ready} />
      <div className="hero-copy">
        <motion.h1 initial="hidden" animate={ready ? "visible" : "hidden"}>
          <span className="h1-line"><Chars text="Engineering" delay={.05} /></span>
          <span className="h1-line"><Chars text="reliable" className="accent-word" delay={.22} /> <Chars text="systems" delay={.34} /></span>
          <span className="h1-line"><Chars text="people build on." delay={.45} /></span>
        </motion.h1>
        <div className="hero-lower">
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ delay: .55 }}>
            <motion.button
              className="primary-button"
              type="button"
              ref={cta.ref}
              style={{ x: cta.x, y: cta.y }}
              onClick={() => scrollToSection("#project")}
            >
              <span>Selected work</span><span aria-hidden="true">↘</span>
            </motion.button>
            <a className="text-link" href="/Wilson-Huang-Resume.pdf" target="_blank" rel="noreferrer">Résumé ↗</a>
          </motion.div>
          <motion.p className="hero-sub" initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }} transition={{ delay: .45 }}>
            I&apos;m Wilson, a software engineer building enterprise APIs, event-driven workflows, and dependable cloud products across Python, React, and Azure.
          </motion.p>
        </div>
        <motion.div className="hero-facts" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: .65 }}>
          <span><i className="status-dot" aria-hidden="true" />Current / <b>LinkedIn</b></span>
          <span>Focus / <b>APIs · Cloud · Reliability</b></span>
          <span>Base / <b>Sunnyvale, CA</b></span>
        </motion.div>
      </div>
      <motion.button
        className="hero-orb"
        type="button"
        onClick={onThemeToggle}
        aria-label="Toggle hidden portfolio theme"
        title="A hidden signal"
        whileHover={{ scale: 1.6, rotate: 45 }}
        whileTap={{ scale: .9 }}
      />
      <div className="scroll-cue"><span>Scroll</span><i /></div>
    </section>
  );
};

export default FirstPage;
