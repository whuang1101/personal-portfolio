import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RiseKeeper from "../photos/risekeeper.jpg";
import OdinBook from "../photos/odin-book.webp";
import Lumen from "../photos/lumen.webp";
import TheJournal from "../photos/the-journal.webp";
import PixelFinder from "../photos/pixel-finder.webp";
import KeepInTouch from "../photos/keepintouch.webp";
import { fadeUp, inView, useCursorPosition, useFinePointer } from "../lib/interactions.js";
import { ParallaxImage, Scramble } from "./effects.jsx";

const projects = [
  { title: "Odin Book", type: "Social platform", image: OdinBook, description: "A full-stack social experience with profiles, posts, and authenticated interactions.", stack: ["React", "Node", "MongoDB", "Passport"], demo: "https://lustrous-dodol-b9be51.netlify.app/", code: "https://github.com/whuang1101/OdinBook" },
  { title: "RiseKeeper", type: "iOS alarm app", image: RiseKeeper, description: "An iOS alarm app built on AlarmKit system alarms, where a math, memory, or typing mission has to be cleared before the alarm stops — plus strict snooze controls and wake-up checks.", stack: ["Swift", "SwiftUI", "SwiftData", "AlarmKit", "StoreKit 2"], demo: "https://whuang1101.github.io/RiseKeeper/", demoLabel: "Product site" },
  { title: "Lumen", type: "Modern storefront", image: Lumen, description: "An editorial React storefront with live product data, responsive product browsing, detail pages, and a complete client-side shopping bag.", stack: ["React 18", "React Router", "Vite", "Fake Store API"], demo: "https://earnest-ganache-26ee42.netlify.app/", code: "https://github.com/whuang1101/Shopping-Cart" },
  { title: "The Journal", type: "Full-stack publishing", image: TheJournal, description: "A responsive publishing platform with public stories and comments, plus JWT-protected tools for creating, editing, and managing posts.", stack: ["React", "Express", "MongoDB", "JWT"], demo: "https://main--euphonious-nougat-ad7d5a.netlify.app/", code: "https://github.com/whuang1101/blog_client" },
  { title: "Pixel Finder", type: "Interactive game", image: PixelFinder, description: "A visual search game that turns photo tagging into a playful full-stack challenge.", stack: ["React", "Node", "MongoDB"], demo: "https://incandescent-froyo-150a8b.netlify.app/", code: "https://github.com/whuang1101/photo-tagging" },
  { title: "KeepInTouch", type: "Real-time messenger", image: KeepInTouch, description: "A live messaging app designed around fast conversations and connected experiences.", stack: ["React", "Socket.io", "Express", "MongoDB"], demo: "https://mellow-sfogliatella-52d786.netlify.app/", code: "https://github.com/whuang1101/KeepInTouch" },
];

// The first two carry the visual weight; the rest read as a typographic index so
// five similar builds stop reading as one undifferentiated texture.
const FEATURED_COUNT = 2;
const featured = projects.slice(0, FEATURED_COUNT);
const alsoBuilt = projects.slice(FEATURED_COUNT);

// Follows the pointer with spring lag while an index row is hovered.
// eslint-disable-next-line react/prop-types
const HoverPreview = ({ project }) => {
  const { image, title, type } = project || {};
  const { x, y } = useCursorPosition({ stiffness: 180, damping: 24, mass: 0.7 });

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="hover-preview"
          aria-hidden="true"
          style={{ x, y }}
          initial={{ opacity: 0, scale: .9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: .95 }}
          transition={{ duration: .25, ease: [.22, 1, .36, 1] }}
        >
          {image
            ? <img src={image} alt="" />
            : <div className="preview-fallback"><strong>{title}</strong><span>{type}</span></div>}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProjectsPage = () => {
  const fine = useFinePointer();
  const [preview, setPreview] = useState(null);

  return (
    <section className="section projects-section" id="project">
      <motion.div className="section-kicker" variants={fadeUp} initial="hidden" whileInView="visible" viewport={inView}>
        <span>03 /</span> <Scramble text="Selected work" />
      </motion.div>
      <div className="section-heading">
        <h2>Experiments that became <span className="accent-word">working</span> products.</h2>
        <p>Six independent builds tracing my path from full-stack fundamentals to more considered product engineering.</p>
      </div>

      {featured.map((project, index) => (
        <motion.article
          className={index % 2 ? "project-feature flip" : "project-feature"}
          key={project.title}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          transition={{ duration: .6 }}
        >
          {/* The image repeats the link below, so it stays out of the tab order. */}
          <a className="project-visual" href={project.demo} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden="true" data-cursor="view">
            <ParallaxImage src={project.image} />
          </a>
          <div className="project-meta">
            <span className="project-num">{String(index + 1).padStart(2, "0")} / 06</span>
            <h3>{project.title}</h3>
            <span className="project-type">{project.type}</span>
            <p>{project.description}</p>
            <div className="project-tags">
              {project.stack.map((item) => <span className="chip-outline" key={item}>{item}</span>)}
            </div>
            <nav className="project-links" aria-label={`${project.title} links`}>
              <a className="arrow-link" href={project.demo} target="_blank" rel="noreferrer">{project.demoLabel || "Live"} ↗</a>
              {project.code && <a className="arrow-link" href={project.code} target="_blank" rel="noreferrer">Source ↗</a>}
            </nav>
          </div>
        </motion.article>
      ))}

      <div className="project-index">
        {alsoBuilt.map((project, index) => (
          <motion.div
            key={project.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            transition={{ duration: .45, delay: index * .05 }}
            className="project-row"
            data-cursor="view"
            onPointerEnter={() => fine && setPreview(project)}
            onPointerLeave={() => fine && setPreview(null)}
          >
            <b>{String(index + FEATURED_COUNT + 1).padStart(2, "0")}</b>
            <h3>{project.title}</h3>
            <small>{project.type}</small>
            <a className="row-primary" href={project.demo} target="_blank" rel="noreferrer">
              {project.demoLabel || "Live"} ↗
            </a>
            {project.code
              ? <a className="row-source" href={project.code} target="_blank" rel="noreferrer">Source ↗</a>
              : <i aria-hidden="true">↗</i>}
          </motion.div>
        ))}
      </div>

      <HoverPreview project={preview} />
    </section>
  );
};

export default ProjectsPage;
