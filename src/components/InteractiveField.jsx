import { useEffect, useRef, useState } from "react";

const modes = [
  { id: "route", label: "Route", hint: "Pull the climber · place holds" },
  { id: "rally", label: "Rally", hint: "Aim the ball · click to serve" },
  { id: "grid", label: "Grid", hint: "Bend the grid · click to warp" },
];

const stops = [
  { id: "home", label: "Start", selector: "#home" },
  { id: "about", label: "About", selector: "#about" },
  { id: "experience", label: "Experience", selector: "#experience" },
  { id: "project", label: "Work", selector: "#project" },
  { id: "skills", label: "Toolkit", selector: "#skills" },
  { id: "contact", label: "Contact", selector: ".site-footer" },
];

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
  const [mode, setMode] = useState("route");
  const [activeStop, setActiveStop] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const random = seededRandom(89);
    const pointer = { x: -1000, y: -1000, active: false };
    const player = { x: 0, y: 0, vx: 0, vy: 0 };
    const trail = [];
    const holds = [];
    let width = 0;
    let height = 0;
    let frame;
    let layoutTimer;
    let nodes = [];
    let sectionMetrics = [];
    let projectCards = [];
    let scrollProgress = 0;
    let activeIndex = 0;
    let initialized = false;
    let frameCount = 0;

    const routePoint = (progress) => {
      const t = clamp(progress);
      return {
        x: width * (0.49 + t * 0.37) + Math.sin(t * Math.PI * 3.2) * width * 0.09,
        y: height * (0.78 - t * 0.56) + Math.cos(t * Math.PI * 4.1) * height * 0.075,
      };
    };

    const createNodes = () => {
      const count = Math.max(36, Math.min(72, Math.floor(width / 20)));
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

    const collectLayout = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      sectionMetrics = stops.flatMap((stop) => {
        const element = document.querySelector(stop.selector);
        if (!element) return [];
        const top = element.getBoundingClientRect().top + window.scrollY;
        return [{ ...stop, element, progress: clamp(top / maxScroll) }];
      });
      projectCards = [...document.querySelectorAll(".project-card")];
    };

    const updateScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollProgress = clamp(window.scrollY / maxScroll);
      document.documentElement.style.setProperty("--traverse-progress", scrollProgress);

      if (sectionMetrics.length) {
        const nextIndex = sectionMetrics.reduce((closest, metric, index) => (
          Math.abs(metric.progress - scrollProgress) < Math.abs(sectionMetrics[closest].progress - scrollProgress)
            ? index
            : closest
        ), 0);
        if (nextIndex !== activeIndex) {
          activeIndex = nextIndex;
          setActiveStop(nextIndex);
        }
        document.documentElement.dataset.routeSection = sectionMetrics[nextIndex].id;
        sectionMetrics.forEach((metric, index) => {
          metric.element.classList.toggle("route-active", index === nextIndex);
        });
      }
    };

    const resize = () => {
      const density = Math.min(window.devicePixelRatio || 1, 1.6);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * density);
      canvas.height = Math.round(height * density);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(density, 0, 0, density, 0, 0);
      createNodes();
      collectLayout();
      updateScroll();
      if (!initialized) {
        const start = routePoint(scrollProgress);
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
      holds.push({ x: event.clientX, y: event.clientY, age: 0, mode });
      if (holds.length > 12) holds.shift();
      const force = mode === "rally" ? 0.045 : mode === "grid" ? 0.03 : 0.022;
      player.vx += (event.clientX - player.x) * force;
      player.vy += (event.clientY - player.y) * force;
    };

    const drawAmbientRoute = (time) => {
      nodes.forEach((node, index) => {
        const driftX = Math.sin(time * 0.00035 + node.phase) * 0.055;
        const driftY = Math.cos(time * 0.00028 + node.phase) * 0.045;
        node.vx += (node.homeX - node.x) * 0.0013 + driftX;
        node.vy += (node.homeY - node.y) * 0.0013 + driftY;

        if (pointer.active) {
          const dx = pointer.x - node.x;
          const dy = pointer.y - node.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 210 && distance > 0) {
            const pull = (1 - distance / 210) * 0.06;
            node.vx += dx * pull * 0.012;
            node.vy += dy * pull * 0.012;
          }
        }

        node.vx *= 0.925;
        node.vy *= 0.925;
        node.x += node.vx;
        node.y += node.vy;

        for (let otherIndex = index + 1; otherIndex < nodes.length; otherIndex += 1) {
          const other = nodes[otherIndex];
          const distance = Math.hypot(node.x - other.x, node.y - other.y);
          if (distance < 122) {
            context.beginPath();
            context.moveTo(node.x, node.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(199,255,84,${(1 - distance / 122) * 0.15})`;
            context.lineWidth = 0.7;
            context.stroke();
          }
        }

        context.beginPath();
        context.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        context.fillStyle = index % 9 === 0 ? "rgba(199,255,84,.65)" : "rgba(243,240,232,.24)";
        context.fill();
      });
    };

    const drawRally = (time) => {
      const pad = Math.max(32, width * 0.045);
      context.strokeStyle = "rgba(243,240,232,.09)";
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

      for (let ball = 0; ball < 2; ball += 1) {
        for (let ghost = 13; ghost >= 0; ghost -= 1) {
          const offsetTime = time - ghost * 18;
          const x = width / 2 + Math.sin(offsetTime * (0.00046 + ball * 0.00006) + ball * 2.1) * width * 0.42;
          const y = height / 2 + Math.sin(offsetTime * (0.00089 + ball * 0.00005) + ball) * height * 0.34;
          const alpha = (1 - ghost / 14) * 0.22;
          context.beginPath();
          context.arc(x, y, ghost === 0 ? 3.8 : 1.2, 0, Math.PI * 2);
          context.fillStyle = ball === 0
            ? `rgba(255,118,93,${alpha})`
            : `rgba(199,255,84,${alpha})`;
          context.fill();
        }
      }
    };

    const drawGrid = (time) => {
      const size = width < 640 ? 38 : 54;
      const shiftX = (time * 0.012) % size;
      const shiftY = (time * 0.007) % size;
      for (let x = -size + shiftX; x < width + size; x += size) {
        for (let y = -size + shiftY; y < height + size; y += size) {
          const distance = Math.hypot(player.x - x, player.y - y);
          const glow = Math.max(0, 1 - distance / 260);
          context.strokeStyle = `rgba(150,130,255,${0.045 + glow * 0.24})`;
          context.lineWidth = glow > 0.2 ? 1.2 : 0.6;
          context.strokeRect(x, y, size, size);
          if (((x + y) / size) % 7 < 1) {
            context.fillStyle = `rgba(199,255,84,${0.025 + glow * 0.18})`;
            context.fillRect(x + size * 0.42, y + size * 0.42, size * 0.16, size * 0.16);
          }
        }
      }
    };

    const drawCareerRoute = (time) => {
      context.save();
      context.beginPath();
      for (let index = 0; index <= 64; index += 1) {
        const point = routePoint(index / 64);
        if (index === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }
      context.strokeStyle = mode === "grid" ? "rgba(150,130,255,.3)" : "rgba(199,255,84,.22)";
      context.lineWidth = 1.2;
      context.setLineDash([4, 8]);
      context.stroke();
      context.setLineDash([]);

      sectionMetrics.forEach((metric, index) => {
        const point = routePoint(metric.progress);
        const isActive = index === activeIndex;
        const isComplete = metric.progress <= scrollProgress;
        const pulse = isActive ? 3 + Math.sin(time * 0.006) * 2 : 0;
        context.beginPath();
        context.arc(point.x, point.y, (isActive ? 9 : 5) + pulse, 0, Math.PI * 2);
        context.fillStyle = isActive
          ? "rgba(199,255,84,.18)"
          : isComplete ? "rgba(199,255,84,.1)" : "rgba(243,240,232,.04)";
        context.fill();
        context.beginPath();
        context.arc(point.x, point.y, isActive ? 4.5 : 2.5, 0, Math.PI * 2);
        context.fillStyle = isComplete || isActive ? "#c7ff54" : "rgba(243,240,232,.38)";
        context.fill();
        context.fillStyle = isActive ? "rgba(243,240,232,.82)" : "rgba(243,240,232,.18)";
        context.font = "9px monospace";
        context.letterSpacing = "1px";
        context.fillText(metric.label.toUpperCase(), point.x + 13, point.y + 4);
      });
      context.restore();
    };

    const updatePlayer = () => {
      const routeTarget = routePoint(scrollProgress);
      let targetX = routeTarget.x;
      let targetY = routeTarget.y;
      let spring = 0.018;
      let damping = 0.88;

      if (mode === "route" && pointer.active) {
        targetX += (pointer.x - routeTarget.x) * 0.34;
        targetY += (pointer.y - routeTarget.y) * 0.34;
      } else if (mode === "rally" && pointer.active) {
        targetX = pointer.x;
        targetY = pointer.y;
        spring = 0.026;
        damping = 0.91;
      } else if (mode === "grid") {
        const grid = width < 640 ? 38 : 54;
        targetX = Math.round((routeTarget.x + (pointer.active ? (pointer.x - routeTarget.x) * 0.18 : 0)) / grid) * grid;
        targetY = Math.round((routeTarget.y + (pointer.active ? (pointer.y - routeTarget.y) * 0.18 : 0)) / grid) * grid;
        spring = 0.032;
        damping = 0.82;
      }

      player.vx += (targetX - player.x) * spring;
      player.vy += (targetY - player.y) * spring;
      player.vx *= damping;
      player.vy *= damping;
      player.x += player.vx;
      player.y += player.vy;

      if (!reducedMotion) {
        trail.push({ x: player.x, y: player.y });
        if (trail.length > 54) trail.shift();
      }
    };

    const drawPlayer = (time) => {
      if (trail.length > 2) {
        context.beginPath();
        trail.forEach((point, index) => {
          if (index === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        });
        const trailGradient = context.createLinearGradient(
          trail[0].x,
          trail[0].y,
          player.x,
          player.y,
        );
        trailGradient.addColorStop(0, "rgba(199,255,84,0)");
        trailGradient.addColorStop(1, mode === "rally" ? "rgba(255,118,93,.7)" : "rgba(199,255,84,.72)");
        context.strokeStyle = trailGradient;
        context.lineWidth = mode === "rally" ? 3.2 : 2.2;
        context.stroke();
      }

      const pulse = Math.sin(time * 0.006) * 2;
      context.save();
      context.shadowColor = mode === "rally" ? "rgba(255,118,93,.85)" : "rgba(199,255,84,.9)";
      context.shadowBlur = 28;
      context.beginPath();
      context.arc(player.x, player.y, 17 + pulse, 0, Math.PI * 2);
      context.fillStyle = mode === "rally" ? "rgba(255,118,93,.14)" : "rgba(199,255,84,.13)";
      context.fill();
      context.beginPath();
      context.arc(player.x, player.y, mode === "grid" ? 7 : 6, 0, Math.PI * 2);
      context.fillStyle = mode === "rally" ? "#ff765d" : "#c7ff54";
      context.fill();
      context.shadowBlur = 0;
      context.beginPath();
      context.arc(player.x, player.y, 11 + pulse * 0.35, 0, Math.PI * 2);
      context.strokeStyle = "rgba(243,240,232,.78)";
      context.lineWidth = 1;
      context.stroke();
      context.fillStyle = "rgba(243,240,232,.74)";
      context.font = "9px monospace";
      context.fillText(`WH / ${mode.toUpperCase()}`, player.x + 22, player.y - 16);
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
        context.strokeStyle = hold.mode === "rally"
          ? `rgba(255,118,93,${alpha * 0.65})`
          : `rgba(199,255,84,${alpha * 0.62})`;
        context.lineWidth = 1;
        context.beginPath();
        if (hold.mode === "grid") {
          context.rect(-radius, -radius, radius * 2, radius * 2);
        } else if (hold.mode === "rally") {
          context.arc(0, 0, radius, 0, Math.PI * 2);
        } else {
          context.moveTo(0, -radius);
          context.lineTo(radius * 0.9, radius * 0.65);
          context.lineTo(-radius * 0.9, radius * 0.65);
          context.closePath();
        }
        context.stroke();
        context.restore();
        if (hold.age >= 110) holds.splice(index, 1);
      }
    };

    const updateProjectProximity = () => {
      projectCards.forEach((card) => {
        const visual = card.querySelector(".project-visual");
        if (!visual) return;
        const rect = visual.getBoundingClientRect();
        const nearestX = clamp(player.x, rect.left, rect.right);
        const nearestY = clamp(player.y, rect.top, rect.bottom);
        const distance = Math.hypot(player.x - nearestX, player.y - nearestY);
        const proximity = clamp(1 - distance / 320);
        if (proximity > 0.06 && rect.bottom > 0 && rect.top < height) {
          card.classList.add("is-player-near");
          visual.style.setProperty("--player-proximity", proximity.toFixed(3));
          visual.style.setProperty("--player-spot-x", `${((player.x - rect.left) / rect.width) * 100}%`);
          visual.style.setProperty("--player-spot-y", `${((player.y - rect.top) / rect.height) * 100}%`);
        } else {
          card.classList.remove("is-player-near");
          visual.style.removeProperty("--player-proximity");
        }
      });
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      if (mode === "route") drawAmbientRoute(time);
      if (mode === "rally") drawRally(time);
      if (mode === "grid") drawGrid(time);
      drawCareerRoute(time);
      updatePlayer();
      drawHolds();
      drawPlayer(time);
      frameCount += 1;
      if (frameCount % 3 === 0) updateProjectProximity();
      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    layoutTimer = window.setTimeout(() => {
      collectLayout();
      updateScroll();
    }, 600);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("pointerleave", releasePointer);
    window.addEventListener("blur", releasePointer);
    window.addEventListener("pointerdown", addHold, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(layoutTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerleave", releasePointer);
      window.removeEventListener("blur", releasePointer);
      window.removeEventListener("pointerdown", addHold);
      projectCards.forEach((card) => card.classList.remove("is-player-near"));
      sectionMetrics.forEach((metric) => metric.element.classList.remove("route-active"));
      document.documentElement.removeAttribute("data-route-section");
      document.documentElement.style.removeProperty("--traverse-progress");
    };
  }, [mode]);

  const scrollToStop = (stop) => {
    document.querySelector(stop.selector)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  };

  const currentMode = modes.find((item) => item.id === mode);

  return (
    <>
      <canvas ref={canvasRef} className={`interactive-field field-${mode}`} data-pointer-reactive aria-hidden="true" />
      <aside className="traverse-progress" data-active-stop={activeStop} aria-label="Portfolio route progress">
        <div className="traverse-readout">
          <span>{String(activeStop + 1).padStart(2, "0")} / {String(stops.length).padStart(2, "0")}</span>
          <strong>{stops[activeStop]?.label}</strong>
        </div>
        <nav aria-label="Jump to route checkpoint">
          {stops.map((stop, index) => (
            <button
              key={stop.id}
              type="button"
              aria-label={`Go to ${stop.label}`}
              aria-current={index === activeStop ? "step" : undefined}
              title={stop.label}
              onClick={(event) => {
                scrollToStop(stop);
                event.currentTarget.blur();
              }}
            >
              <i /><span>{stop.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <aside className="field-mode-dock" aria-label="Interactive background mode">
        <span><i />TRAVERSE / LIVE</span>
        <div role="group" aria-label="Choose player physics">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              data-field-mode={item.id}
              aria-pressed={mode === item.id}
              title={item.hint}
              onClick={() => setMode(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <small>{currentMode?.hint}</small>
      </aside>
    </>
  );
};

export default InteractiveField;
