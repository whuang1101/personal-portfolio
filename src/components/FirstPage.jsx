import { motion } from "framer-motion";
import { Link } from "react-scroll";

const reveal = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };

const FirstPage = () => (
  <section className="hero" id="home">
    <div className="aurora aurora-one" /><div className="aurora aurora-two" />
    <motion.div className="hero-copy" initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }}>
      <motion.div className="eyebrow" variants={reveal}><span className="status-dot" />Software Engineer at LinkedIn</motion.div>
      <motion.h1 variants={reveal}>I turn ambitious ideas into <em>human</em> digital products.</motion.h1>
      <motion.p variants={reveal}>Software engineer with a biomedical engineering lens—building enterprise APIs, event-driven systems, and reliable cloud products with Python, React, and Azure.</motion.p>
      <motion.div className="hero-actions" variants={reveal}>
        <Link className="primary-button" to="project" smooth duration={400} offset={-60}>Explore my work <span>↘</span></Link>
        <motion.a className="resume-hero" href="/Wilson-Huang-Resume.pdf" target="_blank" rel="noreferrer" whileHover={{ y: -4 }} whileTap={{ scale: .96 }}>
          <span className="resume-icon"><i /><i /><i /></span>
          <span><small>Career snapshot</small><strong>View my résumé</strong></span>
          <b>↗</b>
        </motion.a>
      </motion.div>
    </motion.div>
    <motion.aside className="hero-card" initial={{ opacity: 0, scale: .92, rotate: 3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .8, delay: .35 }}>
      <div className="hero-card-top"><span>LinkedIn · Software Engineer</span><span>2025 — now</span></div>
      <div className="code-orbit"><div className="orbit"><span>React</span><span>Python</span><span>Azure</span></div><strong>&lt;WH /&gt;</strong></div>
      <div className="hero-stats"><div><strong>5</strong><span>featured builds</span></div><div><strong>JS + PY</strong><span>core languages</span></div></div>
    </motion.aside>
    <div className="scroll-cue"><span>Scroll to discover</span><i /></div>
  </section>
);

export default FirstPage;
