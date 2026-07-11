import { motion } from "framer-motion";

const groups = [
  { number: "01", title: "Frontend", featured: "React · JavaScript · Tailwind", items: ["Vue", "HTML/CSS", "Figma"] },
  { number: "02", title: "Backend", featured: "Python · FastAPI · Flask", items: ["Node.js", "Express", "MongoDB"] },
  { number: "03", title: "Cloud", featured: "Azure · Git · REST APIs", items: ["Cloud services", "Jest", "Django"] },
];

const SkillsPage = () => (
  <section className="section skills-section" id="skills">
    <div className="section-kicker"><span>04</span> Toolkit</div>
    <div className="section-heading"><h2>From interface<br />to <em>cloud.</em></h2><p>A full-stack toolkit spanning modern frontend, Python APIs, Azure cloud capabilities, and AI-assisted engineering workflows.</p></div>
    <div className="skill-grid">
      {groups.map((group, index) => (
        <motion.article key={group.title} className="skill-panel" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .12 }} whileHover={{ y: -8 }}>
          <span className="panel-number">{group.number}</span><h3>{group.title}</h3><strong>{group.featured}</strong>
          <div>{group.items.map(item => <span key={item}>{item}</span>)}</div>
        </motion.article>
      ))}
    </div>
    <motion.aside className="ai-workflow" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }} transition={{ duration: .6 }}>
      <span className="ai-mark" aria-hidden="true">AI</span>
      <div className="ai-workflow-title"><small>AI-assisted engineering</small><strong>Codex + Claude</strong></div>
      <p>I&apos;m proficient with Codex and Claude, using them to plan, build, debug, and refine personal projects while keeping architecture and implementation decisions grounded in engineering fundamentals.</p>
      <div className="ai-workflow-tags"><span>Planning</span><span>Implementation</span><span>Debugging</span><span>Iteration</span></div>
    </motion.aside>
  </section>
);

export default SkillsPage;
