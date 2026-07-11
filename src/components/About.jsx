import { motion } from "framer-motion";
import selfie from "../assets/wilson-headshot.webp";

const AboutPage = () => (
  <section className="section about-section" id="about">
    <motion.div className="section-kicker" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}><span>01</span> About</motion.div>
    <div className="about-grid">
      <motion.div className="portrait-wrap" initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .7 }}>
        <div className="portrait-frame"><img src={selfie} alt="Wilson Huang" loading="lazy" /></div>
        <span className="portrait-note">Engineer by training.<br />Builder by curiosity.</span>
      </motion.div>
      <motion.div className="about-copy" initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .7 }}>
        <h2>Different disciplines.<br /><em>One builder&apos;s mindset.</em></h2>
        <p className="lead">I&apos;m Wilson, a Software Engineer at LinkedIn building enterprise APIs and cloud products across Python, React, and Azure.</p>
        <p>My path started with biomedical engineering at the University of Florida and self-directed full-stack training through The Odin Project. Today, I work on event-driven systems, production reliability, and platform modernization—bringing a curious, systems-minded approach to every product I build.</p>
        <div className="about-tags"><span>Distributed systems</span><span>Python APIs</span><span>Azure cloud</span><span>Product engineering</span></div>
        <p className="offscreen-note">Away from the screen, you&apos;ll usually find me climbing, gaming, or sketching out the next app idea.</p>
      </motion.div>
    </div>
  </section>
);

export default AboutPage;
