# Interface contracts

These are frozen. Agents build against them and never renegotiate them
unilaterally. If a contract is genuinely wrong, report it — don't edit it.

---

## 1. WebGL module contract

`src/webgl/index.js` MUST export exactly this:

```js
/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ reducedMotion: boolean }} opts
 * @returns {{
 *   start(): void,          // begin RAF loop (idempotent)
 *   stop(): void,           // pause RAF loop (idempotent)
 *   setScroll(p: number): void,  // p = 0..1 page scroll progress
 *   setPointer(x: number, y: number): void, // both -1..1, origin centre
 *   resize(): void,         // re-read canvas client size
 *   dispose(): void,        // free all GPU resources, remove listeners
 * }}
 * @throws if a WebGL context cannot be created
 */
export function createScene(canvas, opts) {}
```

Rules:
- `createScene` **throws** on WebGL failure. It never renders a fallback itself —
  that is the UI layer's job.
- The module owns its own `requestAnimationFrame` loop. It must not run a loop
  before `start()` or after `stop()`/`dispose()`.
- It reads size from `canvas.clientWidth/clientHeight`, never from `window`.
- It attaches **no** DOM listeners outside the canvas. Scroll and pointer come
  in through `setScroll` / `setPointer` only.
- It must not import anything from `src/ui/**` or read the DOM beyond `canvas`.
- `dispose()` must dispose every geometry, material, texture, and the renderer.

## 2. UI → WebGL wiring (UI agent owns this)

`src/main.js`:
- resolves `reducedMotion` from `matchMedia('(prefers-reduced-motion: reduce)')`
- `try { scene = createScene(canvas, { reducedMotion }) } catch { fallback() }`
- on fallback: set `data-webgl="off"` on `<html>`, hide the canvas, and let CSS
  present the static hero. Design agent styles `[data-webgl="off"]`.
- drives `setScroll`/`setPointer` from throttled (rAF-coalesced) listeners
- `IntersectionObserver` on the canvas → `start()` / `stop()`
- `visibilitychange` → `stop()` when hidden, `start()` when visible **and**
  the canvas is still intersecting
- `ResizeObserver` on the canvas → `resize()`

## 3. CSS contract

Design agent defines all tokens on `:root` in `src/styles/tokens.css`.
These token names are required (values are the design agent's call):

```
--color-bg  --color-surface  --color-text  --color-text-muted
--color-accent  --color-accent-contrast  --color-border
--font-display  --font-body
--step--1 --step-0 --step-1 --step-2 --step-3 --step-4   (fluid type scale)
--space-2xs --space-xs --space-s --space-m --space-l --space-xl --space-2xl
--radius  --shadow  --ease  --dur
```

Required hooks the design agent MUST style and the UI agent MUST emit:
- `[data-webgl="off"] .hero` — static CSS hero
- `[data-reveal]` — hidden-before-scroll state; `[data-reveal="in"]` — revealed.
  Under `prefers-reduced-motion: reduce`, `[data-reveal]` is fully visible with
  no transition.
- `.is-open` on `#nav` for the mobile menu
- `[aria-invalid="true"]` on form fields, and `.field-error` for messages

Stylesheet load order, imported by `src/styles/main.css` in this order:
`tokens.css`, `reset.css`, `base.css`, `layout.css`, `components.css`,
`sections.css`, `utilities.css`.

## 4. Palette handoff (design → webgl)

The WebGL agent hardcodes its scene colours from `docs/DESIGN.md` §Palette,
as hex literals in `src/webgl/palette.js`. It does not read CSS at runtime.

## 5. Copy handoff (design → ui)

All final copy lives in `docs/DESIGN.md` §Copy deck. The UI agent transcribes it
verbatim into `index.html`. The UI agent does not invent copy; if the deck is
missing a string, it uses the section heading and flags the gap.

## 6. Definition of done

`npm run build` exits 0, `dist/` serves a working page, no console errors,
no fabricated business facts, and every item in BRIEF.md "quality bar" holds.
