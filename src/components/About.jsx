import { motion } from "framer-motion";
import selfie from "../assets/wilson-headshot.webp";

const AboutPage = () => (
  <section className="section about-section" id="about">
    <motion.div className="section-kicker" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}><span>01</span> Field note / About</motion.div>
    <div className="about-grid">
      <motion.div className="portrait-wrap" initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .7 }}>
        <div className="portrait-frame">
          <img src={selfie} alt="Wilson Huang" loading="lazy" />
          <span className="portrait-coordinate">37.3688° N / 122.0363° W</span>
        </div>
        <span className="portrait-index">FIG. 01 / WILSON HUANG</span>
      </motion.div>
      <motion.div className="about-copy" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .7 }}>
        <h2>Different terrain.<br /><em>One builder&apos;s mindset.</em></h2>
        <p className="lead">I&apos;m Wilson, a Software Engineer at LinkedIn building enterprise APIs and cloud products across Python, React, and Azure.</p>
        <p>My path started with biomedical engineering at the University of Florida and self-directed full-stack training through The Odin Project. Today, I work on event-driven systems, production reliability, and platform modernization—bringing a curious, systems-minded approach to every product I build.</p>
        <div className="about-ledger">
          <div><span>Practice</span><strong>Reliable systems</strong><small>APIs · distributed delivery · cloud</small></div>
          <div><span>Perspective</span><strong>Biomedical engineering</strong><small>Human context · systems thinking</small></div>
        </div>
      </motion.div>
    </div>
    <motion.div className="personal-field-notes" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <span>OFFLINE SIGNALS</span>
      <p>Climbing for the route reading.</p>
      <p>Games for the systems.</p>
      <p>Racquet sports for the rally.</p>
    </motion.div>
  </section>
);

export default AboutPage;
