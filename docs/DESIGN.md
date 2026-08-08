# Ital Group — Design Spec + Copy Deck

Design agent deliverable. Binds the UI and WebGL agents. Do not deviate from
the copy deck or the class contract without updating this file.

---

## §Direction

Construction marketing has a uniform: safety orange, gunmetal grey, a diagonal
stripe motif borrowed from hazard tape, and a stock photo of a man in a hard
hat pointing at a blueprint. It reads as a flyer stapled to a lumber yard
noticeboard, not as a firm that closes $2M contracts. We are not doing that.

Ital Group's site commits to a **dark, material, architectural** register:
near-black graphite as the dominant surface, a warm paper-white for content,
and exactly one accent — a brass/ochre tone pulled from structural hardware
and drafting ink, not from a hi-vis vest. Dark-first is a deliberate choice,
not a trend chase: a dark canvas makes the WebGL scene (steel-toned geometry,
a single warm key light) feel like it belongs to the page instead of sitting
in a box on top of it, and it reads as considered rather than loud. Typography
is a plain, confident system sans — no slab serifs doing "industrial," no
italic scripts doing "craftsmanship." Motion is minimal and physical: things
settle into place, they don't bounce or spin.

What we are deliberately NOT doing: no orange-and-grey hazard palette, no
diagonal caution-stripe backgrounds, no stock photography of hard hats or
handshakes, no invented statistics or client logos to manufacture trust, no
skeuomorphic "blueprint paper" textures, no more than one accent colour, no
gradient-mesh hero backgrounds, no bouncy/elastic easing anywhere. The site
earns trust through restraint, precision of layout, and a WebGL scene that
demonstrates engineering competence rather than illustrating it.

---

## §Palette

**Decision: dark-first.** `--color-bg` is the near-black graphite surface the
whole page is built on; a light theme is not shipped in v1. Rationale: a dark
ground unifies the DOM and the WebGL canvas into one surface (see WebGL scene
colours below), and it is the least "flyer" choice available in this category.

| Token | Hex | Role |
|---|---|---|
| `--color-bg` | `#121316` | Page background, near-black warm graphite |
| `--color-surface` | `#1B1D21` | Cards, nav bar, form fields, raised panels |
| `--color-text` | `#F3F1EC` | Primary text — warm paper white, not pure white |
| `--color-text-muted` | `#A6ABB3` | Secondary text, captions, meta labels |
| `--color-accent` | `#C9A24B` | Brass/ochre — links, icons, CTA fill, focus rings |
| `--color-accent-contrast` | `#14151A` | Text/icon colour placed ON the accent fill |
| `--color-border` | `#2B2E33` | Hairline borders, dividers, input outlines |
| `--color-error` | `#E5646B` | Form validation error text/border |

### Measured contrast ratios

Computed with the standard WCAG relative-luminance formula (sRGB → linear →
0.2126R+0.7152G+0.0722B), ratio = (L1+0.05)/(L2+0.05).

| Pair | Ratio | Requirement | Result |
|---|---|---|---|
| `--color-text` on `--color-bg` (body text) | **16.46:1** | ≥4.5:1 | Pass |
| `--color-text-muted` on `--color-bg` (muted text) | **8.05:1** | ≥4.5:1 | Pass |
| `--color-accent-contrast` on `--color-accent` (button label) | **7.60:1** | ≥4.5:1 | Pass |
| `--color-accent` on `--color-bg` (links, large 24px+ use) | **7.74:1** | ≥3:1 | Pass |
| `--color-text` on `--color-surface` | **14.95:1** | ≥4.5:1 | Pass |
| `--color-error` on `--color-bg` | **5.63:1** | ≥4.5:1 | Pass |

All required pairs clear AA with margin; nothing here is riding the line.

### WebGL scene colours

Hardcoded by the WebGL agent in `src/webgl/palette.js`. Chosen to sit on the
same graphite/brass axis as the page so the canvas reads as one surface with
the DOM, not an inset video.

