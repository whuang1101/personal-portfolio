import { motion } from "framer-motion";

const highlights = [
  {
    number: "01",
    eyebrow: "Systems",
    title: "Enterprise APIs",
    copy: "Building and owning integrations across FastAPI, SQLAlchemy, Azure SQL, and Azure API Management.",
  },
  {
    number: "02",
    eyebrow: "Delivery",
    title: "Distributed workflows",
    copy: "Designing authorization, event-driven approvals, and reliable delivery guarantees for production workflows.",
  },
  {
    number: "03",
    eyebrow: "Reliability",
    title: "Cloud modernization",
    copy: "Leading Python 3.12 and Azure Linux 3 migrations, including zero-downtime gateway cutovers.",
  },
  {
    number: "04",
    eyebrow: "Community",
    title: "Interviewing & mentorship",
    copy: "Serving as a technical interviewer and mentor for LinkedIn's REACH apprenticeship community.",
  },
];

const earlierChapters = [
  {
    date: "MAY 2023 — JAN 2025",
    title: "The Odin Project",
    label: "Self-directed full-stack training",
    copy: "Built a practical foundation across modern JavaScript, React, Node, databases, testing, and full-stack product delivery.",
  },
  {
    date: "MAY 2022 — MAY 2023",
    title: "UF Human Neuromechanics Laboratory",
    label: "Undergraduate Research Assistant",
    copy: "Applied engineering and research methods at the intersection of biomechanics, experimentation, and human movement.",
  },
  {
    date: "GRADUATED MAY 2023",
    title: "University of Florida",
    label: "B.S. Biomedical Engineering · 3.87 GPA",
    copy: "Completed an electrolarynx speech-enhancement iOS prototype using Python, TensorFlow, and Swift for senior design.",
  },
];

const ExperiencePage = () => (
  <section className="section experience-section" id="experience">
    <motion.div className="section-kicker" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}>
      <span>02</span> Primary route / Experience
    </motion.div>
    <div className="section-heading experience-heading">
      <h2>Building the systems<br /><em>behind the interface.</em></h2>
      <p>My primary work is at LinkedIn, where I build enterprise products across APIs, distributed workflows, and Azure infrastructure.</p>
    </div>

    <div className="experience-layout">
      <aside className="career-route" aria-hidden="true">
        <div className="route-sticky">
          <span>CAREER ROUTE</span>
          <svg viewBox="0 0 220 690">
            <path className="career-contour" d="M-20 95c58-58 137-43 167 10s90 70 118 25M-34 134c72-55 139-37 170 17s83 62 119 22M-15 510c63-53 132-36 168 17s79 64 123 22M-31 551c73-52 143-31 173 21s76 57 125 18" />
            <path className="career-route-shadow" d="M65 635C35 550 115 503 79 414s74-120 49-211S181 87 171 43" />
            <motion.path className="career-route-line" d="M65 635C35 550 115 503 79 414s74-120 49-211S181 87 171 43" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.7, ease: "easeInOut" }} />
            <circle cx="65" cy="635" r="5" />
            <circle cx="79" cy="414" r="5" />
            <circle cx="128" cy="203" r="5" />
            <circle className="summit" cx="171" cy="43" r="8" />
          </svg>
          <div className="route-scale"><i /><span>2022</span><i /><span>2023</span><i /><span>2025</span><i /></div>
        </div>
      </aside>

      <div className="experience-content">
        <motion.article className="current-role" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}>
          <header className="role-header">
            <div className="current-signal"><i />CURRENT CHAPTER</div>
            <span>FEB 2025 — PRESENT</span>
          </header>
          <div className="role-intro">
            <div className="company-mark" aria-hidden="true">in</div>
            <div>
              <span>Software Engineer</span>
              <h3>LinkedIn</h3>
              <p>Sunnyvale, California</p>
            </div>
          </div>
          <p className="role-summary">I build production systems that connect teams and platforms—from REST APIs and authorization to event-driven delivery, cloud migrations, and modern React interfaces.</p>
          <div className="experience-highlights">
            {highlights.map((highlight, index) => (
              <motion.article key={highlight.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }} transition={{ delay: index * .04 }}>
                <span>{highlight.number}</span>
                <small>{highlight.eyebrow}</small>
                <h4>{highlight.title}</h4>
                <p>{highlight.copy}</p>
              </motion.article>
            ))}
          </div>
          <div className="experience-stack" aria-label="Core technologies">
            <span>Python</span><span>FastAPI</span><span>SQLAlchemy</span><span>React</span><span>Azure</span><span>Apache Airflow</span><span>Docker</span><span>CI/CD</span>
          </div>
          <div className="reach-note"><b>REACH / FULL CIRCLE</b><p>Joined LinkedIn through the REACH apprenticeship and now give back as a technical interviewer and mentor.</p></div>
        </motion.article>

        <div className="route-ledger">
          <div className="ledger-heading"><span>EARLIER CHAPTERS</span><span>FOUNDATION / 03 ENTRIES</span></div>
          {earlierChapters.map((chapter, index) => (
            <motion.article key={chapter.title} className="ledger-entry" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }} transition={{ delay: index * .04 }}>
              <span>{chapter.date}</span>
              <div><small>{chapter.label}</small><h3>{chapter.title}</h3></div>
              <p>{chapter.copy}</p>
              <b aria-hidden="true">{String(index + 2).padStart(2, "0")}</b>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ExperiencePage;
