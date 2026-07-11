import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IntroGame from "./components/IntroGame.jsx";
import Header from "./components/Header.jsx";
import FirstPage from "./components/FirstPage.jsx";
import AboutPage from "./components/About.jsx";
import SkillsPage from "./components/Skills.jsx";
import ProjectsPage from "./components/Projects.jsx";
import ContactModal from "./components/ContactModal.jsx";

const App = () => {
  const [entered, setEntered] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  return <>
    <AnimatePresence>{!entered && <IntroGame onEnter={() => setEntered(true)} />}</AnimatePresence>
    <AnimatePresence>{contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}</AnimatePresence>
    <motion.div initial={false} animate={{ opacity: entered ? 1 : 0 }} aria-hidden={!entered}>
      <Header onContact={() => setContactOpen(true)} />
      <main><FirstPage /><AboutPage /><SkillsPage /><ProjectsPage /></main>
      <footer><span>Designed & built by Wilson Huang</span><button type="button" onClick={() => setContactOpen(true)}>Let&apos;s build something →</button></footer>
    </motion.div>
  </>;
};

export default App;
