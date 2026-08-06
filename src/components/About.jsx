import { motion } from "framer-motion";
import selfie from "../assets/wilson-headshot.webp";
import { fadeUp, inView } from "../lib/interactions.js";

const AboutPage = () => (
  <section className="section about-section" id="about">
    <motion.div className="section-kicker" variants={fadeUp} initial="hidden" whileInView="visible" viewport={inView}>
      <span>01 /</span> About
    </motion.div>
    <div className="about-grid">
      <motion.div
        className="portrait-wrap"
        initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
        whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
        viewport={inView}
        transition={{ duration: .9, ease: [.22, 1, .36, 1] }}
      >
        <div className="portrait-frame">
          <img src={selfie} alt="Wilson Huang" loading="lazy" />
        </div>
        <div className="portrait-caption"><span>Fig. 01 — Wilson Huang</span><span>Sunnyvale, CA</span></div>
      </motion.div>
      <motion.div className="about-copy" variants={fadeUp} initial="hidden" whileInView="visible" viewport={inView} transition={{ duration: .6 }}>
        <h2>Different terrain. <span className="accent-word">One</span> builder&apos;s mindset.</h2>
        <p className="lead">I&apos;m Wilson, a Software Engineer at LinkedIn building enterprise APIs and cloud products across Python, React, and Azure.</p>
        <p>My path started with biomedical engineering at the University of Florida and self-directed full-stack training through The Odin Project. Today, I work on event-driven systems, production reliability, and platform modernization—bringing a curious, systems-minded approach to every product I build.</p>
        <div className="about-ledger">
          <div><span>Practice</span><div><strong>Reliable systems</strong><small>APIs · distributed delivery · cloud</small></div></div>
          <div><span>Perspective</span><div><strong>Biomedical engineering</strong><small>Human context · systems thinking</small></div></div>
        </div>
      </motion.div>
    </div>
    <motion.div className="offline-line" variants={fadeUp} initial="hidden" whileInView="visible" viewport={inView}>
      <span>Off the clock /</span>
      <span><b>Climbing</b> for the route reading</span>
      <span><b>Games</b> for the systems</span>
      <span><b>Racquet sports</b> for the rally</span>
    </motion.div>
  </section>
);

export default AboutPage;
