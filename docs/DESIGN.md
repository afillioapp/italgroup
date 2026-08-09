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
| `--color-border` | `#2B2E33` | Hairline borders and dividers — **decorative only** |
| `--color-border-strong` | `#676D76` | Boundary of any actual control: inputs, textarea, `.btn--secondary` |
| `--color-error` | `#E5646B` | Form validation error text/border |

**Why `--color-border-strong` was added (refinement pass).** `--color-border` is
1.36:1 on `--color-bg` and 1.24:1 on `--color-surface`. That is correct for a
divider — WCAG has no contrast requirement for purely decorative rules — but it
was also being used as the *only* visible boundary of the text inputs and the
secondary button, which is a WCAG 2.2 **1.4.11 Non-text Contrast** failure
(3:1 required for the visual boundary of a user interface component). Controls
now use `--color-border-strong`; dividers keep `--color-border`.

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

Recomputed during the refinement pass (same formula):

| Pair | Ratio | Requirement | Result |
|---|---|---|---|
| `--color-accent` on `--color-surface` (process numerals, 25–32px) | **7.04:1** | ≥3:1 | Pass |
| `--color-text-muted` on `--color-surface` (card + step body copy) | **7.31:1** | ≥4.5:1 | Pass |
| `--color-border-strong` on `--color-bg` (input border on the form plate) | **3.56:1** | ≥3:1 (1.4.11) | Pass |
| `--color-border-strong` on `--color-surface` (input border on field fill) | **3.24:1** | ≥3:1 (1.4.11) | Pass |
| `--color-border` on `--color-bg` (dividers only) | **1.36:1** | n/a — decorative | Exempt |
| Placeholder text (muted @ 0.8 over `--color-surface` = `#8B9097`) | **5.18:1** | ≥4.5:1 | Pass |

All required pairs clear AA with margin; nothing here is riding the line.

**Hero text over the WebGL canvas.** Every ratio above is measured against a
solid token colour. The hero headline and lede sit over a *live* canvas, so
their real contrast was previously whatever the scene happened to render. The
refinement pass added a `.hero::before` scrim (see §Refinement spec) that lays a
graphite wash from the reading edge — `--color-bg` at 100% → 84% → transparent
across the first 64% of the width. That means the copy column always sits on
effectively solid `--color-bg`, so the 16.46:1 and 8.05:1 figures above are the
guaranteed floor rather than a best case.

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
--font-display: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
  Helvetica, Arial, sans-serif;
--font-body: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
  Helvetica, Arial, sans-serif;
```

Both roles share one system stack on purpose — the differentiation between
display and body comes from weight (700 vs 400-500) and tracking, not typeface
switching, which keeps the system-font look from feeling like two different
sites bolted together.

**Refinement pass — the display-face question, answered "no".** A distinct
display face would help, but not enough to justify the only two ways it could
ship. An external request (Google Fonts et al.) is forbidden outright. A bundled
`.woff2` costs 20–40 KB of render-blocking weight plus a FOUT on a page whose
whole first impression is a WebGL scene that already competes for the first
paint — and buys a difference most visitors would not name. The stack stays.
What changed instead:

1. **`system-ui` was prepended.** The old stack led with `-apple-system`, so
   Android and Linux fell all the way through to **Arial**. `system-ui` (plus
   `Roboto` as an explicit backstop) gets those platforms Roboto/Cantarell.
   This is the single biggest typographic improvement available at zero bytes.
2. **Tracking became a real system**, not an ad-hoc value per rule:
   `--tracking-display: -0.03em`, `--tracking-tight: -0.01em`,
   `--tracking-eyebrow: 0.12em` (was 0.08em — eyebrows now read as small caps
   rather than as bold small text).
3. **`--step-5` was added for the hero only** (see below).
4. `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.
5. `font-variant-numeric: tabular-nums` on `.process-step__number`, so `01`
   through `04` occupy identical widths across the row.

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
--step-5:  clamp(2.75rem, 2.1rem + 2.9vw, 5rem);    /* hero <h1> only */
```

Rendered px at root `font-size: 16px` (no user zoom):

| Token | 360px viewport | 1440px viewport | Typical use |
|---|---|---|---|
| `--step--1` | 12.8px | 14.4px | Fine print, labels |
| `--step-0` | 16.0px | 18.4px | Body text |
| `--step-1` | 20.0px | 24.0px | Lead paragraph, card titles |
| `--step-2` | 25.0px | 32.0px | Section eyebrow/sub-heads |
| `--step-3` | 31.2px | 42.4px | Section H2 |
| `--step-4` | 39.0px | 56.0px | Generic `<h1>` default |
| `--step-5` | 44.0px | ~75px (80px cap @1728) | **Hero H1** |

`--step-4` topped out at 56px, which a full-viewport WebGL scene simply ate —
the headline read as a caption on top of a video rather than as the thing the
page is about. `--step-5` runs 44px → 80px and is applied *only* to
`.hero__heading`. Sanity check at 360px: the longest word in the H1 is `Built`
(5 characters), ≈ 121px at 44px/700, well inside the 320px content box.

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

--section-pad: clamp(3.5rem, 7vw, 7rem);  /* 56px → 112px */

--radius: 4px;
--shadow: 0 12px 32px -12px rgb(0 0 0 / 0.5);

--ease: cubic-bezier(0.22, 0.61, 0.36, 1);
--dur: 240ms;
--dur-reveal: 520ms;
```