| Role | Hex | Notes |
|---|---|---|
| Key light | `#F3E4C0` | Warm, slightly desaturated white-gold — matches the brass accent family |
| Fill light | `#3B4854` | Cool steel-blue-grey, low intensity, softens shadow side |
| Material base | `#2C2E33` | Graphite — close to `--color-surface`, reads as brushed metal/concrete |
| Accent / emissive | `#C9A24B` | Identical hex to `--color-accent` — the one warm accent in the scene |
| Secondary material | `#1B1D21` | Identical hex to `--color-surface`, for recessed/shadowed geometry |
| Fog / background | `#121316` | Identical hex to `--color-bg` — canvas edges dissolve into the page |

---

## §Type

No CDN or external font requests are permitted at runtime. Shipping default
is a system font stack for both roles — no self-hosted webfont is bundled in
v1. If a brand display face is licensed later, self-host the `.woff2` under
`public/fonts/`, `@font-face` it in `base.css` with `font-display: swap`, and
prepend it to `--font-display` only; do not touch `--font-body`.

```css
--font-display: -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
--font-body: -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
```

Both roles share one system stack on purpose — the differentiation between
display and body comes from weight (700 vs 400-500) and tracking, not typeface
switching, which keeps the system-font look from feeling like two different
sites bolted together.

### Fluid type scale

`clamp(min, preferred, max)`, min sized for 360px viewport, max for 1440px.
Preferred uses `vw` so it scales smoothly between.

```css
--step--1: clamp(0.8rem, 0.77rem + 0.16vw, 0.9rem);
--step-0:  clamp(1rem, 0.95rem + 0.24vw, 1.15rem);
--step-1:  clamp(1.25rem, 1.16rem + 0.43vw, 1.5rem);
--step-2:  clamp(1.56rem, 1.42rem + 0.72vw, 2rem);
--step-3:  clamp(1.95rem, 1.72rem + 1.16vw, 2.65rem);
--step-4:  clamp(2.44rem, 2.06rem + 1.88vw, 3.5rem);
```

Rendered px at root `font-size: 16px` (no user zoom):

| Token | 360px viewport | 1440px viewport | Typical use |
|---|---|---|---|
| `--step--1` | 12.8px | 14.4px | Fine print, labels |
| `--step-0` | 16.0px | 18.4px | Body text |
| `--step-1` | 20.0px | 24.0px | Lead paragraph, card titles |
| `--step-2` | 25.0px | 32.0px | Section eyebrow/sub-heads |
| `--step-3` | 31.2px | 42.4px | Section H2 |
| `--step-4` | 39.0px | 56.0px | Hero H1 |

---

## §Space, radius, motion

```css
--space-2xs: 0.25rem;   /* 4px */
--space-xs:  0.5rem;    /* 8px */
--space-s:   0.75rem;   /* 12px */
--space-m:   1.25rem;   /* 20px */
--space-l:   2rem;      /* 32px */
--space-xl:  3.25rem;   /* 52px */
--space-2xl: 5.25rem;   /* 84px */

--radius: 4px;
--shadow: 0 12px 32px -12px rgb(0 0 0 / 0.5);

--ease: cubic-bezier(0.22, 0.61, 0.36, 1);
--dur: 240ms;
```

The spacing scale is loosely Fibonacci-derived, kept to 7 steps so nothing on
the page has an ambiguous "is this the same gap as that" moment. Radius is a
small, consistent 4px — sharp enough to feel structural, not a rounded "app"
UI. `--shadow` is a single soft, low-opacity drop used sparingly on raised
surfaces (cards, the open mobile nav).

**Motion philosophy, one sentence:** motion exists only to confirm cause and
effect — an element entering because you scrolled to it, a control responding
because you touched it — never to decorate, so every transition is short,
uses a single settle-style ease, and has no bounce, spin, or looping idle
animation.

