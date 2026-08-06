/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

// Per-character masked reveal for oversized headlines. Words stay in their own
// nowrap wrappers so lines still break at spaces, never mid-word; the joining
// space lives between the wrappers because a leading space inside an
// inline-block gets trimmed.
export const Chars = ({ text, className, delay = 0 }) => {
  const calm = useReducedMotion();
  let charIndex = 0;

  if (calm) return <span className={className}>{text}</span>;

  return (
    <span className={className ? `chars ${className}` : "chars"} aria-label={text} role="text">
      {text.split(" ").map((word, wordIndex) => [
        wordIndex > 0 ? " " : null,
        <span className="chars-word" aria-hidden="true" key={word + wordIndex}>
          {word.split("").map((char, index) => {
            charIndex += 1;
            return (
              <span className="chars-mask" key={index}>
                <motion.span
                  className="chars-char"
                  variants={{ hidden: { y: "115%" }, visible: { y: 0 } }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: delay + charIndex * 0.018 }}
                >
                  {char}
                </motion.span>
              </span>
            );
          })}
        </span>,
      ])}
    </span>
  );
};

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#■/0123456789";

// Mono labels decode from noise when they enter view.
export const Scramble = ({ text, duration = 650 }) => {
  const calm = useReducedMotion();
  const ref = useRef(null);
  const [output, setOutput] = useState(text);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    if (calm || played || !ref.current) return undefined;
    const node = ref.current;
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setPlayed(true);
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const settled = Math.floor(progress * text.length);
        setOutput(
          text
            .split("")
            .map((char, index) => {
              if (index < settled || char === " ") return char;
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join("")
        );
        if (progress < 1) frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [calm, duration, played, text]);

  return <span ref={ref} aria-label={text}>{output}</span>;
};

// Ticking local time for the footer — the kind of mono detail that makes the
// page feel attended to.
export const LocalClock = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "America/Los_Angeles",
    });
    const update = () => setTime(formatter.format(new Date()));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return <span className="local-clock">Sunnyvale, CA — {time} PT</span>;
};

// Image drifts slower than the page inside its clipped frame.
export const ParallaxImage = ({ src, alt = "", className }) => {
  const calm = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  return (
    <span className={className ? `parallax-frame ${className}` : "parallax-frame"} ref={ref}>
      <motion.img src={src} alt={alt} decoding="async" loading="lazy" style={calm ? undefined : { y, scale: 1.18 }} />
    </span>
  );
};
