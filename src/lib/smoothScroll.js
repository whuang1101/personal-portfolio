import Lenis from "lenis";

// One Lenis instance for the whole app. scrollToSection routes through it so
// anchor jumps get the same inertia as wheel scrolling.
let lenis = null;

export const getLenis = () => lenis;

export const startSmoothScroll = () => {
  if (lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
  let frame;
  const raf = (time) => {
    lenis.raf(time);
    frame = window.requestAnimationFrame(raf);
  };
  frame = window.requestAnimationFrame(raf);
  return () => {
    window.cancelAnimationFrame(frame);
    lenis.destroy();
    lenis = null;
  };
};