---

## §Section-by-section layout

Grid convention: 12-column grid, `max-width: 1200px`, gutters `--space-l`,
container padding `--space-m` (mobile) growing to `--space-xl` (desktop) via
`layout.css`.

### `#hero`

```
┌─────────────────────────────────────────────────────────┐
│ NAV: [ITAL GROUP]                [Services Process       │
│                                    Projects About Contact]│
│                                          [Get a Quote]    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│   (full-bleed WebGL canvas, cols 1-12, behind content)   │
│                                                           │
│   col 2-8:  EYEBROW: General Construction · Woodbridge   │
│             H1: Built right. Built on time.               │
│             P:  lede copy, 2 lines max                    │
│             [Get a Quote →]   [See Our Process]           │
│                                                           │
│                                          col 9-12: empty  │
│                                          (scene reads here)│
└─────────────────────────────────────────────────────────┘
```

360px: canvas stays full-bleed behind content (or CSS gradient hero if
`data-webgl="off"`); nav collapses to logo + hamburger; H1/eyebrow/P/buttons
stack full-width, centred text, single column, buttons stack vertically
full-width.

### `#services`

```
┌─────────────────────────────────────────────────────────┐
│ EYEBROW: What We Do        H2: Three ways we build with you│
├───────────────┬───────────────┬───────────────────────────┤
│ col 1-4       │ col 5-8       │ col 9-12                   │
│ [icon]        │ [icon]        │ [icon]                     │
│ Build         │ Renovate      │ Manage                     │
│ body copy     │ body copy     │ body copy                  │
└───────────────┴───────────────┴───────────────────────────┘
```

360px: 3-column grid collapses to a single column stack, one card per row,
full-width, icon-left/text-right within each card if width ≥480px, otherwise
icon-above-text.

### `#process`

```
┌─────────────────────────────────────────────────────────┐
│ EYEBROW: How It Runs       H2: From first call to final walkthrough│
├────┬──────────────────┬────┬──────────────────┬──────────┤
│ 01 │ Scope & estimate │ 02 │ Permits & plan   │  (etc.)  │
│    │ body copy        │    │ body copy        │          │
├────┴──────────────────┴────┴──────────────────┴──────────┤
│         (horizontal connecting line under numerals)       │
└─────────────────────────────────────────────────────────┘
```
4-step row, cols split 3/3/3/3 with a connecting `::before` line under the
numerals. 360px: connecting line becomes a single vertical rule on the left;
steps stack full-width, numeral+line to the left of each stacked step
(timeline layout).

### `#projects`

```
┌─────────────────────────────────────────────────────────┐
│ EYEBROW: Recent Work        H2: A look at the job site   │
├───────────────┬───────────────┬───────────────────────────┤
│ col 1-4       │ col 5-8       │ col 9-12                   │
│ [placeholder  │ [placeholder  │ [placeholder                │
│  image 4:3]   │  image 4:3]   │  image 4:3]                 │
│ caption       │ caption       │ caption                     │
├───────────────┼───────────────┼───────────────────────────┤
│ [placeholder] │ [placeholder] │ [placeholder]                │
│ caption       │ caption       │ caption                     │
└───────────────┴───────────────┴───────────────────────────┘
```
3-column, 2-row gallery (6 tiles). 360px: single column, one tile per row,
full-width, image aspect ratio held at 4:3 via `aspect-ratio`.

### `#about`

```
┌─────────────────────────────────────────────────────────┐
│ col 1-6                        │ col 7-12                │
│ EYEBROW: About Ital Group      │ (decorative — thin rule │
│ H2: A general contractor       │  + WebGL-adjacent visual│
│     that runs its own jobs     │  motif, or empty space  │
│ body copy (2 short paragraphs) │  on very small builds)  │
└─────────────────────────────────────────────────────────┘
```
360px: single column, decorative right column is dropped entirely (`display:
none` below 640px), text becomes full-width.

