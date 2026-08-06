import { useEffect, useState } from "react";
import { SECTIONS } from "../lib/sections.js";

// A section becomes active when it crosses the middle band of the viewport, so the
// header nav and the page agree at every scroll position.
const ACTIVE_BAND = "-45% 0px -45% 0px";

const useActiveSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const elements = SECTIONS.map((section) => document.querySelector(section.selector));
    const inBand = new Set();
    let current = 0;
    let scrollable = 1;
    let queued = false;

    // Cached so the scroll handler never reads scrollHeight — reading it per scroll event
    // forces a synchronous layout.
    const measure = () => {
      scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    const apply = (next) => {
      if (next === current) return;
      current = next;
      setActiveIndex(next);
    };

    const resolve = () => {
      queued = false;
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));

      // The footer is short enough that its band may never reach the middle, so the
      // last stop takes over once the page has bottomed out.
      if (progress > 0.99) {
        apply(SECTIONS.length - 1);
        return;
      }
      for (let index = 0; index < elements.length; index += 1) {
        if (inBand.has(index)) {
          apply(index);
          return;
        }
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = elements.indexOf(entry.target);
        if (index < 0) return;
        if (entry.isIntersecting) inBand.add(index);
        else inBand.delete(index);
      });
      resolve();
    }, { rootMargin: ACTIVE_BAND });

    const onScroll = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(resolve);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    elements.forEach((element) => element && observer.observe(element));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    measure();
    resolve();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return activeIndex;
};

export default useActiveSection;