**Refinement pass — `--section-pad` and `--dur-reveal`.** `.section` used a flat
`--space-2xl` (84px) at every width, which is heavy on a 360px phone and thin at
1440px, and — because it was identical for all five sections — was the main
reason the page read as five stacked slabs rather than a document with pace.
`--section-pad` is fluid, and `#services` (×1.35 top) and `#contact` (×1.2
bottom) deviate from it deliberately, to let the hero exit and to stop the page
ending abruptly at the footer.

`--dur` was doing double duty as both the hover duration and the scroll-reveal
duration. 240ms is right for a control responding to a pointer and too fast for
an element settling into place, which made reveals pop rather than settle.
`--dur-reveal` (520ms, with opacity leading at 0.85×) separates the two. Both
are still fully neutralised by the `prefers-reduced-motion` block.

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

**Current list — one item.**

1. `#contact` location note — needs a real map embed or a directions link once
   the client decides how they want the address presented (Google Maps embed,
   static map image, or plain link).

That is the only outstanding placeholder on the site.

~~1. `#projects` sub-copy~~ · ~~2. project gallery tile captions~~ ·
~~4. project gallery imagery~~ — all **closed**. `#projects` was removed at
client request, and the client has since decided against photography entirely.
Illustration is the site's permanent art direction (see §Illustration system),
so no image on this page is waiting on anything. Do not re-open these.

No other placeholders exist; every other string above is final and ships as-is.

---

## §Placeholder assets — SUPERSEDED

> **Superseded in full by §Illustration system.** `#projects` was removed at
> client request, and the client has since decided against photography
> altogether. There is no longer any imagery pending from the client, and no
> `<img>` on this site is a placeholder. Everything below is kept only as a
> record of what the photography plan *was*; do not implement it, and do not
> reintroduce "client to supply a photo" comments into the markup.

The `#projects` grid needed 6 images:

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

## §Illustration system

The client has decided against photography. **Illustration is the permanent art
direction for this site, not a holding pattern.** The site is finished; nothing
here is waiting on a client asset. Everything in this section is binding on any
illustration drawn for Ital Group from now on.

### The idea in one line

Every illustration on this site is a page torn out of a **drawing set** — an
orthographic construction elevation, drawn in ink, on a grid, by one hand.

This is the only illustration idea that is defensible for a general contractor.
It is the literal visual language of the trade, it is native to a dark ground
(white-on-black is how a drawing reads when you invert the print), and it cannot
drift toward the two failure modes that kill vector illustration on service
sites: friendly-blob characters, and generic isometric-office-scene stock.

### 1. Style rules

These are the rules. A developer drawing a new illustration in a year must be
able to follow them without seeing the existing files.

**Projection — flat orthographic elevation. Always.**
Straight-on, no perspective, no vanishing point, no isometric or axonometric
angle, no foreshortening. Verticals are vertical, horizontals are horizontal.
Exactly two kinds of line may run at an angle, and each has one rule:

- **Structural bracing** runs **corner to corner of the bay it braces** — from a
  column/beam intersection to the diagonally opposite one, never a free angle
  and never overshooting the bay. Its angle is therefore a consequence of the
  bay's proportions, exactly as it is in a real frame drawing.
- **Section hatching** is drawn at exactly **45°**, always, everywhere, and
  always in the same direction (up to the right).

No other angled line exists. There is no second projection convention and there
never will be — a mixed set is exactly what makes illustration libraries look
bought rather than drawn.

**Stroke — three pens, and nothing between them.**
Weights are expressed against the drawing's base module `M` (see §2), so they
stay proportionally identical at every drawing scale:

| Pen | Weight | Draws |
|---|---|---|
| Heavy | `0.225 × M` | The subject: foreground structure, the thing the drawing is about |
| Mid | `0.125 × M` | Secondary structure, the set-back plane, footings, bracing |
| Hair | `0.075 × M` | Ground lines, datum lines, setback lines, hatching, the grid |

