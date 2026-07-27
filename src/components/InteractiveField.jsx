import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../lib/sections.js";

const clamp = (value, minimum = 0, maximum = 1) => Math.min(maximum, Math.max(minimum, value));

const seededRandom = (seed) => {
  let value = seed;
  return () => {
    value += 0x6D2B79F5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
};

const InteractiveField = () => {
  const canvasRef = useRef(null);
  const [reducedMotion] = useState(() => prefersReducedMotion());

  useEffect(() => {
    // Reduced motion gets no canvas at all — a single frozen frame reads as a rendering bug.
    if (reducedMotion) return undefined;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const hero = document.querySelector("#home");
    if (!canvas || !context || !hero) return undefined;

    // Touch and small screens never get the pointer play, so the loop simply stops off-hero.
    const ambientOnly = window.matchMedia("(max-width: 820px), (pointer: coarse)");
    const random = seededRandom(89);
    const pointer = { x: -1000, y: -1000, active: false };
    const player = { x: 0, y: 0, vx: 0, vy: 0 };
    const trail = [];
    const holds = [];
    let width = 0;
    let height = 0;
    let frame;
    let nodes = [];
    let running = false;
    let heroInView = true;
    let initialized = false;

    const restPoint = () => ({ x: width * 0.5, y: height * 0.5 });

    const createNodes = () => {
      const count = Math.max(30, Math.min(52, Math.floor(width / 26)));
      nodes = Array.from({ length: count }, (_, index) => {
        const x = random() * width;
        const y = random() * height;
        return {
          x,
          y,
          homeX: x,
          homeY: y,
          vx: 0,
          vy: 0,
          phase: random() * Math.PI * 2,
          size: index % 9 === 0 ? 2.2 : 1.2,
        };
      });
    };

    const resize = () => {
      // Decorative field: 1.25x is plenty, and it roughly halves the pixels touched per frame
      // versus the display's native ratio on a Retina screen.
      const density = Math.min(window.devicePixelRatio || 1, 1.25);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * density);
      canvas.height = Math.round(height * density);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(density, 0, 0, density, 0, 0);
      createNodes();
      if (!initialized) {
        const start = restPoint();
        player.x = start.x;
        player.y = start.y;
        initialized = true;
      }
    };

    const updatePointer = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const releasePointer = () => {
      pointer.active = false;
    };

    const addHold = (event) => {
      if (event.target instanceof Element && event.target.closest("button, a, input, textarea")) return;
      holds.push({ x: event.clientX, y: event.clientY, age: 0 });
      if (holds.length > 12) holds.shift();
      player.vx += (event.clientX - player.x) * 0.045;
      player.vy += (event.clientY - player.y) * 0.045;
    };

    // The quiet drift used below the hero. No links, no pointer response — just texture.
    const drawAmbient = (time) => {
      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        node.vx += (node.homeX - node.x) * 0.0013 + Math.sin(time * 0.00035 + node.phase) * 0.055;
        node.vy += (node.homeY - node.y) * 0.0013 + Math.cos(time * 0.00028 + node.phase) * 0.045;
        node.vx *= 0.925;
        node.vy *= 0.925;
        node.x += node.vx;
        node.y += node.vy;
      }

      context.fillStyle = "rgba(243,240,232,.24)";
      context.beginPath();
      for (let index = 0; index < nodes.length; index += 1) {
        if (index % 9 === 0) continue;
        const node = nodes[index];
        context.moveTo(node.x + node.size, node.y);
        context.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      }
      context.fill();

      context.fillStyle = "rgba(199,255,84,.65)";
      context.beginPath();
      for (let index = 0; index < nodes.length; index += 9) {
        const node = nodes[index];
        context.moveTo(node.x + node.size, node.y);
        context.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      }
      context.fill();
    };

    // Roughly half the old frequency and well under half the old amplitude, so the balls
    // drift through the middle of the hero instead of sweeping its full width.
    const ballPoint = (time, ball) => ({
      x: width / 2 + Math.sin(time * (0.00021 + ball * 0.00003) + ball * 2.1) * width * 0.26,
      y: height / 2 + Math.sin(time * (0.00034 + ball * 0.000025) + ball) * height * 0.2,
    });

    const drawRally = (time) => {
      const pad = Math.max(32, width * 0.045);
      context.strokeStyle = "rgba(243,240,232,.055)";
      context.lineWidth = 1;
      context.strokeRect(pad, pad, width - pad * 2, height - pad * 2);
      context.beginPath();
      context.moveTo(width / 2, pad);
      context.lineTo(width / 2, height - pad);
      context.moveTo(pad, height / 2);
      context.lineTo(width - pad, height / 2);
      context.moveTo(width * 0.25, pad);
      context.lineTo(width * 0.25, height - pad);
      context.moveTo(width * 0.75, pad);
      context.lineTo(width * 0.75, height - pad);
      context.stroke();

      // A continuous stroked path instead of 14 discrete ghost dots, which read as a
      // stutter rather than a trail.
      const steps = 26;
      const spacing = 26;
      context.lineCap = "round";
      context.lineJoin = "round";
      for (let ball = 0; ball < 2; ball += 1) {
        const tone = ball === 0 ? "255,118,93" : "199,255,84";
        const head = ballPoint(time, ball);
        const tail = ballPoint(time - steps * spacing, ball);
        context.beginPath();
        for (let step = steps; step >= 0; step -= 1) {
          const point = ballPoint(time - step * spacing, ball);
          if (step === steps) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        const gradient = context.createLinearGradient(tail.x, tail.y, head.x, head.y);
        gradient.addColorStop(0, `rgba(${tone},0)`);
        gradient.addColorStop(1, `rgba(${tone},.3)`);
        context.strokeStyle = gradient;
        context.lineWidth = 1.6;
        context.stroke();

        context.beginPath();
        context.arc(head.x, head.y, 2.8, 0, Math.PI * 2);
        context.fillStyle = `rgba(${tone},.62)`;
        context.fill();
      }
    };

    const updatePlayer = () => {
      const rest = restPoint();
      const targetX = pointer.active ? pointer.x : rest.x;
      const targetY = pointer.active ? pointer.y : rest.y;

      // Spring 0.026 / damping 0.91 overshot the target by 37% and rang — that was the
      // wobble. Simulated against a step input, 0.24 / 0.50 overshoots 0.7% and settles in
      // ~0.17s: no perceptible bounce, but still enough lag to draw a trail while moving.
      player.vx += (targetX - player.x) * 0.24;
      player.vy += (targetY - player.y) * 0.24;
      player.vx *= 0.5;
      player.vy *= 0.5;
      player.x += player.vx;
      player.y += player.vy;

      trail.push({ x: player.x, y: player.y });
      if (trail.length > 34) trail.shift();
    };

    const drawPlayer = (time) => {
      if (trail.length > 2) {
        // Quadratic curves through the midpoints of consecutive samples, so the trail is
        // a smooth ribbon rather than a visibly faceted polyline.
        context.beginPath();
        context.moveTo(trail[0].x, trail[0].y);
        for (let index = 1; index < trail.length - 1; index += 1) {
          const point = trail[index];
          const next = trail[index + 1];
          context.quadraticCurveTo(point.x, point.y, (point.x + next.x) / 2, (point.y + next.y) / 2);
        }
        context.lineTo(player.x, player.y);
        const trailGradient = context.createLinearGradient(trail[0].x, trail[0].y, player.x, player.y);
        trailGradient.addColorStop(0, "rgba(255,118,93,0)");
        trailGradient.addColorStop(1, "rgba(255,118,93,.55)");
        context.strokeStyle = trailGradient;
        context.lineWidth = 2.6;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
      }

      const pulse = Math.sin(time * 0.0028) * 1.4;
      context.save();
      context.shadowColor = "rgba(255,118,93,.7)";
      context.shadowBlur = 16;
      context.beginPath();
      context.arc(player.x, player.y, 15 + pulse, 0, Math.PI * 2);
      context.fillStyle = "rgba(255,118,93,.11)";
      context.fill();
      context.beginPath();
      context.arc(player.x, player.y, 6, 0, Math.PI * 2);
      context.fillStyle = "#ff765d";
      context.fill();
      context.shadowBlur = 0;
      context.beginPath();
      context.arc(player.x, player.y, 11 + pulse * 0.35, 0, Math.PI * 2);
      context.strokeStyle = "rgba(243,240,232,.78)";
      context.lineWidth = 1;
      context.stroke();
      context.restore();
    };

    const drawHolds = () => {
      for (let index = holds.length - 1; index >= 0; index -= 1) {
        const hold = holds[index];
        hold.age += 1;
        const alpha = clamp(1 - hold.age / 110);
        const radius = 8 + Math.min(hold.age, 18) * 0.8;
        context.save();
        context.translate(hold.x, hold.y);
        context.rotate(hold.age * 0.008);
        context.strokeStyle = `rgba(255,118,93,${alpha * 0.65})`;
        context.lineWidth = 1;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.stroke();
        context.restore();
        if (hold.age >= 110) holds.splice(index, 1);
      }
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      if (heroInView) {
        drawRally(time);
        updatePlayer();
        drawHolds();
        drawPlayer(time);
      } else {
        drawAmbient(time);
      }
      frame = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = window.requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(frame);
      context.clearRect(0, 0, width, height);
    };

    const heroObserver = new IntersectionObserver(([entry]) => {
      heroInView = entry.isIntersecting;
      canvas.classList.toggle("is-ambient", !entry.isIntersecting);
      if (entry.isIntersecting) start();
      else if (ambientOnly.matches) stop();
    }, { rootMargin: "0px" });

    resize();
    start();
    heroObserver.observe(hero);
    window.addEventListener("resize", resize);
    hero.addEventListener("pointermove", updatePointer, { passive: true });
    hero.addEventListener("pointerleave", releasePointer);
    hero.addEventListener("pointerdown", addHold, { passive: true });
    window.addEventListener("blur", releasePointer);

    return () => {
      stop();
      heroObserver.disconnect();
      window.removeEventListener("resize", resize);
      hero.removeEventListener("pointermove", updatePointer);
      hero.removeEventListener("pointerleave", releasePointer);
      hero.removeEventListener("pointerdown", addHold);
      window.removeEventListener("blur", releasePointer);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return <canvas ref={canvasRef} className="interactive-field" aria-hidden="true" />;
};

export default InteractiveField;
