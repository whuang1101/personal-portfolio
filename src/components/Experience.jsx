import { motion } from "framer-motion";
import { fadeUp, inView } from "../lib/interactions.js";

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
    date: "May 2023 — Jan 2025",
    title: "The Odin Project",
    label: "Self-directed full-stack training",
    copy: "Built a practical foundation across modern JavaScript, React, Node, databases, testing, and full-stack product delivery.",
  },
  {
    date: "May 2022 — May 2023",
    title: "UF Human Neuromechanics Laboratory",
    label: "Undergraduate Research Assistant",
    copy: "Applied engineering and research methods at the intersection of biomechanics, experimentation, and human movement.",
  },
  {
    date: "Graduated May 2023",
    title: "University of Florida",
    label: "B.S. Biomedical Engineering · 3.87 GPA",
    copy: "Completed an electrolarynx speech-enhancement iOS prototype using Python, TensorFlow, and Swift for senior design.",
  },
];

const ExperiencePage = () => (
  <section className="section experience-section" id="experience">
    <motion.div className="section-kicker" variants={fadeUp} initial="hidden" whileInView="visible" viewport={inView}>
      <span>02 /</span> Experience
    </motion.div>
    <div className="section-heading">
      <h2>Building the systems <span className="accent-word">behind</span> the interface.</h2>
      <p>My primary work is at LinkedIn, where I build enterprise products across APIs, distributed workflows, and Azure infrastructure.</p>
    </div>

    <motion.article className="exp-row" variants={fadeUp} initial="hidden" whileInView="visible" viewport={inView} transition={{ duration: .55 }}>
      <div className="exp-when">
        <div className="exp-now"><i />Now</div>
        Feb 2025 — Present
      </div>
      <div className="exp-role">
        <span className="exp-title">Software Engineer</span>
        <h3>LinkedIn</h3>
        <p className="exp-place">Sunnyvale, California</p>
      </div>
      <div className="exp-detail">
        <p>I build production systems that connect teams and platforms—from REST APIs and authorization to event-driven delivery, cloud migrations, and modern React interfaces.</p>
        <div className="exp-highlights">
          <ol>
            {highlights.map((highlight) => (
              <li key={highlight.title}>
                <b>{highlight.number}</b>
                <div>
                  <h4>{highlight.title}</h4>
                  <p>{highlight.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="exp-stack" aria-label="Core technologies">
          {["Python", "FastAPI", "SQLAlchemy", "React", "Azure", "Apache Airflow", "Docker", "CI/CD"].map((item) => (
            <span className="chip-outline" key={item}>{item}</span>
          ))}
        </div>
        <div className="reach-note">
          <b>REACH / FULL CIRCLE</b>
          <p>Joined LinkedIn through the REACH apprenticeship and now give back as a technical interviewer and mentor.</p>
        </div>
      </div>
    </motion.article>

    {earlierChapters.map((chapter, index) => (
      <motion.article
        key={chapter.title}
        className="exp-row"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
        transition={{ duration: .5, delay: index * .05 }}
      >
        <div className="exp-when">{chapter.date}</div>
        <div className="exp-role">
          <span className="exp-title">{chapter.label}</span>
          <h3>{chapter.title}</h3>
        </div>
        <div className="exp-detail"><p>{chapter.copy}</p></div>
      </motion.article>
    ))}
  </section>
);

export default ExperiencePage;
