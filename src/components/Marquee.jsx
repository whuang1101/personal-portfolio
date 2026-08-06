import { useEffect, useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useFinePointer } from "../lib/interactions.js";

const ITEMS = ["Python", "FastAPI", "React", "Azure", "SQLAlchemy", "Airflow", "Docker", "TypeScript", "Postgres", "CI/CD"];

// Scroll velocity nudges the marquee speed — the strip feels attached to the page
// rather than looping on its own clock. Falls back to a plain static row when the
// visitor asks for reduced motion.
const Marquee = () => {
  const animate = useFinePointer();
  const baseX = useMotionValue(0);
  const trackRef = useRef(null);
  const widthRef = useRef(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 300 });
  const velocityFactor = useTransform(smoothVelocity, [-1200, 0, 1200], [-3, 1, 3], { clamp: false });

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) widthRef.current = trackRef.current.offsetWidth;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useAnimationFrame((_, delta) => {
    if (!animate || !widthRef.current) return;
    const move = (delta / 1000) * 42 * velocityFactor.get();
    let next = baseX.get() - move;
    if (next <= -widthRef.current) next += widthRef.current;
    if (next > 0) next -= widthRef.current;
    baseX.set(next);
  });

  const row = (
    <div ref={trackRef}>
      {ITEMS.map((item) => (
        <span key={item}>{item} <em aria-hidden="true">■</em></span>
      ))}
    </div>
  );

  return (
    <div className="marquee" aria-hidden="true">
      <motion.div style={{ x: baseX, display: "flex" }}>
        {row}
        <div>{ITEMS.map((item) => <span key={item}>{item} <em>■</em></span>)}</div>
        <div>{ITEMS.map((item) => <span key={item}>{item} <em>■</em></span>)}</div>
      </motion.div>
    </div>
  );
};

export default Marquee;
