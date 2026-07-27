import { motion } from "framer-motion";
import RiseKeeper from "../photos/risekeeper.jpg";
import OdinBook from "../photos/odin-book.webp";

const projects = [
  { title: "Odin Book", type: "Social platform", image: OdinBook, description: "A full-stack social experience with profiles, posts, and authenticated interactions.", stack: ["React", "Node", "MongoDB", "Passport"], demo: "https://lustrous-dodol-b9be51.netlify.app/", code: "https://github.com/whuang1101/OdinBook" },
  { title: "RiseKeeper", type: "iOS alarm app", image: RiseKeeper, description: "An iOS alarm app built on AlarmKit system alarms, where a math, memory, or typing mission has to be cleared before the alarm stops — plus strict snooze controls and wake-up checks.", stack: ["Swift", "SwiftUI", "SwiftData", "AlarmKit", "StoreKit 2"], demo: "https://whuang1101.github.io/RiseKeeper/", demoLabel: "Product site" },
  { title: "Lumen", type: "Modern storefront", description: "An editorial React storefront with live product data, responsive product browsing, detail pages, and a complete client-side shopping bag.", stack: ["React 18", "React Router", "Vite", "Fake Store API"], demo: "https://earnest-ganache-26ee42.netlify.app/", code: "https://github.com/whuang1101/Shopping-Cart" },
  { title: "The Journal", type: "Full-stack publishing", description: "A responsive publishing platform with public stories and comments, plus JWT-protected tools for creating, editing, and managing posts.", stack: ["React", "Express", "MongoDB", "JWT"], demo: "https://main--euphonious-nougat-ad7d5a.netlify.app/", code: "https://github.com/whuang1101/blog_client" },
  { title: "Pixel Finder", type: "Interactive game", description: "A visual search game that turns photo tagging into a playful full-stack challenge.", stack: ["React", "Node", "MongoDB"], demo: "https://incandescent-froyo-150a8b.netlify.app/", code: "https://github.com/whuang1101/photo-tagging" },
  { title: "KeepInTouch", type: "Real-time messenger", description: "A live messaging app designed around fast conversations and connected experiences.", stack: ["React", "Socket.io", "Express", "MongoDB"], demo: "https://mellow-sfogliatella-52d786.netlify.app/", code: "https://github.com/whuang1101/KeepInTouch" },
];

// The first two carry the visual weight; the rest read as a compact index so five
// similar builds stop reading as one undifferentiated texture.
const FEATURED_COUNT = 2;
const featured = projects.slice(0, FEATURED_COUNT);
const alsoBuilt = projects.slice(FEATURED_COUNT);

const tiltProject = (event) => {
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  event.currentTarget.style.setProperty("--tilt-x", `${(0.5 - y) * 6}deg`);
  event.currentTarget.style.setProperty("--tilt-y", `${(x - 0.5) * 7}deg`);
  event.currentTarget.style.setProperty("--spot-x", `${x * 100}%`);
  event.currentTarget.style.setProperty("--spot-y", `${y * 100}%`);
};

const resetProjectTilt = (event) => {
  event.currentTarget.style.setProperty("--tilt-x", "0deg");
  event.currentTarget.style.setProperty("--tilt-y", "0deg");
};

const ProjectsPage = () => (
  <section className="section projects-section" id="project">
    <div className="section-kicker"><span>03</span> Selected work / Project journal</div>
    <div className="section-heading projects-heading">
      <h2>Experiments that became<br /><em>working products.</em></h2>
      <p>Six independent builds tracing my path from full-stack fundamentals to more considered product engineering.</p>
    </div>
    <div className="project-route" aria-hidden="true"><span>START</span><i /><span>06 BUILDS</span></div>

    <div className="projects-featured">
      {featured.map((project, index) => (
        <motion.article className="project-card" key={project.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }} transition={{ duration: .55, ease: [.22, 1, .36, 1] }}>
          {/* The image repeats the "Live" link below, so it stays out of the tab order. */}
          <a
            className="project-visual"
            href={project.demo}
            target="_blank"
            rel="noreferrer"
            tabIndex={-1}
            aria-hidden="true"
            onPointerMove={tiltProject}
            onPointerLeave={resetProjectTilt}
          >
            <img src={project.image} alt="" decoding="async" />
            <span>Open live build <b>↗</b></span>
          </a>
          <div className="project-meta">
            <div className="project-index"><span>{String(index + 1).padStart(2, "0")} / 06</span><span>{project.type}</span></div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-footer">
              <div>{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
              <nav aria-label={`${project.title} links`}>
                <a href={project.demo} target="_blank" rel="noreferrer">{project.demoLabel || "Live"} ↗</a>
                {project.code && <a href={project.code} target="_blank" rel="noreferrer">Source ↗</a>}
              </nav>
            </div>
          </div>
        </motion.article>
      ))}
    </div>

    <div className="project-ledger">
      <div className="project-ledger-heading"><span>ALSO BUILT</span><span>04 ENTRIES</span></div>
      {alsoBuilt.map((project, index) => (
        <motion.article className="project-row" key={project.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3, margin: "0px 0px -8% 0px" }} transition={{ duration: .45, delay: index * .04 }}>
          <span className="project-row-index" aria-hidden="true">{String(index + FEATURED_COUNT + 1).padStart(2, "0")}</span>
          <div className="project-row-title">
            <h3>{project.title}</h3>
            <small>{project.type}</small>
          </div>
          <p>{project.description}</p>
          <div className="project-row-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
          <nav aria-label={`${project.title} links`}>
            <a href={project.demo} target="_blank" rel="noreferrer">{project.demoLabel || "Live"} ↗</a>
            {project.code && <a href={project.code} target="_blank" rel="noreferrer">Source ↗</a>}
          </nav>
        </motion.article>
      ))}
    </div>
  </section>
);

export default ProjectsPage;
