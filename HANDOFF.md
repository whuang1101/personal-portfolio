# Portfolio UI overhaul — handoff

Branch: `redesign/ui-overhaul` (off `main`, **not committed yet**).
Repo: `~/Documents/Personal Portfolio/redesign-workspace`.
Plan this follows: `~/.claude/plans/silly-bubbling-fountain.md`.

## Read this first — two environment traps

1. **`npm run build` fails in this directory.** esbuild walks up to
   `~/Documents/Personal Portfolio/package.json`, which is in a stuck iCloud state
   (`cat` and `git` both hang there; `brctl download` says the file doesn't exist even
   though `ls` shows it). Build from a mirror outside iCloud instead:

   ```bash
   SRC=~/Documents/Personal\ Portfolio/redesign-workspace
   DEST=/tmp/wh-portfolio-build
   mkdir -p "$DEST"
   rsync -a --delete --exclude node_modules --exclude dist --exclude .git "$SRC/" "$DEST/"
   ln -sfn "$SRC/node_modules" "$DEST/node_modules"
   cd "$DEST" && npx vite build && npx vite preview --port 4317
   ```
   `npm run lint` works fine in the real directory.

2. **Browser automation cannot verify animation.** The MCP tab is permanently
   `document.visibilityState === "hidden"`, so `requestAnimationFrame` never fires
   (measured: 0 frames in 5s). Every framer-motion `whileInView` reveal therefore sits at
   `opacity: 0` and the canvas never animates. Screenshots taken that way make the page
   look broken when it isn't. To capture layout, neutralise motion first:

   ```js
   const s = document.createElement('style');
   s.textContent = '[style*="opacity"]{opacity:1 !important;transform:none !important}';
   document.head.appendChild(s);
   ```
   Anything about animation smoothness, reveal timing or FPS **must** be checked by a
   human in a real visible window.

## Done

- **Interactive field is hero-only.** `InteractiveField.jsx` rewritten: `IntersectionObserver`
  on `#home`; full field (particles, links, climber, holds) while the hero is in view, a
  quiet dot drift at `opacity: .2` below it, and the rAF loop stops entirely off-hero on
  touch/≤820px. Pointer listeners moved from `window` to the hero element. `mode` lives in
  a ref so switching no longer tears down and rebuilds the whole field. Reduced motion now
  renders no canvas at all instead of one frozen frame.
- **Canvas route labels removed.** `drawCareerRoute` is gone — the START/ABOUT/EXPERIENCE
  labels used to draw over body copy in every section. The hero's atlas SVG and the
  traverse rail carry that job now.
- **Canvas hot path.** Link segments batched into 3 alpha buckets (was one `stroke()` per
  pair, ~2,500 draw calls/frame), bounding-box reject before `hypot`, dot fills batched
  into 2 paths, node cap 72→52, canvas DPR capped at 1.25, `mask-image` dropped from the
  per-frame layer, `backdrop-filter` removed from the rail / mode dock / summit marker.
- **One position source of truth.** New `src/lib/sections.js` + `src/hooks/useActiveSection.js`
  (mid-viewport band `IntersectionObserver`, rAF-throttled scroll, cached `scrollHeight`).
  `App.jsx` owns it and feeds both `Header` and the new `TraverseRail.jsx`. `react-scroll`
  and its unreliable `spy` are gone.
- **Header/rail.** `scroll-padding-top: 92px` so jump targets clear the header pill. Rail
  buttons 20px → 28px squares (WCAG 2.5.8), the dead `.traverse-readout` markup now reveals
  on hover/focus, labels appear as tooltips, and the `blur()` that destroyed keyboard focus
  after every jump is removed.
- **Hero hierarchy.** Brand chip outlined instead of filled acid green, so the CTA is the
  only primary green. SUMMIT is a small pill clear of the route terminus (it used to cover
  the PRODUCT label). `min-height: min(100svh, 820px)` + `padding-top: 100px` keeps the CTA
  row and scroll cue above the fold.
- **Rhythm.** `.section` padding `118px` → `clamp(72px, 9vw, 104px)`; footer lost its
  `min-height: 70vh` + centred alignment.
- **Reveals.** Standardised to `viewport={{ once: true, amount: 0.15, margin: "0px 0px -10% 0px" }}`,
  stagger cut to `index * .04`, travel reduced.