### `#contact`

```
┌─────────────────────────────────────────────────────────┐
│ EYEBROW: Get In Touch      H2: Tell us about the job     │
├───────────────────────┬───────────────────────────────────┤
│ col 1-5                │ col 6-12                         │
│ Phone: 416-557-2381    │ [Name          ]                 │
│ Email: info@italgroup..│ [Email         ]                 │
│ Address: 75 Moonstone..│ [Phone (optional)]                │
│ (static block, no map) │ [Message                        ]│
│                        │ [Send Message]                   │
└───────────────────────┴───────────────────────────────────┘
```
360px: info block stacks above the form, both full-width, single column.

### `footer`

```
┌─────────────────────────────────────────────────────────┐
│ [ITAL GROUP]   Services Process Projects About Contact   │
│ © Ital Group · 75 Moonstone Pl, Woodbridge, ON L4L 2G2    │
└─────────────────────────────────────────────────────────┘
```
360px: logo, link list, and legal line stack centred, links wrap as needed.

---

## §Copy deck

Verbatim — transcribe exactly. Business facts used below are only the ones
provided in BRIEF.md: name, sector, phone, email, address.

### Document metadata

- **`<title>`**: `Ital Group | General Contractor in Woodbridge, Ontario`
- **Meta description** (≤155 chars): `Ital Group is a general construction company based in Woodbridge, Ontario, handling builds, renovations, and project management.` (129 chars)
- **OG title**: `Ital Group — General Construction, Woodbridge ON`
- **OG description**: `Builds, renovations, and project management from a Woodbridge, Ontario general contractor. Get in touch to talk about your job.` (130 chars)

### Nav

- Logo/wordmark: `Ital Group`
- Links: `Services` `Process` `Projects` `About` `Contact`
- CTA button: `Get a Quote`
- Mobile menu open/close control label (visually hidden text): `Menu`

### `#hero`

- Eyebrow: `General Construction · Woodbridge, Ontario`
- H1: `Built right. Built on time.`
- Lede: `Ital Group plans, builds, and manages construction projects from first estimate to final walkthrough. One team, one point of contact, start to finish.`
- Primary button: `Get a Quote`
- Secondary button: `See Our Process`

### `#services`

- Eyebrow: `What We Do`
- H2: `Three ways we build with you`
- Card 1 heading: `Build`
  Body: `New construction, from site prep through occupancy. We coordinate trades, schedule, and materials so the job moves in order.`
- Card 2 heading: `Renovate`
  Body: `Additions, upgrades, and full interior renovations. We work around what's already standing without cutting corners on what's new.`
- Card 3 heading: `Manage`
  Body: `Project management for owners and developers who need a general contractor to run the job site, the schedule, and the trades.`

### `#process`

- Eyebrow: `How It Runs`
- H2: `From first call to final walkthrough`
- Step 01 heading: `Scope & estimate`
  Body: `We walk the site or review your drawings, then put together a clear scope and a real number.`
- Step 02 heading: `Plan & permits`
  Body: `Drawings get finalized, permits get filed, and we set a schedule everyone can work against.`
- Step 03 heading: `Build`
  Body: `Trades are scheduled and supervised on site. You get straight updates as the work happens.`
- Step 04 heading: `Walkthrough & close-out`
  Body: `We walk the finished job with you, close out any punch list items, and hand over what you need.`

### `#projects`

- Eyebrow: `Recent Work`
- H2: `A look at the job site`
- Sub-copy (sits under the H2, above the grid): `<!-- PLACEHOLDER: client to supply project photos and captions --> Photos and project details from completed and in-progress jobs will go here.`
- Per-tile caption pattern (used on all 6 placeholder tiles): `<!-- PLACEHOLDER: client to supply project name/location -->`

### `#about`

