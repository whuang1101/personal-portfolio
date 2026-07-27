import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header.jsx";
import TraverseRail from "./components/TraverseRail.jsx";
import FirstPage from "./components/FirstPage.jsx";
import ExperiencePage from "./components/Experience.jsx";
import AboutPage from "./components/About.jsx";
import SkillsPage from "./components/Skills.jsx";
import ProjectsPage from "./components/Projects.jsx";
import ContactModal from "./components/ContactModal.jsx";
import useActiveSection from "./hooks/useActiveSection.js";

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

  const toggleTheme = useCallback(() => {
    setCosmicTheme((current) => {
      const next = !current;
      try {
        window.localStorage.setItem("wh-theme", next ? "cosmic" : "acid");
      } catch {
        // The theme still works when storage is unavailable.
      }
      setThemeNotice(next ? "Easter egg unlocked · Cosmic mode" : "Signal restored · Acid mode");
      window.clearTimeout(noticeTimer.current);
      noticeTimer.current = window.setTimeout(() => setThemeNotice(""), 2600);
      return next;
    });
  }, []);

  useEffect(() => {
    const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let progress = 0;
    const listenForKonami = (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && (target.matches("input, textarea") || target.isContentEditable)) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      progress = key === sequence[progress] ? progress + 1 : key === sequence[0] ? 1 : 0;
      if (progress === sequence.length) {
        progress = 0;
        toggleTheme();
      }
    };
    document.addEventListener("keydown", listenForKonami);
    console.info("%c<WH /> signal detected. Try the classic ↑ ↑ ↓ ↓ ← → ← → B A sequence.", "color:#c8ff65;font-weight:bold");
    return () => {
      document.removeEventListener("keydown", listenForKonami);
      window.clearTimeout(noticeTimer.current);
    };
  }, [toggleTheme]);

  return (
    <div className={cosmicTheme ? "app-shell theme-cosmic" : "app-shell"}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="ambient-contours" aria-hidden="true">
        <i /><i /><i />
      </div>
      <AnimatePresence>{contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}</AnimatePresence>
      <AnimatePresence>
        {themeNotice && (
          <motion.div
            className="theme-toast"
            role="status"
            initial={{ opacity: 0, y: 18, scale: .96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {themeNotice}<span aria-hidden="true">✦</span>
          </motion.div>
        )}
      </AnimatePresence>
      <TraverseRail activeIndex={activeSection} />
      <div className="portfolio-shell">
        <Header onContact={() => setContactOpen(true)} activeIndex={activeSection} />
        <main id="main-content">
          <FirstPage onThemeToggle={toggleTheme} cosmicTheme={cosmicTheme} />
          <AboutPage />
          <ExperiencePage />
          <ProjectsPage />
          <SkillsPage />
        </main>
        <footer className="site-footer">
          <div>
            <span className="footer-index">05 / CONTACT</span>
            <h2>Have a route in mind?<br /><em>Let&apos;s map it.</em></h2>
          </div>
          <div className="footer-actions">
            <button type="button" onClick={() => setContactOpen(true)}>Start a conversation <span>↗</span></button>
            <a href="/Wilson-Huang-Resume.pdf" target="_blank" rel="noreferrer">View résumé ↗</a>
          </div>
          <nav className="footer-links" aria-label="Elsewhere">
            <a href="https://github.com/whuang1101" target="_blank" rel="noreferrer">GitHub ↗</a>
          </nav>
          <small>Designed &amp; built by Wilson Huang · 2026</small>
        </footer>
      </div>
    </div>
  );
};

export default App;
