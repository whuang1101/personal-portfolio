import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { scrollToSection } from "../lib/sections.js";
import { lineReveal, lineRevealTransition, useFinePointer, useCursorPosition, useMagnetic } from "../lib/interactions.js";

// The vermilion gesture drifts on scroll and leans toward the pointer — one big
// graphic move instead of an ambient background.
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

  return (
    <motion.svg
      className="hero-gesture"
      viewBox="0 0 420 640"
      fill="none"
      aria-hidden="true"
      style={{ x, y: scrollY, translateY: y }}
      initial={{ opacity: 0, scale: .94 }}
      animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: .94 }}
      transition={{ duration: 1.1, delay: .25, ease: [.22, 1, .36, 1] }}
    >
      <motion.polygon
        points="60,0 260,0 130,200 330,200 90,540 150,300 0,300"
        fill="var(--accent)"
        initial={{ y: -40, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: -40, opacity: 0 }}
        transition={{ duration: 1, delay: .35, ease: [.22, 1, .36, 1] }}
      />
      <motion.polygon
        points="250,180 420,180 300,360 420,360 250,620 300,420 210,420"
        stroke="var(--accent)"
        strokeWidth="1.5"
        fill="none"
        initial={{ y: 40, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
        transition={{ duration: 1, delay: .5, ease: [.22, 1, .36, 1] }}
      />
    </motion.svg>
  );
};

// eslint-disable-next-line react/prop-types
const FirstPage = ({ onThemeToggle, ready }) => {
  const cta = useMagnetic();

  return (
    <section className="hero" id="home">
      <HeroGesture ready={ready} />
      <div className="hero-copy">
        <motion.div className="hero-eyebrow" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: .2 }}>
          <i className="status-dot" aria-hidden="true" />Software Engineer — LinkedIn
        </motion.div>
        <motion.h1 initial="hidden" animate={ready ? "visible" : "hidden"} transition={{ staggerChildren: .08, delayChildren: .1 }}>
          <span className="line-mask"><motion.span variants={lineReveal} transition={lineRevealTransition}>Engineering</motion.span></span>
          <span className="line-mask"><motion.span variants={lineReveal} transition={lineRevealTransition}><span className="accent-word">reliable</span> systems</motion.span></span>
          <span className="line-mask"><motion.span variants={lineReveal} transition={lineRevealTransition}>people build on.</motion.span></span>
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
          <span>Current / <b>LinkedIn</b></span>
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