- Eyebrow: `About Ital Group`
- H2: `A general contractor that runs its own jobs`
- Body paragraph 1: `Ital Group is a general construction company based in Woodbridge, Ontario. We take on new builds, renovations, and construction management for owners who want one team accountable for the whole job.`
- Body paragraph 2: `We plan before we build, we keep the schedule visible, and we show up on the days we say we will. That's the whole pitch.`

### `#contact`

- Eyebrow: `Get In Touch`
- H2: `Tell us about the job`
- Sub-copy: `Call, email, or send the form below. We'll get back to you to talk through scope and timing.`
- Info block labels: `Phone` / `Email` / `Address`
- Info block values: `416-557-2381` (tel link `tel:+14165572381`) / `info@italgroup.ca` (mailto link `mailto:info@italgroup.ca`) / `75 Moonstone Pl, Woodbridge, ON, L4L 2G2`
- Location note (replaces a map): `<!-- PLACEHOLDER: client to supply map embed or directions link --> We're located in Woodbridge, Ontario — reach out for directions.`

**Form**
- Field label: `Name` — placeholder: `Your name`
- Field label: `Email` — placeholder: `you@example.com`
- Field label: `Phone` (optional) — placeholder: `(optional)`
- Field label: `Message` — placeholder: `Tell us about the project — location, scope, rough timeline.`
- Submit button: `Send Message`
- Success message: `Opening your email app with this message ready to send to info@italgroup.ca. If nothing opens, email us directly or call 416-557-2381.`
  - **Superseded during build.** The deck originally read
    `Thanks — we've got your message and will be in touch.` There is no backend,
    so the form hands off to `mailto:` — claiming receipt would be false, and a
    lead that silently goes nowhere is worse than no form at all. Restore a real
    confirmation only once the form actually POSTs somewhere (see README).
- Generic error message: `Something went wrong. Please try again or call us at 416-557-2381.`
- Field error, required: `This field is required.`
- Field error, email format: `Enter a valid email address.`

### `footer`

- Wordmark: `Ital Group`
- Link list: `Services` `Process` `Projects` `About` `Contact`
- Legal line: `© Ital Group · 75 Moonstone Pl, Woodbridge, ON, L4L 2G2`
- Contact repeat (small, footer-only): `416-557-2381` (tel link) `·` `info@italgroup.ca` (mailto link)

### Placeholder flags — everything the client must still supply

1. `#projects` sub-copy — placeholder text, needs replacing once real project photos exist.
2. All 6 project gallery tile captions — need project name/location per job.
3. `#contact` location note — needs a real map embed or a directions link once the client decides how they want the address presented (Google Maps embed, static map image, or plain link).
4. All project gallery imagery itself — see §Placeholder assets below.

No other placeholders exist; every other string above is final and ships as-is.

---

## §Placeholder assets

The `#projects` grid needs 6 images:

- **Dimensions:** 800×600px source minimum (delivered at 2x for retina: 1600×1200px), aspect ratio **4:3**, `object-fit: cover` in the tile.
- **Subject:** real job-site or completed-project photography — exteriors, interiors mid-build, or finished spaces. Should show actual work, not stock "construction workers" imagery.
- **Format:** JPEG or WebP, optimized under ~200KB each.

**What ships in the meantime:** CSS-generated placeholder tiles — no hotlinked
stock photography. Each tile is a flat `--color-surface` panel with a subtle
diagonal `repeating-linear-gradient` hairline pattern (using `--color-border`
at low opacity) and a centered small caption reading the placeholder text
above. This is styled in `sections.css` under `.project-tile` /
`.project-tile__placeholder` — see §Class contract. No `<img>` tag is required
until real photography exists; the UI agent should either omit the `<img>` or
point `src` at nothing and let the CSS placeholder show through a
`.project-tile--placeholder` modifier class.

---

## §Class contract

DOM structure the UI agent should build to match the CSS in this lane.
Landmark elements (`<header>`, `<nav>`, `<main>`, section `<section>`s,
`<footer>`) are assumed per BRIEF.md accessibility requirements; class names
below are what `components.css` / `sections.css` / `layout.css` target.

