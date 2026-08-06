import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCursorPosition, useFinePointer } from "../lib/interactions.js";

// A two-part cursor: a hard accent dot on the pointer and a ring that trails it.
// The ring reads the hovered element's data-cursor attribute so links grow it and
// project rows turn it into a "view" pill.
const Cursor = () => {
  const enabled = useFinePointer();
  const dot = useCursorPosition({ stiffness: 1200, damping: 60, mass: 0.2 });
  const ring = useCursorPosition({ stiffness: 260, damping: 26, mass: 0.6 });
  const [mode, setMode] = useState("");

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove("cursor-active");
      return undefined;
    }
    document.body.classList.add("cursor-active");

    const track = (event) => {
      const target = event.target instanceof Element
        ? event.target.closest("[data-cursor], a, button, label")
        : null;
      if (!target) {
        setMode("");
        return;
      }
      setMode(target.dataset.cursor || "link");
    };

    window.addEventListener("pointerover", track, { passive: true });
    return () => {
      window.removeEventListener("pointerover", track);
      document.body.classList.remove("cursor-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <motion.div className="cursor-dot" aria-hidden="true" style={{ x: dot.x, y: dot.y }} />
      <motion.div
        className={mode ? `cursor-ring is-${mode}` : "cursor-ring"}
        aria-hidden="true"
        style={{ x: ring.x, y: ring.y }}
      >
        {mode === "view" ? "View ↗" : ""}
      </motion.div>
    </>
  );
};

export default Cursor;
