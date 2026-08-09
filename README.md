# Ital Group — website

A single-page marketing site with a WebGL hero, for **Ital Group**, a general
construction company in Woodbridge, Ontario.

- **Phone:** 416-557-2381
- **Email:** info@italgroup.ca
- **Address:** 75 Moonstone Pl, Woodbridge, ON, L4L 2G2

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run verify` | Run the contract / a11y / SEO / fabricated-fact checks |
| `npm run check` | `build` then `verify` — use this before shipping |

`node scripts/check-framing.mjs` projects the hero geometry through the real
camera math across seven viewports and reports whether any of the structure
falls outside the frustum. Run it after changing the frame config, the field of
view, or the camera path in `src/webgl/index.js`.

`dist/` is plain static files. Any static host works (Netlify, Vercel, S3,
nginx). There is no server-side component.

## Architecture

```
index.html            Single page, all sections, JSON-LD, meta
src/
  main.js             Boot + WebGL/DOM wiring (scroll, pointer, observers)
  webgl/              three.js hero scene — isolated behind one interface
    index.js          exports createScene(canvas, opts)
    palette.js        scene hexes, mirrored from the design palette
  ui/                 nav, scroll reveal, form validation, smooth scroll
  styles/             tokens → reset → base → layout → components → sections → utilities
public/               favicon, robots.txt, the two illustration plates
                      (about.svg, process-elevation.svg) — copied verbatim to dist/
docs/
  BRIEF.md            Source of truth: facts, scope, quality bar
  CONTRACTS.md        Frozen interfaces between the layers
  DESIGN.md           Design spec, palette, type scale, copy deck, class contract,
                      illustration system
  CONTENT.md          Alt text, copy audit, metadata review
scripts/verify.mjs    Executable quality bar
```

### Why the layers are split this way

The WebGL scene talks to the page through exactly one interface
(`CONTRACTS.md` §1): `start`, `stop`, `setScroll`, `setPointer`, `resize`,
`dispose`. It attaches no listeners outside its canvas and never reads the DOM.
So the hero can be rewritten, or swapped for a different effect, without
touching a line of page code — and the page degrades correctly when the scene
is unavailable, because "unavailable" is just `createScene` throwing.

`main.js` owns every browser event and feeds values in. That keeps scroll and
pointer handling rAF-coalesced in one place instead of scattered across modules.

## Graceful degradation

The page is built to stay usable in three failure modes:

1. **No WebGL** — `createScene` throws, `<html>` gets `data-webgl="off"`, and a
   CSS-only hero takes over. Not a grey box; a designed fallback.
2. **`prefers-reduced-motion: reduce`** — the scene renders a single static
   frame with no animation loop, and all scroll-reveal is disabled.
3. **Off-screen / hidden tab** — an `IntersectionObserver` and
   `visibilitychange` pause the render loop so the GPU isn't spinning on a
   canvas nobody can see.

## Content the client still needs to supply

Nothing on this site claims a fact that wasn't provided. No invented founding
year, project count, certifications, testimonials, or awards. Placeholders are
explicit — see `docs/DESIGN.md` §Copy deck → *Placeholder flags*:

- Map embed or directions link for the contact section — the only one left.

No photography is used anywhere on the site — illustration is the permanent art
direction (see `docs/DESIGN.md` §Illustration system).

> The `#projects` gallery section was removed at the client's request. Its
> markup, styles, and copy deck entries are gone; `docs/DESIGN.md` still
> contains the original spec should it ever come back.

## Before going live

- [ ] Replace the canonical URL and `og:url` with the real domain
- [ ] Add an OG share image (1200×630) and point `og:image` at it
- [ ] Update `public/robots.txt` sitemap host
- [ ] Decide how the contact form should deliver (see below)

### Contact form

There is no backend in this repo, so the form does not post anywhere. It
validates client-side and directs the visitor to call or email rather than
showing a fake "message sent" confirmation. To make it actually deliver, wire
the submit handler in `src/ui/` to a form service (Formspree, Netlify Forms,
Basin) or your own endpoint, and only then show a success state.
