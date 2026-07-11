import { motion } from "framer-motion";

const groups = [
  { number: "01", title: "Frontend", featured: "React · JavaScript · Tailwind", items: ["Vue", "HTML/CSS", "Figma"] },
  { number: "02", title: "Backend", featured: "Python · FastAPI · Flask", items: ["Node.js", "Express", "MongoDB"] },
  { number: "03", title: "Cloud", featured: "Azure · Git · REST APIs", items: ["Cloud services", "Jest", "Django"] },
];

const SkillsPage = () => (
  <section className="section skills-section" id="skills">
    <div className="section-kicker"><span>02</span> Toolkit</div>
    <div className="section-heading"><h2>From interface<br />to <em>cloud.</em></h2><p>A full-stack toolkit spanning modern frontend, Python APIs, backend systems, and Azure cloud capabilities.</p></div>
    <div className="skill-grid">
      {groups.map((group, index) => (
        <motion.article key={group.title} className="skill-panel" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .12 }} whileHover={{ y: -8 }}>
          <span className="panel-number">{group.number}</span><h3>{group.title}</h3><strong>{group.featured}</strong>
          <div>{group.items.map(item => <span key={item}>{item}</span>)}</div>
        </motion.article>
      ))}
    </div>
  </section>
);

export default SkillsPage;
