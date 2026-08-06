import { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";
import { lineRevealTransition } from "../lib/interactions.js";

const HOLD_MS = 1650;

// Opening curtain: the name at full scale on ink, a 00→100 counter, then the
// whole panel wipes upward. Plays once per session, never under reduced motion,
// and any click or key skips straight to the page.
// eslint-disable-next-line react/prop-types
const Intro = ({ onDone }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const counter = animate(0, 100, {
      duration: HOLD_MS / 1000,
      ease: [0.3, 0.6, 0.3, 1],
      onUpdate: (value) => setCount(Math.round(value)),
    });
    const timer = window.setTimeout(onDone, HOLD_MS);
    const skip = () => onDone();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      document.body.style.overflow = "";
      counter.stop();
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [onDone]);

  return (
    <motion.div
      className="intro"
      role="presentation"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div className="intro-name" initial="hidden" animate="visible" transition={{ staggerChildren: 0.09, delayChildren: 0.12 }}>
        <span className="line-mask">
          <motion.span variants={{ hidden: { y: "110%" }, visible: { y: 0 } }} transition={lineRevealTransition}>
            Wilson
          </motion.span>
        </span>
        <span className="line-mask">
          <motion.span variants={{ hidden: { y: "110%" }, visible: { y: 0 } }} transition={lineRevealTransition}>
            Huang<i aria-hidden="true">.</i>
          </motion.span>
        </span>
      </motion.div>
      <motion.span
        className="intro-role"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.4 }}
      >
        — Software Engineer
      </motion.span>
      <span className="intro-count" aria-hidden="true">{String(count).padStart(3, "0")}</span>
      <span className="intro-corner" aria-hidden="true" />
    </motion.div>
  );
};

export default Intro;