At plate scale (`M = 40`) that is **9 / 5 / 3**. At mark scale (`M = 8`) it is
**1.8 / 1 / 0.6**, rounded up to `1.8 / 1 / 0.8` because sub-pixel hairlines
vanish at icon size. No other weight is permitted. If a line needs emphasis, it
gets the next pen up — it does not get 6.5.

**Caps and joins — square and mitred. No exceptions.**
`stroke-linecap="square"`, `stroke-linejoin="miter"`. **Never** `round`. The
page's 4px `--radius` belongs to UI chrome (cards, buttons, inputs); a drawing
has no rounded corners. A rounded cap anywhere in an illustration is a bug.

**Fills — three permitted uses, and no others.**
1. The panel background rect (`#1B1D21`) and the atmospheric gradient rects.
2. Brass "seat" blocks marking a bearing point — a filled rect no larger than
   **one module squared**.
3. Footing pads and similar solid structural blocks, in `#2C2E33`, no larger
   than `1 × 0.25` modules.

Everything else is `fill="none"` and stroke-drawn. There are no filled shapes,
no silhouettes, no flat-colour areas.

**Depth — three devices, all of them honest.**
Because the projection is flat, depth may only be suggested by:
1. **Pen weight.** Foreground = heavy, set-back plane = mid.
2. **Value and opacity.** The set-back plane sits at `opacity .7` in `#2C2E33`;
   the foreground sits at full opacity in `#3B4854` / `#454F5A`.
3. **Atmosphere.** One vertical `--color-bg` haze gradient at the base of a
   plate, so the structure settles onto the ground instead of floating.

Additionally, a set-back plane is drawn on a **finer bay rhythm** than the
foreground (e.g. 80-unit bays behind 140-unit bays), which reads as "more
structure, further away" without faking perspective by offsetting it diagonally.

**Never** use: drop shadows, blur, bevels, gradient-as-material-shading,
outline glows, or a second light source. The only two gradients allowed in the
whole system are the brass `glow` radial and the graphite `haze` linear.

**Brass rationing — at most two brass elements per illustration.**
Brass is not a colour in the drawing; it is an annotation. It marks **the datum
and the bearing points** — the line the whole structure is set out from, and the
points where it meets the ground. Nothing else is ever brass. Ceiling: two brass
*elements* per drawing (a group of four identical column feet counts as one
element), and brass ink must stay under roughly **8% of total ink**. Brass never
touches the grid, the hatching, the ground line, or the set-back plane.

**Never drawn, under any circumstances:**
people, hands, hard hats, hi-vis, tools posed as mascots, vehicles, cranes with
character, speech bubbles, curved or tapered arrows, checkmarks, gears, mountain
or city skylines, flags, the client's logo, and — critically — **anything that
depicts a specific, identifiable, completed project**, because that would be a
portfolio claim the brief forbids us to make. Structures are generic frames, not
buildings you could go and photograph.

**No text inside SVG.** No `<text>`, no `<tspan>`, no numerals, no dimension
labels, no `font-family`. SVG text would not match the page's font stack, cannot
be translated, does not respond to user font-size settings, and would need to be
duplicated in `alt` anyway. A `<title>` element is fine — it is markup, not
rendered type.

### 2. Geometry and grid

**Base module `M`. Everything is a multiple of it.**

| Tier | `M` | Snap | viewBox rule | Rendered module target |
|---|---|---|---|---|
| **Plate** — large illustrations | 40 units | `M/2` = 20 | Both axes are integer multiples of 40 | 24–28 CSS px |
| **Mark** — icon-scale marks | 8 units | `M/4` = 2 | 48 × 48 (6 × 6 modules) | 6–8 CSS px |

Two tiers, not one, and this is deliberate: constant *rendered* stroke weight
across a 900px plate and a 40px mark would make the mark a blob. A real drawing
set does the same thing — a 1:50 plan and a 1:5 detail are drawn with different
pen weights and read as one set because the **proportions to their own module
are identical**, which is exactly the invariant enforced above. The mark gets a
finer snap (`M/4`) for the same reason a detail sheet gets a finer grid.

**Rules that follow from the module:**
- Every line endpoint lands on a snap intersection. No exceptions except brass
  seat blocks, which are centred on their column (`column_x − M/4`).
- The visible background grid pattern is exactly `M × M`, hair pen, `#2B2E33` at
  `stroke-opacity .45`. Because every plate shares `M = 40`, the grid is the
  same physical size in every drawing and lines align across separate files.
- A plate's viewBox is a multiple of 40 in both axes: 800×1000 and 1600×280 both
  qualify.
