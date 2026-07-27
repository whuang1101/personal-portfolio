import { SECTIONS, scrollToSection } from "../lib/sections.js";

// eslint-disable-next-line react/prop-types
const TraverseRail = ({ activeIndex }) => (
  <aside className="traverse-progress" data-active-stop={activeIndex} aria-label="Portfolio route progress">
    <div className="traverse-readout">
      <span>{String(activeIndex + 1).padStart(2, "0")} / {String(SECTIONS.length).padStart(2, "0")}</span>
      <strong>{SECTIONS[activeIndex]?.label}</strong>
    </div>
    <nav aria-label="Jump to route checkpoint">
      {SECTIONS.map((stop, index) => (
        <button
          key={stop.id}
          type="button"
          aria-label={`Go to ${stop.label}`}
          aria-current={index === activeIndex ? "step" : undefined}
          onClick={() => scrollToSection(stop.selector)}
        >
          <i aria-hidden="true" /><span>{stop.label}</span>
        </button>
      ))}
    </nav>
  </aside>
);

export default TraverseRail;
