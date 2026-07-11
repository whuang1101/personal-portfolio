import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-scroll";

const links = [
  ["home", "Home"],
  ["about", "About"],
  ["experience", "Experience"],
  ["project", "Work"],
  ["skills", "Toolkit"],
];

// eslint-disable-next-line react/prop-types
const Header = ({ onContact }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={scrolled ? "site-header scrolled" : "site-header"}>
      <nav className="nav-shell" aria-label="Main navigation">
        <Link className="brand" to="home" smooth duration={320}>
          <span className="brand-mark">WH</span>
          <span>Wilson Huang</span>
        </Link>
        <div className="desktop-nav">
          {links.map(([to, label]) => <Link key={to} to={to} smooth duration={320} offset={-70}>{label}</Link>)}
          <a className="resume-nav" href="/Wilson-Huang-Resume.pdf" target="_blank" rel="noreferrer"><span>Résumé</span><i>↗</i></a>
        </div>
        <button className="nav-cta" type="button" onClick={onContact}>Say hello</button>
        <button className="menu-button" type="button" aria-label="Toggle navigation menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-nav" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            {links.map(([to, label], index) => (
              <Link key={to} to={to} smooth duration={320} offset={-60} onClick={() => setOpen(false)}>
                <span>0{index + 1}</span>{label}
              </Link>
            ))}
            <a className="resume-mobile" href="/Wilson-Huang-Resume.pdf" target="_blank" rel="noreferrer"><span>06</span>Résumé <i>↗</i></a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