- **Safe band.** A plate that will be cropped at a second aspect ratio must keep
  every load-bearing line inside the centred band of the tighter ratio. For the
  About plate (4:5 desktop, 4:3 mobile) that band is `y` 200 → 800.

### 3. Where illustrations appear — and where they deliberately do not

| Location | Verdict | Tier | Rendered size |
|---|---|---|---|
| `#about` right column | **Plate** — the anchor illustration | Plate | 4:5 desktop (~480px wide), 4:3 crop below 640px |
| `#process`, above the four steps | **Plate** — new; one wide elevation, four bays | Plate | Full container width, 1600:280 (~199px tall at 1136px) |
| `#services`, three cards | **Marks** — stay icons, but redrawn | Mark | 48×48 viewBox in a 56px framed plate |
| `#process`, per step | **No art.** Numerals only | — | — |
| `#hero` | **No art.** The WebGL scene is the hero image | — | — |
| `#contact` | **No art.** | — | — |
| `footer` | **No art.** | — | — |

**Why the service cards stay marks rather than becoming plates.** Three
card-width illustrations in a row would carry roughly three times the visual
weight of the About plate, which is supposed to be the page's only large image;
the section would out-shout the anchor. They would also push the card copy — the
actual payload of that section — below the fold on a phone. And at 4 modules
wide a plate has room for about six lines before it becomes mush. What the cards
*did* need was the **frame**: each mark now sits inside a 56px bordered plate on
the recessed `--color-bg`, so it reads as a small drawing rather than as a
floating UI glyph, and it belongs to the same family without competing.

**Why the process steps get no per-step art.** Four small illustrations would be
four marks trying to narrate a sequence, which is a job a sequence of drawings
does badly and a single continuous drawing does well. One wide elevation with a
continuous ground line and four progressively-built bays says "this is one site
moving through four stages" in a way four boxed icons cannot. It is also one
3 KB file instead of four.

**Where restraint is the answer: contact, footer, hero.** The hero already has a
real-time 3D scene; adding a drawing next to it would be two art directions
fighting. Contact is a conversion surface and every non-functional pixel there
costs a lead. The footer is wayfinding. Total illustration count for the whole
site is **two plates and three marks** — that is the point. A visual language is
established by consistency, not by volume.

### 4. Exact spec for each illustration

Palette — the complete list of ink colours available to any illustration. No
other hex may appear:

| Hex | Token equivalent | Used for |
|---|---|---|
| `#1B1D21` | `--color-surface` | Panel background |
| `#121316` | `--color-bg` | Haze gradient, edge fades |
| `#2B2E33` | `--color-border` | Grid, ground lines, setback lines (hair pen) |
| `#2C2E33` | WebGL material base | Set-back plane, bracing, footing pads (mid pen) |
| `#3B4854` | WebGL fill light | Foreground columns (heavy pen) |
| `#454F5A` | — | Foreground beams (heavy pen), one value up from columns so beams read in front of columns |
| `#C9A24B` | `--color-accent` | Brass: datum + bearing points only |
| `currentColor` | — | **Marks only.** Inherits `--color-accent` from `.service-card__icon` |

---

#### 4.1 `public/about.svg` — "Frame" (plate)

- **viewBox:** `0 0 800 1000` (20 × 25 modules, 4:5). Replaces the existing file
  at the same path; the `<img>` keeps `width="800" height="1000"`.
- **Subject:** a generic steel building frame under construction, drawn as a
  technical elevation. Not a building — a *frame*, so it makes no claim about a
  completed project.
- **Contents:** four foreground columns on a 140-unit bay rhythm (`x` 180 / 320 /
  460 / 600, `y` 240 → 780); four floor beams (`y` 360 / 480 / 600 / 720); a
  set-back plane on a finer 80-unit rhythm at `opacity .7`; three 45° braces in
  the outer bays; a brass roof datum; four brass bearing blocks at the column
  feet; a hair ground line; grid, brass glow, and base haze.
- **Safe band:** `y` 200 → 800. Everything structural is inside it, so the
  mobile 4:3 crop at `object-position: 50% 50%` is lossless.
- **`alt` intent** (content agent writes the final wording): must communicate
  *what it depicts* — a steel building frame under construction, columns and
  floor beams seated on a ground line, drawn as a technical elevation. It must
  **not** describe it as a photograph, must not name a project, location, or
  building type, and must not imply the structure is one of Ital Group's jobs.
  Roughly 12–20 words.
- **Measured size:** 2.6 KB. Budget 8 KB.

