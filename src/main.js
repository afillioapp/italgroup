/**
 * Ital Group — boot and wiring.
 *
 * Owns every browser event and feeds values into the WebGL scene through the
 * frozen interface in docs/CONTRACTS.md §1/§2. The scene never listens to the
 * document itself, which keeps scroll and pointer handling rAF-coalesced in
 * exactly one place.
 */
import './styles/main.css';
import { createScene } from './webgl/index.js';
import { initNav } from './ui/nav.js';
import { initReveal } from './ui/reveal.js';
import { initForm } from './ui/form.js';
import { initSmoothScroll } from './ui/smoothScroll.js';

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const reducedMotion = motionQuery.matches;

// ------------------------------------------------------------------ page UI
initNav();
initReveal({ reducedMotion });
initForm();
initSmoothScroll({ reducedMotion });

// -------------------------------------------------------------------- WebGL
const canvas = document.querySelector('.hero__canvas');

/** Hand the hero over to CSS: `[data-webgl="off"] .hero` renders the fallback. */
function disableWebGL() {
  document.documentElement.setAttribute('data-webgl', 'off');
  if (canvas) {
    canvas.setAttribute('aria-hidden', 'true');
    canvas.hidden = true;
  }
}

/** Cheap capability probe so an unsupported browser never flashes an empty hero. */
function webglSupported() {
  if (!window.WebGLRenderingContext && !window.WebGL2RenderingContext) return false;
  try {
    const probe = document.createElement('canvas');
    return !!(probe.getContext('webgl2') || probe.getContext('webgl'));
  } catch {
    return false;
  }
}

let scene = null;

if (canvas && webglSupported()) {
  try {
    scene = createScene(canvas, { reducedMotion });
  } catch {
    scene = null;
    disableWebGL();
  }
} else {
  disableWebGL();
}

if (scene) {
  // Visibility and intersection are tracked separately: coming back to the tab
  // must not restart a loop for a canvas that has since scrolled out of view.
  let intersecting = true;
  let pageVisible = document.visibilityState !== 'hidden';

  const sync = () => {
    if (intersecting && pageVisible) scene.start();
    else scene.stop();
  };

  // ---- scroll → assembly progress ----------------------------------------
  // Mapped across the hero's own height rather than the whole document: the
  // canvas is only on screen for that stretch, so spreading the assembly over
  // the full page would hide most of it.
  // Assembly completes over the first ~55% of the hero, not its full height:
  // by the time the hero is 90% scrolled past, the canvas is a sliver behind
  // the sticky nav and about to be stopped, so a longer span would finish the
  // build off-screen where nobody sees it.
  const hero = document.querySelector('.hero');
  let scrollQueued = false;
  let heroSpan = 1;

  // Cached — reading offsetHeight inside the scroll handler forces a layout on
  // every scroll frame.
  const measureHero = () => {
    heroSpan = (hero?.offsetHeight || window.innerHeight) * 0.55;
  };

  const readScroll = () => {
    scrollQueued = false;
    const p = heroSpan > 0 ? window.scrollY / heroSpan : 0;
    scene.setScroll(Math.max(0, Math.min(1, p)));
  };

  measureHero();

  const onScroll = () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(readScroll);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  readScroll();

  // ---- pointer → parallax -------------------------------------------------
  let pointerQueued = false;
  let px = 0;
  let py = 0;

  const flushPointer = () => {
    pointerQueued = false;
    scene.setPointer(px, py);
  };

  window.addEventListener(
    'pointermove',
    (event) => {
      // Touch drags are scroll gestures, not parallax input — reacting to them
      // makes the scene lurch while the page is moving.
      if (event.pointerType !== 'mouse') return;
      px = (event.clientX / window.innerWidth) * 2 - 1;
      py = (event.clientY / window.innerHeight) * 2 - 1;
      if (pointerQueued) return;
      pointerQueued = true;
      requestAnimationFrame(flushPointer);
    },
    { passive: true }
  );

  // ---- lifecycle ----------------------------------------------------------
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        intersecting = entries.some((e) => e.isIntersecting);
        sync();
      },
      { threshold: 0 }
    );
    io.observe(canvas);
  }

  document.addEventListener('visibilitychange', () => {
    pageVisible = document.visibilityState !== 'hidden';
    sync();
  });

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => {
      scene.resize();
      measureHero();
      readScroll();
    });
    ro.observe(canvas);
  } else {
    window.addEventListener('resize', () => {
      scene.resize();
      measureHero();
      readScroll();
    });
  }

  sync();

  // Free the GPU deterministically rather than waiting on GC — but a
  // bfcache-eligible pagehide is not a teardown. The page can be restored, and
  // a disposed scene comes back as a dead canvas with no fallback styling, so
  // only pause in that case.
  window.addEventListener('pagehide', (event) => {
    if (event.persisted) scene.stop();
    else scene.dispose();
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) sync();
  });
}
