import { motion } from "framer-motion";
import InteractiveField from "./InteractiveField.jsx";
import { scrollToSection } from "../lib/sections.js";

const reveal = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const trackAtlas = (event) => {
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  event.currentTarget.style.setProperty("--atlas-x", `${(x - 0.5) * 14}px`);
  event.currentTarget.style.setProperty("--atlas-y", `${(y - 0.5) * 11}px`);
  event.currentTarget.style.setProperty("--atlas-light-x", `${x * 100}%`);
  event.currentTarget.style.setProperty("--atlas-light-y", `${y * 100}%`);
};

const resetAtlas = (event) => {
  event.currentTarget.style.setProperty("--atlas-x", "0px");
  event.currentTarget.style.setProperty("--atlas-y", "0px");
};

// eslint-disable-next-line react/prop-types
const FirstPage = ({ onThemeToggle, cosmicTheme }) => (
  <section className="hero" id="home">
    <InteractiveField />
    <div className="hero-court" aria-hidden="true"><i /><i /></div>
    <motion.div className="hero-copy" initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
      <motion.div className="hero-hud" variants={reveal}>
        <span><i className="status-dot" />Current / LinkedIn</span>
        <span>Focus / APIs · Cloud · Reliability</span>
        <span>Base / Sunnyvale, CA</span>
      </motion.div>
      <motion.h1 variants={reveal}>Engineering reliable systems.<br /><em>Exploring better routes.</em></motion.h1>
      <motion.p variants={reveal}>I&apos;m Wilson, a software engineer building enterprise APIs, event-driven workflows, and dependable cloud products across Python, React, and Azure.</motion.p>
      <motion.div className="hero-actions" variants={reveal}>
        <button className="primary-button" type="button" onClick={() => scrollToSection("#experience")}>Follow the career route <span>↘</span></button>
        <a className="text-link" href="/Wilson-Huang-Resume.pdf" target="_blank" rel="noreferrer">Download résumé <span>↗</span></a>
      </motion.div>
    </motion.div>
    <motion.aside className="hero-atlas" data-pointer-reactive aria-label="Wilson's engineering route" onPointerMove={trackAtlas} onPointerLeave={resetAtlas} initial={{ opacity: 0, scale: .96, x: 28 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: .85, delay: .2, ease: [.22, 1, .36, 1] }}>
      <div className="atlas-head"><span>ROUTE / 01</span><span>LIVE FIELD NOTES</span><b>2025—NOW</b></div>
      <svg className="atlas-map" viewBox="0 0 640 520" role="img" aria-labelledby="route-map-title">
        <title id="route-map-title">A stylized topographic route connecting API, events, cloud, and product engineering</title>
        <g className="contour-lines">
          <path d="M-40 92C63 18 189 36 244 103s121 78 191 18 167-48 246 5" />
          <path d="M-23 126C70 52 176 71 228 133s132 79 207 20 156-43 228 2" />
          <path d="M-10 163C70 91 163 105 216 165s135 78 215 23 153-40 221 5" />
          <path d="M-34 332c98-71 197-56 249 7s127 77 204 17 168-42 239 10" />
          <path d="M-55 373c111-70 217-50 265 13s125 72 201 17 166-38 244 17" />
          <path d="M-41 414c103-64 205-46 257 17s124 68 199 14 153-28 226 24" />
        </g>
        <path className="route-shadow" d="M92 444C139 392 129 334 198 304s90-85 135-104 96-6 120-61 60-61 95-86" />
        <motion.path className="route-path" d="M92 444C139 392 129 334 198 304s90-85 135-104 96-6 120-61 60-61 95-86" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: .6, ease: "easeInOut" }} />
        <g className="route-points">
          <circle cx="92" cy="444" r="7" /><circle cx="198" cy="304" r="7" /><circle cx="333" cy="200" r="7" /><circle cx="453" cy="139" r="7" />
        </g>
        <g className="map-labels">
          <text x="66" y="476">REST / API</text>
          <text x="158" y="286">EVENTS</text>
          <text x="294" y="182">AZURE</text>
          <text x="420" y="119">PRODUCT</text>
        </g>
      </svg>
      <motion.button className="summit-marker" type="button" onClick={onThemeToggle} aria-label="Toggle hidden portfolio theme" title="A hidden route" animate={{ rotate: cosmicTheme ? 360 : 0, scale: cosmicTheme ? [1, 1.08, 1] : 1 }} transition={{ duration: .7 }} whileHover={{ scale: 1.08 }} whileTap={{ scale: .94 }}>
        <span>&lt;WH /&gt;</span><small>SUMMIT</small>
      </motion.button>
      <div className="atlas-foot">
        <span>ALT 001 / SYSTEMS</span>
        <p>Biomedical perspective.<br />Engineering discipline.</p>
        <div><i /><i /><i /><i /></div>
      </div>
    </motion.aside>
    <div className="scroll-cue"><span>Scroll / Traverse</span><i /></div>
  </section>
);

export default FirstPage;