Complete source — save verbatim to `public/about.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000" role="img" aria-labelledby="about-svg-title"><title id="about-svg-title">Steel building frame under construction, drawn as a technical elevation</title>
  <defs>
    <radialGradient id="ig-glow" cx="30%" cy="26%" r="70%">
      <stop offset="0%" stop-color="#C9A24B" stop-opacity=".20"/>
      <stop offset="55%" stop-color="#C9A24B" stop-opacity=".05"/>
      <stop offset="100%" stop-color="#C9A24B" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ig-haze" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#121316" stop-opacity="0"/>
      <stop offset="100%" stop-color="#121316" stop-opacity=".95"/>
    </linearGradient>
    <pattern id="ig-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0v40" fill="none" stroke="#2B2E33" stroke-width="1" stroke-opacity=".45"/>
    </pattern>
  </defs>

  <rect width="800" height="1000" fill="#1B1D21"/>
  <rect width="800" height="1000" fill="url(#ig-grid)"/>
  <rect width="800" height="1000" fill="url(#ig-glow)"/>

  <!-- Set-back plane: same elevation, finer bay rhythm, mid pen, dimmed. -->
  <g fill="none" stroke="#2C2E33" stroke-width="5" stroke-linecap="square" opacity=".7">
    <path d="M180 280V760M260 280V760M340 280V760M420 280V760M500 280V760M580 280V760M660 280V760"/>
    <path d="M180 280H660M180 380H660M180 480H660M180 580H660M180 680H660M180 760H660"/>
  </g>

  <!-- Foreground columns -->
  <path fill="none" stroke="#3B4854" stroke-width="9" stroke-linecap="square"
        d="M180 240V780M320 240V780M460 240V780M600 240V780"/>

  <!-- Foreground floor beams -->
  <path fill="none" stroke="#454F5A" stroke-width="9" stroke-linecap="square"
        d="M180 360H600M180 480H600M180 600H600M180 720H600"/>

  <!-- Diagonal bracing, outer bays only -->
  <path fill="none" stroke="#2C2E33" stroke-width="5" stroke-linecap="square"
        d="M180 360L320 240M460 600L600 480M180 720L320 600"/>

  <!-- Brass, ration 1 of 2: the roof datum -->
  <path fill="none" stroke="#C9A24B" stroke-width="10" stroke-linecap="square" d="M180 240H600"/>

  <!-- Brass, ration 2 of 2: the bearing points, centred on each column -->
  <g fill="#C9A24B">
    <rect x="170" y="764" width="20" height="16"/>
    <rect x="310" y="764" width="20" height="16"/>
    <rect x="450" y="764" width="20" height="16"/>
    <rect x="590" y="764" width="20" height="16"/>
  </g>

  <!-- Ground line -->
  <path fill="none" stroke="#2B2E33" stroke-width="3" d="M100 780H700"/>

  <rect y="660" width="800" height="340" fill="url(#ig-haze)"/>
</svg>
```

---

#### 4.2 `public/process-elevation.svg` — "Four bays" (plate, NEW)

- **viewBox:** `0 0 1600 280` (40 × 7 modules). Four 400-unit bays, one per
  process step, sharing one continuous ground line at `y = 240`.
- **Subject:** one site read left to right through four stages, aligned bay-for-
  step with the `.process__list` grid below it.
  1. **0–400 — Scope & estimate:** bare ground, a dashed setback line, two
     survey stakes, and a brass datum tick (the origin the job is set out from).
  2. **400–800 — Plan & permits:** three footing pads placed, three columns
     rising to unequal heights, one tie beam. Deliberately incomplete.
  3. **800–1200 — Build:** four columns to full height, roof and floor beams in,
     two 45° braces. No brass — it isn't finished.
  4. **1200–1600 — Walkthrough & close-out:** frame infilled with 45° hair
     hatching, floor line, and the brass roof datum struck across the top.
- **Brass ration:** exactly two elements — the bay-1 datum tick and the bay-4
  roof datum. They bookend the sequence, which is the whole narrative.
- **Rendered:** full container width above `.process__list`, `aspect-ratio:
  1600/280`. At a 1136px container the module renders at 28.4px, inside the
  24–28px target. `display: none` below 768px, where the steps become a vertical
  timeline and a 5.7:1 horizontal drawing has nothing to align to.
- **`alt` intent: none — this image is decorative.** It must ship as
  `alt=""` with `aria-hidden="true"`. The four steps beside it state the same
  four stages in text; giving the drawing a description would make a screen
  reader announce the process twice. This is a deliberate accessibility call, not
  an omission.
- **Measured size:** 3.0 KB. Budget 8 KB.

