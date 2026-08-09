# Ital Group — Content Audit & Copy Deck Addendum

Content agent deliverable. Covers alt text, a copy/fact audit of the live page,
stale photography references, metadata review, and the one surviving
placeholder. Every string below is final — nothing here is "TBD." A developer
transcribes from this file; it does not need further editing to ship.

Verified against the running dev server (`curl -s http://localhost:5173/`,
2026-08-08) and the repo source. Every file/line reference below was grepped
and confirmed to exist before being listed.

---

## §1 Alt text

Five images. Two get real alt text, three get none. Decision and reasoning
for each, then the exact final attribute values.

### 1. `public/about.svg` (via `<img>` in `#about`) — REAL alt text

**Decision: needs real, descriptive `alt`.** This is the only visual content
in `#about` — it does not duplicate anything already stated in the adjacent
copy (the two body paragraphs talk about the business, not about a steel
frame). A screen-reader user gets nothing about this image unless the `alt`
carries it, so it can't be `alt=""`.

**Why it names the drawing style, not just the subject** (the one case where
saying "this is a drawing" is meaningful, not throat-clearing): BRIEF.md
forbids implying the image is a photo of a real, identifiable Ital Group
project. A sighted visitor gets that disclosure for free — the flat,
orthographic, ink-on-paper style is visually obvious as a technical drawing,
not a job-site photo. A screen-reader user has no equivalent cue. Without a
word like "drawing" or "elevation" in the alt text, "steel building frame
under construction" alone could easily be heard as a photo of an actual Ital
Group build — exactly the specific-project claim the brief prohibits. So the
medium is disclosed, but not via the banned "Illustration of" opener — it's
worked into the sentence instead.

**Final `alt`:**
```
A steel building frame under construction, an elevation drawing with columns and floor beams seated on a ground line.
```
117 characters, 19 words (spec asks for real alt text, roughly 12–20 words).

Replaces the current string at `index.html:231`
(`"Illustration of a steel building frame under construction, columns and floor beams seated on a ground line."`),
which opens with the banned "Illustration of" construction.

### 2. `public/process-elevation.svg` (four-bay plate above `#process` steps) — `alt=""` + `aria-hidden="true"`

**Decision: decorative, no alt text.** The four bays restate exactly what the
four process steps already say in text immediately below it (scope →
plan/permits → build → walkthrough). A screen-reader user who already gets
that sequence from the `<h3>`s and body copy would hear it announced twice.
This is DESIGN.md's own call (§4.2) and it's correct — confirming it, not
re-deriving it.

**Final markup:**
```html
alt="" aria-hidden="true"
```
(As already specified in the R2 markup snippet in DESIGN.md — no change
needed once that figure is added.)

### 3–5. Service marks — Build / Renovate / Manage (inline `<svg>`, 48×48) — no alt text

**Decision: decorative, no alt attribute at all.** These are inline `<svg>`
elements, not `<img>`, so there's no `alt` attribute to write in the first
place — the accessible name is controlled by the wrapping
`<span class="service-card__icon" aria-hidden="true">`, which is already
correct in the live markup (`index.html:115`, `:128`, `:141`). Each mark sits
directly above an `<h3>` reading "Build" / "Renovate" / "Manage" — the icon
adds no information a screen-reader user doesn't already get from that
heading, so hiding it is correct, not a gap.

**Final markup:** no change — keep `aria-hidden="true"` on all three
`<span class="service-card__icon">` wrappers, exactly as today. Do not add
`alt`, `title`, or `aria-label` to the `<svg>`s themselves when they're
redrawn per DESIGN.md §4.3/R3.

---

## §2 Copy audit

Read every visible string in `index.html` against the two failure modes:
fabricated facts, and AI-filler/generic-contractor voice.

### Fabricated-fact violations: **none found.**

