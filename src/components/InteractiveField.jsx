import { useEffect, useRef, useState } from "react";

const modes = [
  { id: "route", label: "Route", hint: "climbing field" },
  { id: "rally", label: "Rally", hint: "court physics" },
  { id: "grid", label: "Grid", hint: "game system" },
];

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const random = seededRandom(89);
    const pointer = { x: -1000, y: -1000, active: false };
    const bursts = [];
    let width = 0;
    let height = 0;
    let frame;
    let nodes = [];

    const createNodes = () => {
      const count = Math.max(36, Math.min(76, Math.floor(width / 19)));
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
      const density = Math.min(window.devicePixelRatio || 1, 1.6);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * density);
      canvas.height = Math.round(height * density);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(density, 0, 0, density, 0, 0);
      createNodes();
    };

    const updatePointer = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const releasePointer = () => {
      pointer.active = false;
    };

    const addBurst = (event) => {
      if (event.target instanceof Element && event.target.closest("input, textarea")) return;
      bursts.push({ x: event.clientX, y: event.clientY, age: 0 });
    };

    const drawBursts = () => {
      for (let index = bursts.length - 1; index >= 0; index -= 1) {
        const burst = bursts[index];
        burst.age += 1;
        const radius = 12 + burst.age * 3.4;
        context.beginPath();
        context.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
        context.strokeStyle = `rgba(199,255,84,${Math.max(0, 0.34 - burst.age * 0.016)})`;
        context.lineWidth = 1;
        context.stroke();
        if (burst.age > 22) bursts.splice(index, 1);
      }
    };

    const drawRoute = (time) => {
      nodes.forEach((node, index) => {
        const driftX = Math.sin(time * 0.00035 + node.phase) * 0.055;
        const driftY = Math.cos(time * 0.00028 + node.phase) * 0.045;
        node.vx += (node.homeX - node.x) * 0.0013 + driftX;
        node.vy += (node.homeY - node.y) * 0.0013 + driftY;

        if (pointer.active) {
          const dx = pointer.x - node.x;
          const dy = pointer.y - node.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 190 && distance > 0) {
            const pull = (1 - distance / 190) * 0.055;
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
          if (distance < 118) {
            context.beginPath();
            context.moveTo(node.x, node.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(199,255,84,${(1 - distance / 118) * 0.13})`;
            context.lineWidth = 0.7;
            context.stroke();
          }
        }

        context.beginPath();
        context.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        context.fillStyle = index % 9 === 0 ? "rgba(199,255,84,.62)" : "rgba(243,240,232,.23)";
        context.fill();
      });

      const anchors = [...nodes].sort((a, b) => a.y - b.y).filter((_, index) => index % 11 === 0).slice(0, 7);
      if (anchors.length > 2) {
        context.beginPath();
        anchors.forEach((node, index) => {
          if (index === 0) context.moveTo(node.x, node.y);
          else context.lineTo(node.x, node.y);
        });
        context.strokeStyle = "rgba(199,255,84,.26)";
        context.lineWidth = 1.4;
        context.stroke();
      }
    };

    const drawRally = (time) => {
      const pad = Math.max(32, width * 0.045);
      context.strokeStyle = "rgba(243,240,232,.075)";
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

      for (let ball = 0; ball < 3; ball += 1) {
        for (let trail = 18; trail >= 0; trail -= 1) {
          const offsetTime = time - trail * 17;
          const x = width / 2 + Math.sin(offsetTime * (0.00042 + ball * 0.00004) + ball * 2.1) * width * 0.42;
          const y = height / 2 + Math.sin(offsetTime * (0.00083 + ball * 0.00005) + ball) * height * 0.34;
          const pointerShiftX = pointer.active ? (pointer.x - width / 2) * 0.04 : 0;
          const pointerShiftY = pointer.active ? (pointer.y - height / 2) * 0.035 : 0;
          const alpha = (1 - trail / 19) * 0.34;
          context.beginPath();
          context.arc(x + pointerShiftX, y + pointerShiftY, trail === 0 ? 4.2 : 1.4, 0, Math.PI * 2);
          context.fillStyle = ball === 0
            ? `rgba(255,118,93,${alpha})`
            : `rgba(199,255,84,${alpha * 0.72})`;
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
          const distance = pointer.active ? Math.hypot(pointer.x - x, pointer.y - y) : 500;
          const glow = Math.max(0, 1 - distance / 240);
          context.strokeStyle = `rgba(150,130,255,${0.035 + glow * 0.23})`;
          context.lineWidth = glow > 0.2 ? 1.2 : 0.6;
          context.strokeRect(x, y, size, size);
          if (((x + y) / size) % 7 < 1) {
            context.fillStyle = `rgba(199,255,84,${0.025 + glow * 0.16})`;
            context.fillRect(x + size * 0.42, y + size * 0.42, size * 0.16, size * 0.16);
          }
        }
      }

      if (pointer.active) {
        context.beginPath();
        context.arc(pointer.x, pointer.y, 58 + Math.sin(time * 0.005) * 7, 0, Math.PI * 2);
        context.strokeStyle = "rgba(150,130,255,.34)";
        context.stroke();
        context.beginPath();
        context.moveTo(pointer.x - 82, pointer.y);
        context.lineTo(pointer.x + 82, pointer.y);
        context.moveTo(pointer.x, pointer.y - 82);
        context.lineTo(pointer.x, pointer.y + 82);
        context.strokeStyle = "rgba(199,255,84,.16)";
        context.stroke();
      }
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      if (mode === "route") drawRoute(time);
      if (mode === "rally") drawRally(time);
      if (mode === "grid") drawGrid(time);
      drawBursts();
      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("pointerleave", releasePointer);
    window.addEventListener("pointerdown", addBurst, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerleave", releasePointer);
      window.removeEventListener("pointerdown", addBurst);
    };
  }, [mode]);

  return (
    <>
      <canvas ref={canvasRef} className={`interactive-field field-${mode}`} data-pointer-reactive aria-hidden="true" />
      <aside className="field-mode-dock" aria-label="Interactive background mode">
        <span><i />FIELD / LIVE</span>
        <div role="group" aria-label="Choose a hobby field">
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
        <small>Move + click</small>
      </aside>
    </>
  );
};

export default InteractiveField;
