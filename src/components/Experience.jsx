import { motion } from "framer-motion";

const highlights = [
  {
    number: "01",
    title: "Enterprise APIs",
    copy: "Building and owning integration systems across FastAPI, SQLAlchemy, Azure SQL, and Azure API Management.",
  },
  {
    number: "02",
    title: "Distributed delivery",
    copy: "Designing authorization, event-driven approval pipelines, and reliable delivery guarantees for production workflows.",
  },
  {
    number: "03",
    title: "Cloud modernization",
    copy: "Leading Python 3.12 and Azure Linux 3 migrations, with experience delivering zero-downtime gateway cutovers.",
  },
  {
    number: "04",
    title: "Engineering leadership",
    copy: "Supporting LinkedIn's REACH community as a technical interviewer and mentor while contributing to production reliability.",
  },
];

const ExperiencePage = () => (
  <section className="section experience-section" id="experience">
    <motion.div className="section-kicker" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}><span>02</span> Professional experience</motion.div>
    <div className="section-heading experience-heading">
      <h2>Engineering systems<br /><em>built to scale.</em></h2>
      <p>My primary work is building reliable enterprise products at LinkedIn across APIs, distributed workflows, and Azure infrastructure.</p>
    </div>
    <motion.article className="experience-card" initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}>
      <aside className="experience-role">
        <div className="experience-current"><i />Current role</div>
        <div className="experience-company"><span>in</span><strong>LinkedIn</strong></div>
        <p>February 2025 — Present</p>
        <small>Sunnyvale, California</small>
        <div className="reach-origin"><span>REACH</span><p>Joined through LinkedIn&apos;s apprenticeship program and continue here as a Software Engineer.</p></div>
      </aside>
      <div className="experience-detail">
        <span className="experience-label">Software Engineer</span>
        <h3>Enterprise integration,<br />cloud, and reliability.</h3>
        <p className="experience-summary">I build production systems that connect teams and platforms—from REST APIs and authorization to event-driven delivery, cloud migrations, and modern React interfaces.</p>
        <div className="experience-highlights">
          {highlights.map((highlight, index) => (
            <motion.div key={highlight.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }}>
              <span>{highlight.number}</span><h4>{highlight.title}</h4><p>{highlight.copy}</p>
            </motion.div>
          ))}
        </div>
        <div className="experience-stack"><span>Python</span><span>FastAPI</span><span>React</span><span>Azure</span><span>Apache Airflow</span><span>Docker</span><span>CI/CD</span></div>
      </div>
    </motion.article>
  </section>
);

export default ExperiencePage;