- **Projects.** Lumen + The Journal are feature cards; Pixel Finder / KeepInTouch / Odin Book
  became a compact `.project-ledger` index. Image `<a>` is `tabIndex={-1}` + `aria-hidden`
  so it stops duplicating the "Live" link in the tab order. Dropping three unused previews
  cut image payload ~576KB → ~149KB (the 333KB `photo-tagging.webp` was the worst offender).
- **Contact/SEO.** Focus trap + focus restore in `ContactModal.jsx`. GitHub link in the
  footer. `og:image` / `og:url` / `twitter:card` / canonical in `index.html`; fonts moved
  from a render-blocking CSS `@import` to `<link rel="preconnect">` + `<link>`. Generated
  `public/og-image.png` (1200×630), `public/robots.txt`, `public/sitemap.xml`.
  `backend/app.py` now 404s on `api/`, `assets/` and asset-like extensions instead of
  returning the SPA shell with a 200 for every unknown path.
- **Hygiene.** Deleted `IntroGame.jsx` and the five never-imported CSS files
  (`about/header/project/skills/title-page.css`). Removed `three`, `styled-components`,
  `typewriter-effect`, `react-intersection-observer`, `react-scroll` from `package.json`
  — dependencies are now just `framer-motion`, `react`, `react-dom`.
  JS bundle 313KB→284KB raw, 104KB→92KB gzip.
- `--quiet` lifted `#696f78` → `#8b919a` (was ~3.6:1 on `--ink`, failing AA).
- **Climber no longer half-chases the cursor.** Route mode used to target 34% of the way
  toward the pointer with a slow spring, which read as a broken cursor-follower. It now
  holds its own slowly-wandering line; only Rally targets the pointer. Clicks only impulse
  the climber in Rally.
- **Grid mode rebuilt.** Was: whole lattice sliding diagonally forever, one `strokeRect`
  per cell (~480 calls/frame, every shared edge double-drawn so the alpha came out
  mottled), and accent squares keyed off drifting float coords so they flickered at random.
  Now: fixed origin, three batched paths (base lines, a lit region that follows the
  climber, deterministic accents on integer cell indices), and the climber steps cleanly
  cell to cell instead of jittering between snap positions.

## Correction to the original plan

The plan claimed reveal animations "never complete" and that there were "dead screens" of
empty content. **Both observations were artifacts of the hidden-tab throttling above**, not
real defects. The reveal-timing changes were still applied (they are reasonable defaults)
but they were not fixing a confirmed bug. Re-measure in a real browser before doing more
work in that area.

## Not done

- `npm install` has not been re-run after pruning `package.json`, so `package-lock.json`
  is stale. Run `npm install` (outside iCloud, or accept the hang risk) and commit the lock.
- **LinkedIn URL and public email.** `AGENTS.md` forbids adding private contact details to
  public-facing content without Wilson's explicit request, so the footer has GitHub only.
  Ask him for the LinkedIn profile URL and whether he wants a public mailto.
- **`og-image.png` has no text** — no font rasteriser was available. It is on-brand
  (dark ground, contour bands, acid-green route with nodes) but a designed card with his
  name and title would be better.
- **Mobile not verified.** `resize_window` did not change the rendered viewport in this
  environment. Check 390×844 by hand: hero fit, rail pill targets, whether
  `.field-mode-dock` (`position: relative; margin-top: -22px; order: 5` at ≤560px) still
  sits correctly now that it only renders while the hero is visible.
- `global.css` is still one ~2,600-line file; the plan called for splitting it per section.
- Not committed, not deployed. Deploy path is unchanged: `Dockerfile` + `compose.yaml`
  behind the `portfolio.172.206.26.66.nip.io` block in `deploy/Caddyfile.learning-vm`.

## Verify

```bash
cd ~/Documents/Personal\ Portfolio/redesign-workspace && npm run lint   # passes
# build + preview via the /tmp mirror above, then in a REAL browser window:
```
1. Scroll hero → footer: no canvas label, climber or hold over body copy.
2. Header active link, rail, and the section on screen agree at every position.
3. Click every nav item and rail dot: target heading clears the header pill.
4. Tab through: focus never disappears, is trapped in the modal, returns to the trigger.
5. macOS Reduce Motion on → no canvas, all content readable at full opacity.
6. After deploy: `/this-does-not-exist` → 200 (SPA), `/api/nope` and `/nope.txt` → 404,
   `/robots.txt` and `/sitemap.xml` serve real content.
7. Paste the URL into Slack or a LinkedIn composer — OG card should show the image.
