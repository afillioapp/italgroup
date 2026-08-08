# Ital Group — Project Brief (source of truth)

## Business facts — DO NOT INVENT OR ALTER
- **Name:** Ital Group
- **Sector:** General construction
- **Phone:** 416-557-2381 (tel link: `tel:+14165572381`)
- **Email:** info@italgroup.ca (mailto link: `mailto:info@italgroup.ca`)
- **Address:** 75 Moonstone Pl, Woodbridge, ON, L4L 2G2

Nothing else about this company is known. Do **not** fabricate: founding years,
number of employees, client names, project names, testimonials, certifications,
licence numbers, award claims, or statistics. Where a section would normally
carry such proof, use non-factual, non-numeric copy or a clearly generic
placeholder marked `<!-- PLACEHOLDER: client to supply -->`.

## Deliverable
A single-page (one-pager) marketing website with a WebGL hero experience.

## Stack (fixed — do not change)
- Vite 7 + vanilla JS (ES modules), no framework
- three.js (bundled via npm, imported as `import * as THREE from 'three'`)
- Plain CSS with custom properties. No CSS framework, no Tailwind, no CDN links.
- Everything must build with `npm run build` and work from `dist/` as static files.

## Sections (in order, single page, anchor-scrolled)
1. `#hero` — WebGL canvas + headline + primary CTA
2. `#services` — what a general contractor does (build, renovate, manage)
3. `#process` — how a job runs, step by step
4. `#projects` — visual gallery (placeholder imagery, clearly marked)
5. `#about` — short positioning statement
6. `#contact` — phone, email, address, map-less location block, contact form
7. `footer`

## Non-negotiable quality bar
- **Performance:** WebGL must cap at the display refresh, pause when the canvas
  is off-screen (IntersectionObserver) or the tab is hidden, and clamp
  `devicePixelRatio` to 2. Total JS payload target < 700 KB gzipped.
- **Accessibility:** WCAG 2.2 AA. Real landmarks, one `<h1>`, visible focus
  rings, 4.5:1 text contrast, form labels tied to inputs.
- **`prefers-reduced-motion`:** the WebGL scene must degrade to a static frame
  and all scroll/entrance animation must be disabled.
- **No-WebGL fallback:** if `WebGLRenderingContext` is unavailable or context
  creation fails, show a CSS-only hero. The page must never be blank.
- **Mobile:** works at 360px wide. WebGL runs at reduced quality below 768px.
- **SEO:** title, meta description, canonical, Open Graph, and a
  `LocalBusiness`/`GeneralContractor` JSON-LD block using the facts above.

## File ownership (agents must stay inside their lane)
| Path | Owner |
|---|---|
| `docs/DESIGN.md`, `src/styles/**` | Design agent |
| `src/webgl/**` | WebGL agent |
| `index.html`, `src/ui/**`, `src/main.js` | UI agent |
| `package.json`, `vite.config.js`, contracts | Lead tech |

No agent edits a file it does not own. Cross-lane needs go through the contracts
in `docs/CONTRACTS.md`.
