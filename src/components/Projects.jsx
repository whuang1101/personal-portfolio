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
    <div className="section-kicker"><span>03</span> Selected projects</div>
    <div className="section-heading"><h2>Products built<br /><em>from curiosity.</em></h2><p>Independent builds that show how I explore product ideas, learn new systems, and carry an experience from interface to backend.</p></div>
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
    </div>
  </section>
);

export default ProjectsPage;