Every factual claim on the page reduces to the five permitted facts (name,
sector, phone, email, address). No founding year, no project count, no
employee count, no client name, no testimonial, no certification/licence
claim, no award, no service-area claim ("we serve the GTA," "licensed and
insured," etc.) appears anywhere in `index.html`, `README.md`, or the JSON-LD
block. Checked specifically:

- Hero lede ("Ital Group plans, builds, and manages construction projects
  from first estimate to final walkthrough. One team, one point of contact,
  start to finish.") — process description, not a claim of scale or history.
  Clean.
- About body ("Ital Group is a general construction company based in
  Woodbridge, Ontario...") — restates sector + location only. Clean.
- JSON-LD (`index.html:32-49`) — name, url, telephone, email, address only.
  No `foundingDate`, `award`, `review`, `aggregateRating`, or `sameAs`
  fields present. Clean.

### AI-filler / generic-contractor voice: **none found.**

Grepped for the usual tells — "your vision," "our expertise," "leveraging,"
"seamless," "solutions," "state-of-the-art," "passion," "committed to
excellence," "world-class" — zero matches. The copy deck in DESIGN.md was
transcribed verbatim into `index.html` and it already avoids this register:
short sentences, concrete nouns (trades, scope, punch list, schedule), no
three-item filler lists. Specific lines worth naming as *good*, since the
brief asks me to say so rather than rewrite for its own sake:

- `"That's the whole pitch."` (About, closing line) — a contractor's site
  closing a paragraph with a flat, plain-spoken line instead of a call to
  "partner with us on your journey" is exactly the register this brand
  needs. Leave it.
- `"Trades are scheduled and supervised on site. You get straight updates as
  the work happens."` (Process, step 03) — "straight updates" reads like a
  person talking, not a template. Leave it.
- `"We work around what's already standing without cutting corners on
  what's new."` (Services, Renovate) — a real distinction (renovation vs.
  new-build tradeoffs), not a filler line that could belong to any trade.
  Leave it.

**Verdict: no copy rewrites required.** The live page is already the
DESIGN.md deck, and the deck holds up under both tests. I'm not proposing
changes for the sake of having changes to propose.

---

## §3 Photography language cleanup

Every string/comment/doc line still implying photos are pending, with file,
line, and disposition. `docs/DESIGN.md` is excluded from this list on
purpose — every photo reference remaining there lives inside sections
explicitly marked `SUPERSEDED` or is DESIGN.md's own instruction to *delete*
a stale comment (§Refinement spec R4); it isn't itself stale, and I don't own
that file regardless.

| File : Line | Current text | Disposition |
|---|---|---|
| `index.html:222-224` | `<!-- PLACEHOLDER: client to supply a job-site or completed-project photo. Portrait 4:5, 800x1000 minimum (1600x2000 for retina), under ~250KB. Swap the src below and rewrite the alt to describe the real photo. -->` | **Delete entirely.** Per DESIGN.md §Refinement spec R4 — this is false now. The illustration is the finished art, not a stand-in. Leaving it tells the next developer to rip out a deliberate design decision. |
| `index.html:231` | `alt="Illustration of a steel building frame under construction, columns and floor beams seated on a ground line."` | **Replace** with the final alt text in §1 above. Not a "pending photo" claim, but it's the trailing artifact of the same placeholder-era pass and should be fixed in the same edit. |
| `public/about.svg:1` | `aria-label="Illustration of a steel building frame under construction"` on the SVG root | **Superseded by file replacement**, not a copy edit — DESIGN.md §Refinement spec R1 already specifies this whole file gets replaced verbatim with the §4.1 source (which uses `<title>` + `aria-labelledby`, no `aria-label`, and doesn't say "Illustration of"). Flagging so whoever does R1 knows the current file is the old, off-spec one — the on-disk file's coordinates and brass count also don't match §4.1 yet. Not mine to fix (SVG file ownership sits with design/dev), but it does still say "client to supply" implicitly by being the pre-illustration-system draft. |
| `src/styles/sections.css:206-207` | `/* Kept as the backdrop behind the image: it shows while the photo loads, and fills any letterboxing if a supplied image doesn't match the ratio. */` | **Rewrite the comment** (CSS is design-agent-owned, not mine to edit, but flagging for them). Suggested replacement: `/* Backdrop behind the illustration: fills any letterboxing from the 4:5→4:3 crop at narrow widths. */`. The current wording assumes a photo that loads asynchronously and might not match the box — neither is true of a bundled, correctly-sized SVG. |
| `README.md:84-88` | `1. **The About photo.** `public/about.svg` is a placeholder illustration drawn in the brand palette — it is not a photograph of anything. Replace it with a real job-site or completed-project photo: portrait **4:5**, 800×1000 minimum (1600×2000 for retina), under ~250 KB. Update the `src` and rewrite the `alt` text in `index.html` to describe the actual photo.` | **Delete this list item.** The client decided against photography; there is nothing to replace. Suggested replacement text for the "Content the client still needs to supply" section: drop item 1 entirely, renumber the map item to `1.` |
| `README.md:91` | `No stock photography is hotlinked anywhere, and no placeholder is presented as a real project.` | **Rewrite.** This sentence only makes sense as a defense against the "About photo" item directly above it, which is being deleted. Suggested replacement: `No photography is used anywhere on the site — illustration is the permanent art direction (see docs/DESIGN.md §Illustration system).` |
| `README.md:103` | `- [ ] Drop in real project photography` | **Delete this checklist item.** There is no photography plan to complete; the illustration system is the shipped, finished art direction, not a punch-list item. |

**Summary for the report:** 5 stale references across 3 files
(`index.html` ×2, `src/styles/sections.css` ×1, `README.md` ×3, counted as
one cluster of 3 lines in one section). All are either delete or rewrite —
none should be left as-is.

---

## §4 Metadata

All four fields read from the live `<head>` (`index.html:7-30`), lengths
measured, cross-checked against BRIEF.md facts.

| Field | Current string | Length | Verdict |
|---|---|---|---|
| `<title>` | `Ital Group \| General Contractor in Woodbridge, Ontario` | 54 chars | Accurate (name, sector, location only). No length rule given beyond general SEO practice (~60 char display limit) — well inside it. **Keep.** |
| `meta[name=description]` | `Ital Group is a general construction company based in Woodbridge, Ontario, handling builds, renovations, and project management.` | 128 chars | ≤155 required — pass. Restates sector + location + the three services already in the copy deck (build/renovate/manage), nothing invented. **Keep.** |
| `og:title` | `Ital Group — General Construction, Woodbridge ON` | 48 chars | Accurate, no invented claim. **Keep.** |
| `og:description` | `Builds, renovations, and project management from a Woodbridge, Ontario general contractor. Get in touch to talk about your job.` | 127 chars | Accurate, no invented claim. **Keep.** |
| `twitter:title` | Identical to `og:title` | 48 chars | Correct to mirror OG — Twitter Cards fall back to OG tags anyway when these aren't duplicated, but having them explicit is fine and consistent. **Keep.** |
| `twitter:description` | Identical to `og:description` | 127 chars | Same as above. **Keep.** |

No changes needed anywhere in §4. All four fields are already final, accurate
to BRIEF.md, and within limits.

---

## §5 Remaining placeholders

### Contact location note — confirmed still present

`index.html:270-273`:
```html
<!-- PLACEHOLDER: client to supply map embed or directions link -->
<p class="contact-info__note">
  We're located in Woodbridge, Ontario — reach out for directions.
</p>
```

**The HTML comment stays** — per DESIGN.md §Refinement spec R5, this is the
one genuine placeholder left on the site, and it's correct that it still says
so in a developer-facing comment.

**The visible copy is already final — no change needed.** Reasoning: the
brief for this line is "honest that there's no map, without sounding
unfinished." The current sentence never claims a map exists and never says
anything is "coming soon" — it just redirects to a human ("reach out for
directions"), which is true today and will still be true after a map is
added. That's the right shape for copy that has to survive the map decision
either way. It also doesn't duplicate the address block above it verbatim —
it's doing a different job (inviting contact) rather than repeating "75
Moonstone Pl."

**Final copy (unchanged):**
```
We're located in Woodbridge, Ontario — reach out for directions.
```

### Contact form status message — truthful, no change needed

Checked `src/ui/form.js:113-117` against what actually happens on submit
(`window.location.href = href` to a `mailto:` link, no network request, no
backend — confirmed by reading the full handler, `src/ui/form.js:20-121`).

Success message shown:
```
Opening your email app with this message ready to send to info@italgroup.ca. If nothing opens, email us directly or call 416-557-2381.
```

This matches reality exactly: the form does open the visitor's mail client
via `mailto:` with the name/email/phone/message pre-filled in the body, it
does not silently "send" anything, and it gives a fallback (direct email or
phone) for the case where no mail client is configured (increasingly common
on desktop). **No fabricated claim of receipt — this is truthful. Keep as
is.**

Error messages (`"Please check the highlighted fields and try again."` on
validation failure) are also accurate to what the code does. No findings
here.

---

## Report summary

**Alt text (5/5 decided):**
1. `about.svg` — real alt, final string: *"A steel building frame under construction, an elevation drawing with columns and floor beams seated on a ground line."*
2. `process-elevation.svg` — `alt=""` + `aria-hidden="true"` (decorative, duplicates the four process steps in text).
3–5. Build/Renovate/Manage marks — no alt attribute applicable (inline SVG); keep `aria-hidden="true"` on the wrapping spans.

**Fabricated-fact violations:** none. Every claim on the page traces to the five permitted facts.

**Highest-value copy notes:** no rewrites needed — the live copy already matches the DESIGN.md deck and passes both the fact test and the filler test. Named three lines as deliberately good ("That's the whole pitch," "straight updates," "work around what's already standing") rather than rewriting them.

**Stale photography references (5, across 3 files):**
- `index.html:222-224` — delete placeholder comment
- `index.html:231` — replace alt text
- `src/styles/sections.css:206-207` — rewrite comment (flagged for design agent, not edited)
- `README.md:84-88` — delete "About photo" list item
- `README.md:91` — rewrite sentence that only makes sense next to the deleted item
- `README.md:103` — delete "Drop in real project photography" checklist item

**Metadata:** all six fields (title, description, og:title, og:description, twitter:title, twitter:description) are accurate, within limits, and need no changes.

**Remaining placeholder:** contact location note confirmed still present at `index.html:270-273`; visible copy is already final and correctly avoids sounding unfinished. Form success message is truthful about the `mailto:` handoff — no fix needed.
