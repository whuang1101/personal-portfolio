import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { startSmoothScroll } from "./lib/smoothScroll.js";
import { Chars, LocalClock } from "./components/effects.jsx";
import Header from "./components/Header.jsx";
import Cursor from "./components/Cursor.jsx";
import Intro from "./components/Intro.jsx";
import Marquee from "./components/Marquee.jsx";
import FirstPage from "./components/FirstPage.jsx";
import ExperiencePage from "./components/Experience.jsx";
import AboutPage from "./components/About.jsx";
import SkillsPage from "./components/Skills.jsx";
import ProjectsPage from "./components/Projects.jsx";
import ContactModal from "./components/ContactModal.jsx";
import useActiveSection from "./hooks/useActiveSection.js";
import { useMagnetic } from "./lib/interactions.js";

const App = () => {
  const activeSection = useActiveSection();
  const [contactOpen, setContactOpen] = useState(false);
  const [cosmicTheme, setCosmicTheme] = useState(() => {
    try {
      return window.localStorage.getItem("wh-theme") === "cosmic";
    } catch {
      return false;
    }
  });
  const [themeNotice, setThemeNotice] = useState("");
  const noticeTimer = useRef();
  // The curtain plays once per session and never under reduced motion.
  const [introActive, setIntroActive] = useState(() => {
    try {
      return (
        !window.sessionStorage.getItem("wh-intro") &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    } catch {
      return false;
    }
  });
  const finishIntro = useCallback(() => {
    setIntroActive(false);
    try {
      window.sessionStorage.setItem("wh-intro", "seen");
    } catch {
      // Session gating is best-effort.
    }
  }, []);
  const footerCta = useMagnetic();
  const calm = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });
  // Fast scrolling leans the page a fraction of a degree — type feels alive.
  const velocity = useVelocity(scrollY);
  const skewRaw = useTransform(velocity, [-1600, 1600], [-1.1, 1.1], { clamp: true });
  const skew = useSpring(skewRaw, { stiffness: 190, damping: 32 });

  useEffect(() => startSmoothScroll(), []);

  const toggleTheme = useCallback(() => {
    setCosmicTheme((current) => {
      const next = !current;
      try {
        window.localStorage.setItem("wh-theme", next ? "cosmic" : "paper");
      } catch {
        // The theme still works when storage is unavailable.
      }
      setThemeNotice(next ? "Easter egg unlocked · Night mode" : "Back to paper");
      window.clearTimeout(noticeTimer.current);
      noticeTimer.current = window.setTimeout(() => setThemeNotice(""), 2600);
      return next;
    });
  }, []);

  useEffect(() => {
    const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let progressIndex = 0;
    const listenForKonami = (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && (target.matches("input, textarea") || target.isContentEditable)) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      progressIndex = key === sequence[progressIndex] ? progressIndex + 1 : key === sequence[0] ? 1 : 0;
      if (progressIndex === sequence.length) {
        progressIndex = 0;
        toggleTheme();
      }
    };
    document.addEventListener("keydown", listenForKonami);
    console.info("%c<WH /> signal detected. Try the classic ↑ ↑ ↓ ↓ ← → ← → B A sequence.", "color:#ff4d1c;font-weight:bold");
    return () => {
      document.removeEventListener("keydown", listenForKonami);
      window.clearTimeout(noticeTimer.current);
    };
  }, [toggleTheme]);

  return (
    <div className={cosmicTheme ? "app-shell theme-cosmic" : "app-shell"}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <Cursor />
      <AnimatePresence>{introActive && <Intro onDone={finishIntro} />}</AnimatePresence>
      <AnimatePresence>{contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}</AnimatePresence>
      <AnimatePresence>
        {themeNotice && (
          <motion.div
            className="theme-toast"
            role="status"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {themeNotice}<span aria-hidden="true">■</span>
          </motion.div>
        )}
      </AnimatePresence>
      <Header onContact={() => setContactOpen(true)} activeIndex={activeSection} />
      <div className="portfolio-shell">
        <motion.main id="main-content" style={calm ? undefined : { skewY: skew }}>
          <FirstPage onThemeToggle={toggleTheme} ready={!introActive} />
          <Marquee />
          <AboutPage />
          <ExperiencePage />
          <ProjectsPage />
          <SkillsPage />
        </motion.main>
        <footer className="site-footer">
          <span className="footer-index">05 / Contact</span>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true, margin: "0px 0px -20% 0px" }}>
            <Chars text="Let’s" /> <Chars text="build" className="accent-word" delay={.12} /> <Chars text="something." delay={.2} />
          </motion.h2>
          <div className="footer-actions">
            <motion.button
              type="button"
              ref={footerCta.ref}
              style={{ x: footerCta.x, y: footerCta.y }}
              onClick={() => setContactOpen(true)}
            >
              <span>Start a conversation</span><span aria-hidden="true">↗</span>
            </motion.button>
            <a href="/Wilson-Huang-Resume.pdf" target="_blank" rel="noreferrer">View résumé ↗</a>
          </div>
          <div className="footer-bottom">
            <nav className="footer-links" aria-label="Elsewhere">
              <a href="https://github.com/whuang1101" target="_blank" rel="noreferrer">
                <span className="roll"><span>GitHub ↗</span><span aria-hidden="true">GitHub ↗</span></span>
              </a>
            </nav>
            <small>© 2026 — Wilson Huang · <LocalClock /></small>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
