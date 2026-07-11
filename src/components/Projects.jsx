import { motion } from "framer-motion";
import OdinBook from "../photos/odin-book.webp";
import KeepInTouch from "../photos/keep-in-touch.webp";
import PhotoTagging from "../photos/photo-tagging.webp";
import Blog from "../photos/blog.webp";
import LumenPreview from "../photos/fervent-fashion.webp";

const projects = [
  { title: "Lumen", type: "Modern storefront", image: LumenPreview, description: "An editorial React storefront with live product data, responsive product browsing, detail pages, and a complete client-side shopping bag.", stack: ["React 18", "React Router", "Vite", "Fake Store API"], demo: "https://earnest-ganache-26ee42.netlify.app/", code: "https://github.com/whuang1101/Shopping-Cart" },
  { title: "The Journal", type: "Full-stack publishing", image: Blog, description: "A responsive publishing platform with public stories and comments, plus JWT-protected tools for creating, editing, and managing posts.", stack: ["React", "Express", "MongoDB", "JWT"], demo: "https://main--euphonious-nougat-ad7d5a.netlify.app/", code: "https://github.com/whuang1101/blog_client" },
  { title: "Pixel Finder", type: "Interactive game", image: PhotoTagging, description: "A visual search game that turns photo tagging into a playful full-stack challenge.", stack: ["React", "Node", "MongoDB"], demo: "https://incandescent-froyo-150a8b.netlify.app/", code: "https://github.com/whuang1101/photo-tagging" },
  { title: "KeepInTouch", type: "Real-time messenger", image: KeepInTouch, description: "A live messaging app designed around fast conversations and connected experiences.", stack: ["React", "Socket.io", "Express", "MongoDB"], demo: "https://mellow-sfogliatella-52d786.netlify.app/", code: "https://github.com/whuang1101/KeepInTouch" },
  { title: "Odin Book", type: "Social platform", image: OdinBook, description: "A full-stack social experience with profiles, posts, and authenticated interactions.", stack: ["React", "Node", "MongoDB", "Passport"], demo: "https://lustrous-dodol-b9be51.netlify.app/", code: "https://github.com/whuang1101/OdinBook" },
];

const ProjectsPage = () => (
  <section className="section projects-section" id="project">
    <div className="section-kicker"><span>03</span> Selected work</div>
    <div className="section-heading"><h2>A timeline of<br /><em>things I&apos;ve built.</em></h2><p>Each project marks a step in my path from learning the fundamentals to designing complete digital products.</p></div>
    <div className="projects-grid timeline">
      {projects.map((project, index) => (
        <motion.article className="project-card" key={project.title} initial={{ opacity: 0, x: index % 2 ? 42 : -42 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .22 }} transition={{ duration: .65, ease: [.22, 1, .36, 1] }}>
          <span className="timeline-node" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <a className="project-visual" href={project.demo} target="_blank" rel="noreferrer"><img src={project.image} alt={`${project.title} interface`} loading="lazy" /><span>View project ↗</span></a>
          <div className="project-meta"><span>{String(index + 1).padStart(2, "0")} / {project.type}</span><h3>{project.title}</h3><p>{project.description}</p>
            <div className="project-footer"><div>{project.stack.map(item => <span key={item}>{item}</span>)}</div><a href={project.code} target="_blank" rel="noreferrer" aria-label={`${project.title} source code`}>GitHub ↗</a></div>
          </div>
        </motion.article>
      ))}
      <motion.article className="project-card career-milestone" initial={{ opacity: 0, x: 42 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .22 }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}>
        <span className="timeline-node career-node" aria-hidden="true">06</span>
        <div className="career-visual" aria-hidden="true">
          <div className="linkedin-mark">in</div>
          <div className="offer-lines"><i /><i /><i /></div>
          <span>Offer accepted</span>
          <strong>REACH</strong>
          <small>LinkedIn · 2025</small>
        </div>
        <div className="project-meta career-meta"><span>06 / Career milestone · 2025 — Present</span><h3>LinkedIn REACH</h3><p>My self-taught journey led to an offer from LinkedIn&apos;s REACH program. That opportunity became my path into LinkedIn, where I continue today as a Software Engineer building enterprise APIs, event-driven systems, and cloud infrastructure.</p>
          <div className="project-footer"><div><span>FastAPI</span><span>React</span><span>Azure</span><span>Distributed systems</span></div><strong className="present-badge"><i />Still building here</strong></div>
        </div>
      </motion.article>
    </div>
  </section>
);

export default ProjectsPage;
