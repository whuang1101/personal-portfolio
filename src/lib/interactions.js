import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

// Pointer-driven flourishes only run where they make sense: a fine pointer that
// isn't asking for reduced motion. Everything that uses this falls back to plain
// static markup, so touch and reduced-motion users lose decoration, never content.
export const useFinePointer = () => {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const pointer = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setFine(pointer.matches && !calm.matches);
    sync();
    pointer.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      pointer.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
    };
  }, []);

  return fine;
};

// Springed cursor position in viewport coordinates, shared by the cursor and the
// project hover preview so they trail the pointer at different weights.
export const useCursorPosition = (config = { stiffness: 400, damping: 40, mass: 0.6 }) => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, config);
  const springY = useSpring(y, config);

  useEffect(() => {
    const move = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return { x: springX, y: springY };
};

// Pulls an element a few pixels toward the pointer while it is nearby, then
// springs it home. Returns a ref plus the motion values to bind to style.
export const useMagnetic = (strength = 0.28, radius = 90) => {
  const ref = useRef(null);
  const enabled = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18 });
  const springY = useSpring(y, { stiffness: 260, damping: 18 });

  useEffect(() => {
    if (!enabled) {
      x.set(0);
      y.set(0);
      return undefined;
    }
    const move = (event) => {
      const node = ref.current;
      if (!node) return;
      const bounds = node.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);
      if (distance < Math.max(bounds.width, bounds.height) / 2 + radius) {
        x.set(deltaX * strength);
        y.set(deltaY * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, radius, strength, x, y]);

  return { ref, x: springX, y: springY };
};

// Masked line reveal shared by every oversized headline.
export const lineReveal = {
  hidden: { y: "110%" },
  visible: { y: 0 },
};

export const lineRevealTransition = { duration: 0.75, ease: [0.22, 1, 0.36, 1] };

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const inView = { once: true, margin: "0px 0px -80px 0px" };
