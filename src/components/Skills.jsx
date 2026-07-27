import { motion } from "framer-motion";

const groups = [
  { number: "01", title: "Languages", featured: "Python · SQL · TypeScript", items: ["JavaScript", "Java", "Swift", "MATLAB"] },
  { number: "02", title: "Backend & API", featured: "FastAPI · Flask · SQLAlchemy", items: ["Pydantic", "REST", "OpenAPI", "OAuth 2.0", "Node.js"] },
  { number: "03", title: "Cloud & Data", featured: "Azure · Airflow · Docker", items: ["Azure SQL", "Redis", "Postgres", "MongoDB", "GitHub Actions"] },
  { number: "04", title: "Product & Practice", featured: "React · System design · TDD", items: ["Distributed systems", "pytest", "RCA", "CI/CD", "Linux"] },
];

const SkillsPage = () => (
  <section className="section skills-section" id="skills">
    <div className="section-kicker"><span>04</span> Equipment / Toolkit</div>
    <div className="section-heading">
      <h2>A toolkit for the<br /><em>whole route.</em></h2>
      <p>From the interface through the API and into cloud infrastructure, I work across the system rather than one isolated layer.</p>
    </div>
    <div className="skill-grid">
      {groups.map((group, index) => (
        <motion.article key={group.title} className="skill-panel" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }}>
          <header><span>{group.number}</span><small>CAPABILITY</small></header>
          <h3>{group.title}</h3>
          <strong>{group.featured}</strong>
          <div>{group.items.map((item) => <span key={item}>{item}</span>)}</div>
        </motion.article>
      ))}
    </div>
    <motion.aside className="ai-workflow" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .6 }}>
      <span className="ai-mark" aria-hidden="true">AI</span>
      <div className="ai-workflow-title"><small>ASSISTED ENGINEERING</small><strong>Codex + Claude</strong></div>
      <p>I use Codex and Claude to plan, build, debug, and refine personal projects while keeping architecture and implementation decisions grounded in engineering fundamentals.</p>
      <div className="ai-workflow-tags"><span>Planning</span><span>Implementation</span><span>Debugging</span><span>Iteration</span></div>
    </motion.aside>
  </section>
);

export default SkillsPage;