Complete source — save verbatim to `public/process-elevation.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 280" width="1600" height="280" role="presentation" aria-hidden="true" focusable="false">
  <defs>
    <pattern id="pe-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0v40" fill="none" stroke="#2B2E33" stroke-width="1" stroke-opacity=".45"/>
    </pattern>
    <linearGradient id="pe-edge" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1B1D21" stop-opacity="1"/>
      <stop offset="7%" stop-color="#1B1D21" stop-opacity="0"/>
      <stop offset="93%" stop-color="#1B1D21" stop-opacity="0"/>
      <stop offset="100%" stop-color="#1B1D21" stop-opacity="1"/>
    </linearGradient>
  </defs>

  <rect width="1600" height="280" fill="#1B1D21"/>
  <rect width="1600" height="280" fill="url(#pe-grid)"/>

  <!-- Bay 1 (0-400) — scope: bare ground, setback line, two survey stakes -->
  <path fill="none" stroke="#2B2E33" stroke-width="3" stroke-dasharray="12 12" d="M40 160H360"/>
  <path fill="none" stroke="#2C2E33" stroke-width="5" stroke-linecap="square" d="M100 240V180M300 240V180"/>
  <!-- Brass, ration 1 of 2: the datum origin -->
  <path fill="none" stroke="#C9A24B" stroke-width="5" stroke-linecap="square" d="M200 240V200"/>

  <!-- Bay 2 (400-800) — plan and permits: footings set, columns rising -->
  <g fill="#2C2E33">
    <rect x="440" y="232" width="40" height="8"/>
    <rect x="560" y="232" width="40" height="8"/>
    <rect x="680" y="232" width="40" height="8"/>
  </g>
  <path fill="none" stroke="#3B4854" stroke-width="9" stroke-linecap="square" d="M460 240V140M580 240V100M700 240V160"/>
  <path fill="none" stroke="#454F5A" stroke-width="5" stroke-linecap="square" d="M460 140H580"/>

  <!-- Bay 3 (800-1200) — build: full frame, braced -->
  <path fill="none" stroke="#3B4854" stroke-width="9" stroke-linecap="square" d="M840 240V80M940 240V80M1040 240V80M1140 240V80"/>
  <path fill="none" stroke="#454F5A" stroke-width="9" stroke-linecap="square" d="M840 80H1140M840 160H1140"/>
  <path fill="none" stroke="#2C2E33" stroke-width="5" stroke-linecap="square" d="M840 160L940 80M1040 240L1140 160"/>

  <!-- Bay 4 (1200-1600) — close-out: frame infilled, roof datum struck -->
  <path fill="none" stroke="#3B4854" stroke-width="9" stroke-linecap="square" d="M1240 240V80M1340 240V80M1440 240V80M1540 240V80"/>
  <path fill="none" stroke="#454F5A" stroke-width="9" stroke-linecap="square" d="M1240 160H1540"/>
  <path fill="none" stroke="#2C2E33" stroke-width="3" stroke-opacity=".55" d="M1240 200L1360 80M1240 240L1400 80M1300 240L1460 80M1360 240L1520 80M1420 240L1540 120M1480 240L1540 180"/>
  <!-- Brass, ration 2 of 2: the completed roof datum -->
  <path fill="none" stroke="#C9A24B" stroke-width="10" stroke-linecap="square" d="M1240 80H1540"/>

  <!-- Continuous ground line: one site, four stages -->
  <path fill="none" stroke="#2B2E33" stroke-width="3" d="M0 240H1600"/>

  <rect width="1600" height="280" fill="url(#pe-edge)"/>
</svg>
```

---

#### 4.3 Service marks — three, inline in `index.html`

- **viewBox:** `0 0 48 48` each (6 × 6 modules, `M = 8`, snap 2).
- **Inline, not files.** These are the only illustrations that inherit
  `currentColor`, which is how they pick up `--color-accent` from
  `.service-card__icon` and change on hover. A file referenced by `<img>` cannot
  do that. They are ~250 bytes each, so a file request would cost more than it
  saves.
- **Stroke set:** heavy `1.8`, mid `1`, hair `0.8`. `stroke-linecap="square"`,
  `stroke-linejoin="miter"`, `fill="none"` on the root (required — `base.css`
  has `svg:not([fill]) { fill: currentColor }`, which would flood them solid).
- **`alt` intent: none.** All three keep `aria-hidden="true"` on the wrapping
  `<span class="service-card__icon">`, exactly as today — the card heading
  immediately below states the service in text.
- **Ground line in all three.** Every mark ends on a ground line at `y = 40`.
  That shared baseline is what makes three unrelated subjects read as one set.

**Build** — a frame elevation: two foreground columns, roof plus two floor
beams, one dimmed set-back column, ground line.

