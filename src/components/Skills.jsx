import { motion } from "framer-motion";
import { fadeUp, inView } from "../lib/interactions.js";
import { Scramble } from "./effects.jsx";

const groups = [
  { number: "01", title: "Languages", featured: ["Python", "SQL", "TypeScript"], items: ["JavaScript", "Java", "Swift", "MATLAB"] },
  { number: "02", title: "Backend & API", featured: ["FastAPI", "Flask", "SQLAlchemy"], items: ["Pydantic", "REST", "OpenAPI", "OAuth 2.0", "Node.js"] },
  { number: "03", title: "Cloud & Data", featured: ["Azure", "Airflow", "Docker"], items: ["Azure SQL", "Redis", "Postgres", "MongoDB", "GitHub Actions"] },
  { number: "04", title: "Product & Practice", featured: ["React", "System design", "TDD"], items: ["Distributed systems", "pytest", "RCA", "CI/CD", "Linux"] },
];

const SkillsPage = () => (
  <section className="section skills-section" id="skills">
    <motion.div className="section-kicker" variants={fadeUp} initial="hidden" whileInView="visible" viewport={inView}>
      <span>04 /</span> <Scramble text="Skills" />
    </motion.div>
    <div className="section-heading stacked">
      <h2>A toolkit for the whole stack.</h2>
      <p>From the interface through the API and into cloud infrastructure, I work across the system rather than one isolated layer.</p>
    </div>
    <div className="skill-groups">
      {groups.map((group, index) => (
        <motion.article
          key={group.title}
          className="skill-group"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          transition={{ delay: index * .06 }}
        >
          <header><b>{group.number}</b><span>Capability</span></header>
          <h3>{group.title}</h3>
          <ul className="spec-list">
            {group.featured.map((item) => <li className="spec-featured" key={item}>{item}</li>)}
            {group.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </motion.article>
      ))}
    </div>
    <motion.aside className="ai-workflow" variants={fadeUp} initial="hidden" whileInView="visible" viewport={inView} transition={{ duration: .5 }}>
      <span className="micro-label">Assisted engineering</span>
      <h3>Codex + Claude</h3>
      <p>I use Codex and Claude to plan, build, debug, and refine personal projects while keeping architecture and implementation decisions grounded in engineering fundamentals.</p>
      <div className="ai-workflow-tags">
        {["Planning", "Implementation", "Debugging", "Iteration"].map((item) => (
          <span className="chip-outline" key={item}>{item}</span>
        ))}
      </div>
    </motion.aside>
  </section>
);

export default SkillsPage;