### Global / layout

- `.container` — max-width 1200px, centred, responsive side padding. Apply to
  the inner wrapper of every section.
- `.grid` — CSS grid, `--grid-cols` custom property per breakpoint (12-col
  desktop). Use with `.grid--2`, `.grid--3`, `.grid--4` modifiers for common
  column counts.
- `.section` — vertical rhythm wrapper (`padding-block: var(--space-2xl)`),
  put directly on each `<section>`.
- `.section__eyebrow` — small caps-style label above headings.
- `.section__heading` — the section `<h2>`.
- `.section__intro` — optional lede paragraph under a heading.
- `.visually-hidden` — standard offscreen-but-accessible utility.
- `.skip-link` — "skip to content" link, visible on focus.

### Nav (`#nav`)

- `#nav` — the `<header>`/nav wrapper; fixed/sticky top.
- `.nav__inner` — flex row, logo left, links+CTA right.
- `.nav__logo` — wordmark link to `#hero`.
- `.nav__links` — `<ul>` of anchor links, hidden below 768px unless `.is-open`.
- `.nav__link` — individual `<a>`.
- `.nav__cta` — `.btn .btn--primary` CTA in the nav.
- `.nav__toggle` — hamburger `<button>`, visible below 768px.
- `#nav.is-open` — mobile menu expanded state (required hook from CONTRACTS.md); `.nav__links` becomes visible/slides in when ancestor `#nav` carries `.is-open`.

### Buttons & form

- `.btn` — base button/link style. Modifiers: `.btn--primary` (accent fill),
  `.btn--secondary` (outline/ghost).
- `.form` — `<form>` wrapper.
- `.form__row` — label+input group.
- `.form__label` — `<label>`.
- `.form__input`, `.form__textarea` — inputs; combine with
  `[aria-invalid="true"]` (required hook) for the invalid state, styled with
  `--color-error` border/outline.
- `.field-error` — required hook; error message text under a field.

### Hero (`#hero`)

- `.hero` — section wrapper, `position: relative`, holds canvas + content.
- `.hero__canvas` — the WebGL `<canvas>` element, absolutely positioned,
  full-bleed within `.hero`.
- `.hero__content` — text/CTA stack, positioned above the canvas (`z-index`).
- `.hero__eyebrow`, `.hero__heading`, `.hero__lede`, `.hero__actions`.
- `[data-webgl="off"] .hero` — required hook: when WebGL fails, `.hero` gets a
  CSS-only background treatment (layered gradients standing in for the
  scene) instead of showing an empty/broken canvas area. See `sections.css`.

### Cards / grids

- `.card` — generic raised panel (`--color-surface`, `--radius`, `--shadow`
  on hover/focus where interactive).
- `.service-card`, `.service-card__icon`, `.service-card__title`,
  `.service-card__body` — `#services` tiles.
- `.process-step`, `.process-step__number`, `.process-step__title`,
  `.process-step__body` — `#process` steps; `.process` wrapper carries the
  connecting line via `::before`.
- `.project-tile`, `.project-tile--placeholder`,
  `.project-tile__placeholder`, `.project-tile__caption` — `#projects` grid
  tiles (see §Placeholder assets).
- `.contact-info`, `.contact-info__item`, `.contact-info__label`,
  `.contact-info__value` — `#contact` static info block.

### Reveal / motion (required hooks)

- `[data-reveal]` — element hidden/offset pre-scroll.
- `[data-reveal="in"]` — element revealed (JS toggles the attribute value).
- Under `prefers-reduced-motion: reduce`, both states render fully visible
  with no transition (see `utilities.css`).

### Footer

- `.footer` — wrapper.
- `.footer__inner` — flex/grid layout.
- `.footer__logo`, `.footer__links`, `.footer__legal`, `.footer__contact`.