```html
<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">
  <path d="M24 16V40" stroke-width="1" opacity=".5"/>
  <path d="M12 12V40M36 12V40M12 12H36M12 20H36M12 28H36" stroke-width="1.8"/>
  <path d="M6 40H42" stroke-width=".8"/>
</svg>
```

**Renovate** — what is already standing meets what is new: an existing wall
drawn in section with 45° hatching at reduced opacity, butting a new frame at
heavy pen. Reads as "we work around what's there."

```html
<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">
  <path d="M8 12H16V40H8Z" stroke-width="1" opacity=".55"/>
  <path d="M8 20L16 12M8 28L16 20M8 36L16 28M8 40L12 36M12 40L16 36" stroke-width=".8" opacity=".35"/>
  <path d="M16 8H40V40H16" stroke-width="1.8"/>
  <path d="M16 24H40" stroke-width="1"/>
  <path d="M4 40H44" stroke-width=".8"/>
</svg>
```

**Manage** — a schedule plate: a drawing sheet with a title band and three bars
of unequal length. A schedule is literally what a general contractor manages, so
this is a drawing of the work rather than a stock clipboard.

```html
<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">
  <path d="M8 8H40V40H8Z" stroke-width="1"/>
  <path d="M8 16H40" stroke-width="1" opacity=".55"/>
  <path d="M14 22H26M14 28H34M14 34H22" stroke-width="2"/>
</svg>
```

### 5. Hard constraints (all satisfied)

- **No external requests.** Two files under `public/`, three inline SVGs. No
  CDN, no sprite sheet, no icon font, no `<image href>`.
- **No raster.** Nothing is a PNG, JPEG, WebP, or a base64 image.
- **No fonts inside SVG.** No `<text>`, no `font-family`. Verified: neither file
  contains a text node.
- **Size.** `about.svg` 2.6 KB, `process-elevation.svg` 3.0 KB, marks ~250 B
  each. Ceiling is 8 KB per file. Do not add another gradient or pattern
  definition without re-measuring.
- **Reads on dark graphite.** Every ink colour is drawn on the `#1B1D21` panel,
  which sits on the `#121316` page. The lightest ink (`#454F5A`) is **2.02:1**
  against the panel — that is fine and intentional for *decorative* structure
  lines, which carry no information a user must perceive. The one element that
  does carry meaning at a glance, the brass datum, is **7.04:1** against
  `#1B1D21`.
  No text is ever rendered inside an illustration, so no text-contrast rule
  applies inside these files.
