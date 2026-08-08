#!/usr/bin/env node
/**
 * Ital Group — build & contract verification harness.
 *
 * Encodes the BRIEF.md quality bar and the CONTRACTS.md interfaces as
 * executable checks so "done" is measurable rather than asserted.
 *
 * Usage: node scripts/verify.mjs        (run `npm run build` first for dist checks)
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const results = [];
const read = (p) => (existsSync(join(ROOT, p)) ? readFileSync(join(ROOT, p), 'utf8') : null);

function check(name, condition, detail = '') {
  results.push({ name, pass: !!condition, detail });
}
/** Some checks are advisory: a fail is a flag for human review, not a build break. */
function warn(name, condition, detail = '') {
  results.push({ name, pass: !!condition, detail, advisory: true });
}

// ---------------------------------------------------------------- source files
const html = read('index.html');
const mainJs = read('src/main.js');
const webgl = read('src/webgl/index.js');

check('index.html exists', html);
check('src/main.js exists', mainJs);
check('src/webgl/index.js exists', webgl);

// ------------------------------------------------------- CONTRACTS.md §1 WebGL
if (webgl) {
  const webglDir = join(ROOT, 'src/webgl');
  const allWebgl = readdirSync(webglDir)
    .filter((f) => f.endsWith('.js'))
    .map((f) => readFileSync(join(webglDir, f), 'utf8'))
    .join('\n');

  check('createScene is exported', /export\s+(function\s+createScene|\{[^}]*createScene)/.test(webgl));
  for (const m of ['start', 'stop', 'setScroll', 'setPointer', 'resize', 'dispose']) {
    check(`createScene returns .${m}()`, new RegExp(`\\b${m}\\s*[(:]`).test(webgl));
  }
  check('throws on WebGL failure', /throw\s+new\s+Error/.test(allWebgl));
  check('devicePixelRatio clamped to <= 2', /Math\.min\([^)]*devicePixelRatio[^)]*\)|Math\.min\(\s*2|,\s*2\s*\)/.test(allWebgl));
  check('sizes from canvas.clientWidth (not window)', /clientWidth/.test(allWebgl));
  check('no window.innerWidth sizing in webgl', !/window\.innerWidth/.test(allWebgl));
  check('handles webglcontextlost', /webglcontextlost/.test(allWebgl));
  check('honours reducedMotion', /reducedMotion/.test(allWebgl));
  check('disposes renderer', /renderer\.dispose\(\)/.test(allWebgl));
  // Geometries may be held in a local (boxGeo) or reached via mesh.geometry.
  check('disposes geometry', /\b\w*[Gg]eo\w*\.dispose\(\)/.test(allWebgl));
  check('disposes materials', /\b\w*[Mm]at\w*\.dispose\(\)/.test(allWebgl));
  check('webgl does not import UI layer', !/from\s+['"]\.\.\/ui/.test(allWebgl));
  warn('no console.log left in webgl', !/console\.log\(/.test(allWebgl));
}

// -------------------------------------------------------- CONTRACTS.md §2 wiring
if (mainJs) {
  check('wires createScene in try/catch', /try\s*\{[\s\S]*createScene/.test(mainJs));
  check('sets data-webgl="off" fallback', /data-webgl/.test(mainJs) || /dataset\.webgl/.test(mainJs));
  check('IntersectionObserver start/stop', /IntersectionObserver/.test(mainJs));
  check('ResizeObserver -> resize()', /ResizeObserver/.test(mainJs));
  check('visibilitychange handling', /visibilitychange/.test(mainJs));
  check('prefers-reduced-motion resolved', /prefers-reduced-motion/.test(mainJs));
  check('rAF-coalesced listeners', /requestAnimationFrame/.test(mainJs));
}

// ------------------------------------------------------------- CSS hook contract
const cssDir = join(ROOT, 'src/styles');
if (existsSync(cssDir)) {
  const css = readdirSync(cssDir)
    .filter((f) => f.endsWith('.css'))
    .map((f) => readFileSync(join(cssDir, f), 'utf8'))
    .join('\n');

  check('styles [data-webgl="off"] .hero', /\[data-webgl=["']off["']\]/.test(css));
  check('styles [data-reveal]', /\[data-reveal\]/.test(css));
  check('styles [data-reveal="in"]', /\[data-reveal=["']in["']\]/.test(css));
  check('styles .is-open (mobile nav)', /\.is-open/.test(css));
  check('styles [aria-invalid="true"]', /\[aria-invalid=["']true["']\]/.test(css));
  check('styles .field-error', /\.field-error/.test(css));
  check('has prefers-reduced-motion block', /@media[^{]*prefers-reduced-motion[^{]*reduce/.test(css));
  check('has :focus-visible rings', /:focus-visible/.test(css));
  check('no external @import url()', !/@import\s+url\(\s*['"]?https?:/.test(css));
}

// ------------------------------------------------------ HTML: a11y, SEO, facts
if (html) {
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  check('exactly one <h1>', h1s === 1, `found ${h1s}`);
  check('has <main> landmark', /<main[\s>]/.test(html));
  check('has <nav> landmark', /<nav[\s>]/.test(html));
  check('has <footer> landmark', /<footer[\s>]/.test(html));
  check('has skip link', /#main|skip/i.test(html));
  check('has lang attribute', /<html[^>]*\slang=/.test(html));
  check('has meta description', /<meta[^>]*name=["']description["']/.test(html));
  check('has canonical', /rel=["']canonical["']/.test(html));
  check('has Open Graph tags', /property=["']og:/.test(html));
  check('has JSON-LD GeneralContractor', /GeneralContractor/.test(html));
  check('has viewport meta', /name=["']viewport["']/.test(html));

  // Verified business facts — must be present and exact.
  check('phone tel: link correct', /tel:\+14165572381/.test(html));
  check('email mailto correct', /mailto:info@italgroup\.ca/.test(html));
  check('postal code correct', /L4L\s?2G2/.test(html));
  check('street address correct', /75\s+Moonstone\s+Pl/i.test(html));
  check('uses <address> element', /<address[\s>]/.test(html));

  // Fabricated-fact tripwires — the brief forbids inventing proof.
  const strippedText = html.replace(/<script[\s\S]*?<\/script>/g, '');
  const fabrications = [
    [/\b\d{2,}\+?\s*(years|yrs)\b/i, 'years-in-business claim'],
    [/\b\d{2,}\+\s*(projects|clients|builds|homes)/i, 'project/client count'],
    [/\b(since|est\.?|established)\s+(19|20)\d{2}\b/i, 'founding year'],
    [/\blicen[cs]e\s*#?\s*\d+/i, 'licence number'],
    [/\baward[- ]winning\b/i, 'award claim'],
    [/\b\d+\s*(star|★)/i, 'rating claim'],
  ];
  for (const [re, label] of fabrications) {
    check(`no fabricated ${label}`, !re.test(strippedText));
  }

  warn('no console.log in html', !/console\.log\(/.test(html));
  check('no external CDN scripts', !/<script[^>]+src=["']https?:/.test(html));
  check('no external stylesheet links', !/<link[^>]+href=["']https?:[^"']*\.css/.test(html));
}

// ------------------------------------------------------------------ dist budget
const dist = join(ROOT, 'dist');
if (existsSync(dist)) {
  let js = 0;
  let css = 0;
  const walk = (d) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      const s = statSync(p);
      if (s.isDirectory()) walk(p);
      else if (f.endsWith('.js')) js += s.size;
      else if (f.endsWith('.css')) css += s.size;
    }
  };
  walk(dist);
  const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
  check('dist/index.html emitted', existsSync(join(dist, 'index.html')));
  // 700 KB gzipped budget; raw JS is ~3-4x gzipped, so 2.1 MB raw is the proxy.
  check('JS within budget', js < 2_100_000, `raw JS ${kb(js)}`);
  warn('CSS reasonable', css < 200_000, `raw CSS ${kb(css)}`);
} else {
  warn('dist/ present (run npm run build)', false, 'skipped bundle checks');
}

// ----------------------------------------------------------------------- report
const pad = (s, n) => s + ' '.repeat(Math.max(0, n - s.length));
let failed = 0;
let advisories = 0;
console.log('\n  Ital Group — verification\n  ' + '-'.repeat(58));
for (const r of results) {
  if (!r.pass && r.advisory) advisories++;
  if (!r.pass && !r.advisory) failed++;
  const tag = r.pass ? '  ok  ' : r.advisory ? ' warn ' : ' FAIL ';
  console.log(`  ${tag} ${pad(r.name, 42)} ${r.detail}`);
}
console.log('  ' + '-'.repeat(58));
console.log(
  `  ${results.filter((r) => r.pass).length}/${results.length} passed` +
    (advisories ? `, ${advisories} advisory` : '') +
    (failed ? `, ${failed} FAILED\n` : '\n')
);
process.exit(failed ? 1 : 0);