- **320px → 900px.** Both plates are pure geometry with no rendered type and no
  detail finer than the hair pen (3 units = 1/267 of the About plate's width),
  so they resolve at any scale. The About plate's safe band guarantees the
  mobile crop keeps the subject. The process plate is suppressed below 768px
  entirely, so its narrowest render is ~700px.

### 6. Motion

**No animation. Anywhere. In any illustration.**

No `<animate>`, `<animateTransform>`, `<set>`, SMIL, CSS animation, CSS
transition, or JS-driven mutation of any element inside an SVG. This is not a
concession to `prefers-reduced-motion`; it is the position. The site already has
one moving thing — the WebGL hero — and its scarcity is what makes it read as
engineering rather than decoration. A second animated surface would spend that.

Consequence for reduced motion: because the illustrations are inert, the
`@media (prefers-reduced-motion: reduce)` block in `utilities.css` needs **no
illustration-specific rule at all**. The only motion an illustration ever
participates in is the page-level `[data-reveal]` fade of its container, which
that block already neutralises. If a future contributor animates an SVG anyway,
they own the reduced-motion static-frame fallback, and they must state it here.

---

## §Refinement spec

Work from the refinement pass that could **not** be done in `src/styles/**`
alone, because it needs a markup change. Everything else in the pass is already
implemented in CSS and needs no developer action.

Owner of these changes: **UI agent** (`index.html`). Ownership of the two SVG
files under `public/`: whoever the lead assigns; the complete source is in
§Illustration system §4 and should be saved verbatim.

### R1 — Save the two illustration files

| Path | Action | Source |
|---|---|---|
| `public/about.svg` | **Replace** existing file | §4.1 |
| `public/process-elevation.svg` | **Create** | §4.2 |

The existing `about.svg` is close to the system but predates it: its coordinates
are off-grid (`165`, `265`, `845`…), it carries a third brass element beyond the
ration, and its composition runs past the 4:3 safe band so the mobile crop cuts
the column feet. The replacement fixes all three. `.about__visual` in
`layout.css` has already moved from `aspect-ratio: 3/2` to `4/3` to match.

### R2 — Add the process elevation plate

**File:** `index.html`, `#process`, between the `.section__head` div and the
`<ol class="process__list">`.

```html
<figure class="process__plate" data-reveal>
  <img
    class="process__plate-img"
    src="./process-elevation.svg"
    width="1600"
    height="280"
    alt=""
    aria-hidden="true"
    loading="lazy"
    decoding="async"
  />
</figure>
```

- CSS is already in place: `.process__plate` / `.process__plate-img` in
  `layout.css`, `display: none` below 768px, `aspect-ratio: 1600/280` above it.
- `alt=""` **and** `aria-hidden="true"` are both required and intentional — see
  §4.2. Do not write descriptive alt text here.
- `data-reveal` is correct on the `<figure>`; it inherits the standard reveal.
- **Why:** `#process` is the only section with no visual at all, and it is the
  section that most benefits from one, because it describes a sequence. The
  plate's four 400-unit bays sit directly over the four grid columns of
  `.process__list`, so the drawing and the list share one rhythm.

### R3 — Swap the three service icons

**File:** `index.html`, `#services`. Replace the `<svg>` inside each
`<span class="service-card__icon">` with the corresponding mark from §4.3.

- Keep the wrapping `<span class="service-card__icon" aria-hidden="true">`
  exactly as it is — the CSS targets it and already sizes the child `<svg>` to
  100% × 100%.
- The `viewBox` changes from `0 0 24 24` to `0 0 48 48`. This matters: the marks
  are drawn on an 8-unit module with 2-unit snap, and a 24-unit grid cannot hold
  the section hatching or the ground line.
- Keep `fill="none"` on the root `<svg>`. `base.css` has
  `svg:not([fill]) { fill: currentColor }`, and an author rule beats a
  presentation attribute, so dropping it floods the mark solid.
- Do not add `stroke-width` to the root — each path carries its own pen weight.
- **Why:** the current icons are generic Feather-style glyphs (a house, a
  wrench, a clipboard) drawn with round-ish geometry on a 24-unit grid. They are
  not in the illustration system and now visibly aren't, sitting a section away
  from a drafting plate. The replacements are the same three ideas redrawn as
  elevations, with the shared ground line that ties the whole set together.

### R4 — About figure: drop the "placeholder" comment

**File:** `index.html`, above `<figure class="about__visual">`. Delete this
comment block:

```html
<!-- PLACEHOLDER: client to supply a job-site or completed-project photo.
     Portrait 4:5, 800x1000 minimum (1600x2000 for retina), under ~250KB.
     Swap the src below and rewrite the alt to describe the real photo. -->
```

It is now false. The client has decided against photography; the illustration is
the finished artwork, not a stand-in. Leaving the comment tells the next
developer to rip out a deliberate design decision. This is the one change that
converts the site's status from "awaiting client assets" to "done".

The `alt` text on that `<img>` should also be reviewed against the intent in
§4.1 (content agent's call on final wording) — the current string is accurate
and may well stand as-is.

### R5 — Placeholder audit

After R2–R4 the only remaining `<!-- PLACEHOLDER -->` in `index.html` is the
contact location note ("client to supply map embed or directions link"). That
one is genuine and stays. Confirm no others survive.

### Not requested, not done

Deliberately left alone so this stays a refinement: no class renames, no
restructuring of the grid system, no changes to `#nav`, `#hero` markup, the
form's fields or behaviour, the JSON-LD, or any copy in the deck.

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
- `.hero::before` — the contrast scrim between canvas and content. Layer order
  inside `.hero` is canvas `z-index: 0` → scrim `1` → `.hero__content` `2`. Do
  not add a positioned element to `.hero` without giving it an explicit
  `z-index`, or it will land between the scrim and the copy.
- `[data-webgl="off"] .hero` — required hook: when WebGL fails, `.hero` gets a
  CSS-only background treatment (layered gradients standing in for the
  scene) instead of showing an empty/broken canvas area. See `sections.css`.

### Cards / grids

- `.card` — generic raised panel (`--color-surface`, `--radius`, `--shadow`
  on hover/focus where interactive).
- `.service-card`, `.service-card__icon`, `.service-card__title`,
  `.service-card__body` — `#services` tiles.
- `.process-step`, `.process-step__number`, `.process-step__title`,
  `.process-step__body` — `#process` steps. `.process__list::before` draws the
  continuous datum line that bridges the grid gaps between steps (≥768px);
  `.process-step::before` is the brass station mark seated on it.
- `.process__plate` / `.process__plate-img` — **new.** `<figure>` + `<img>`
  holding `public/process-elevation.svg`, placed between `.section__head` and
  `.process__list`. Hidden below 768px. See §Refinement spec R2.
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
