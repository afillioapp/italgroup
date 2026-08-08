/**
 * Ital Group — hero WebGL scene.
 *
 * A building's structural frame assembles itself as the visitor scrolls:
 * columns and beams rise into place from the base up, resolving into a
 * complete structure. Chosen over the usual hard-hat/hi-vis imagery because it
 * says the same thing a general contractor sells — order, sequence, a job that
 * comes together in the right order — without a single stock photo.
 *
 * Public interface is frozen by docs/CONTRACTS.md §1. In particular this module
 * owns its own RAF loop, reads size only from the canvas, attaches no listeners
 * outside the canvas, and THROWS when a context cannot be created (the page,
 * not this module, decides what to show instead).
 */
import * as THREE from 'three';
import { buildFrame } from './frame.js';
import {
  KEY_LIGHT,
  FILL_LIGHT,
  MATERIAL_BASE,
  MATERIAL_SECONDARY,
  ACCENT,
  FOG,
} from './palette.js';

const MAX_DPR = 2;
const MOBILE_WIDTH = 768;

/**
 * Assembly at rest, before any scrolling. Not zero: at zero every member is
 * sunk below its seat at 0.001 scale, so a visitor who never scrolls sees an
 * empty box indistinguishable from a broken hero. Starting part-built also
 * reads correctly for the business — a structure mid-build — and still leaves
 * the top of the frame to resolve as the page scrolls.
 */
const ASSEMBLY_FLOOR = 0.55;

/** Smoothstep — assembly easing, so members decelerate as they seat. */
const smoothstep = (t) => t * t * (3 - 2 * t);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Frame-rate independent damping. `lambda` is roughly "how fast", and the
 * exponential form keeps the feel identical at 60Hz and 120Hz.
 */
const damp = (current, target, lambda, dt) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

export function createScene(canvas, opts = {}) {
  const reducedMotion = !!opts.reducedMotion;

  // ---------------------------------------------------------------- context
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
    });
    // Constructing the renderer can succeed while the underlying context is
    // unusable, so confirm we actually got one.
    if (!renderer.getContext()) throw new Error('no context');
  } catch (err) {
    if (renderer) {
      try {
        renderer.dispose();
      } catch {
        /* already unusable */
      }
    }
    throw new Error(`WebGL unavailable: ${err && err.message ? err.message : err}`);
  }

  // Quality tier is decided from the canvas box, never the window — the canvas
  // may not be full-bleed, and the contract says window is off-limits here.
  const startWidth = canvas.clientWidth || 1;
  const isCompact = startWidth < MOBILE_WIDTH;
  const dprCap = isCompact ? 1.5 : MAX_DPR;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
  renderer.shadowMap.enabled = false; // shadows cost more than they add here
  renderer.setClearColor(FOG, 1);

  // ------------------------------------------------------------------ scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(FOG);
  scene.fog = new THREE.Fog(FOG, isCompact ? 16 : 20, isCompact ? 42 : 54);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);

  const cfg = isCompact
    ? { floors: 5, baysX: 3, baysZ: 2, spacing: 2.3, floorH: 1.7, member: 0.17 }
    : { floors: 7, baysX: 4, baysZ: 3, spacing: 2.2, floorH: 1.65, member: 0.15 };

  const frame = buildFrame(cfg);

  // ----------------------------------------------------------------- lights
  const key = new THREE.DirectionalLight(KEY_LIGHT, 2.6);
  key.position.set(6, 10, 7);
  scene.add(key);

  const fill = new THREE.DirectionalLight(FILL_LIGHT, 1.5);
  fill.position.set(-8, 2, -5);
  scene.add(fill);

  const hemi = new THREE.HemisphereLight(KEY_LIGHT, MATERIAL_SECONDARY, 0.5);
  scene.add(hemi);

  // A dim brass point light inside the frame so the accent members read as lit
  // from within the structure rather than painted on.
  const core = new THREE.PointLight(ACCENT, 12, 18, 2);
  core.position.set(0, -frame.height * 0.1, 0);
  scene.add(core);

  // -------------------------------------------------------------- materials
  // Low-ish metalness: without an environment map a high-metalness surface
  // renders nearly black. This reads as painted structural steel.
  const structuralMat = new THREE.MeshStandardMaterial({
    color: MATERIAL_BASE,
    metalness: 0.35,
    roughness: 0.52,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: ACCENT,
    metalness: 0.55,
    roughness: 0.34,
    emissive: new THREE.Color(ACCENT),
    emissiveIntensity: 0.16,
  });

  const boxGeo = new THREE.BoxGeometry(1, 1, 1);

  const group = new THREE.Group();
  scene.add(group);

  const structuralMesh = new THREE.InstancedMesh(boxGeo, structuralMat, frame.structural.length);
  const accentMesh = new THREE.InstancedMesh(boxGeo, accentMat, frame.accent.length);
  structuralMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  accentMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  structuralMesh.frustumCulled = false;
  accentMesh.frustumCulled = false;
  group.add(structuralMesh, accentMesh);

  // Reused scratch objects — nothing is allocated inside the render loop.
  const dummy = new THREE.Object3D();
  const RISE = frame.height * 0.85; // how far below its seat a member starts

  /**
   * Writes every instance matrix for an assembly progress of `p` (0..1).
   * Each member has its own delay/duration window carved out of that range, so
   * the structure resolves bottom-up rather than all at once.
   */
  function layout(mesh, members, p) {
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      const t = smoothstep(clamp01((p - m.delay) / 0.22));

      // Rise into place, spinning off its final orientation on the way in.
      dummy.position.set(m.x, m.y - (1 - t) * RISE, m.z);
      dummy.rotation.set(0, (1 - t) * m.spin, 0);

      // Scale in from nothing so early members don't pop as full-size boxes.
      const s = 0.001 + t * 0.999;
      dummy.scale.set(m.sx * s, m.sy * s, m.sz * s);

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  // ------------------------------------------------------------------ state
  let rafId = 0;
  let running = false;
  let disposed = false;
  let contextLost = false;
  let lastTime = 0;

  let targetProgress = 0;
  let progress = 0;
  let targetPointerX = 0;
  let targetPointerY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let spin = 0; // slow idle rotation

  // Camera distance that keeps the whole frame in shot; resize() computes it
  // once the aspect ratio is known.
  let fitDist = Math.hypot(frame.radius, frame.height / 2) * 3;

  function updateCamera() {
    // The camera rides a sphere of radius `fitDist` centred on the frame, so
    // the whole structure stays inside the frustum no matter how it orbits.
    // Hardcoded distances can't do this — a tall frame overflows vertically on
    // desktop and horizontally on a phone, at different distances each.
    const orbit = spin + pointerX * 0.42;
    const elev = 0.12 - pointerY * 0.08 + progress * 0.04; // radians above the equator
    const d = fitDist * (1 - progress * 0.06); // a touch closer as it completes

    const horiz = Math.cos(elev) * d;
    camera.position.set(Math.sin(orbit) * horiz, Math.sin(elev) * d, Math.cos(orbit) * horiz);
    camera.lookAt(0, 0, 0);
  }

  function renderFrame() {
    layout(structuralMesh, frame.structural, progress);
    layout(accentMesh, frame.accent, progress);
    core.intensity = 6 + progress * 14;
    updateCamera();
    renderer.render(scene, camera);
  }

  function tick(now) {
    if (!running || disposed) return;
    rafId = requestAnimationFrame(tick);

    // Clamped delta: a backgrounded tab returning would otherwise jump.
    const dt = Math.min((now - lastTime) / 1000 || 0, 0.05);
    lastTime = now;

    progress = damp(progress, targetProgress, 4.5, dt);
    pointerX = damp(pointerX, targetPointerX, 3.2, dt);
    pointerY = damp(pointerY, targetPointerY, 3.2, dt);
    spin += dt * 0.045;

    renderFrame();
  }

  function resize() {
    if (disposed || contextLost) return; // rendering into a lost context is wasted work
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    // `false` — never let three write inline width/height onto the canvas; the
    // stylesheet owns its box.
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // Fit the frame's silhouette, which is a cylinder rather than a sphere: it
    // sweeps `frame.radius` horizontally as it spins, and is `height` tall. The
    // two constraints bind at different aspect ratios — vertical on a desktop
    // window, horizontal on a portrait phone — so satisfy the tighter one.
    // `+ radiusH` accounts for the near face sitting closer than the axis.
    const vHalf = (camera.fov * Math.PI) / 360;
    const hHalf = Math.atan(Math.tan(vHalf) * camera.aspect);
    const radiusH = frame.radius;
    const radiusV = frame.height / 2;

    // 1.22 rather than a tight fit: the camera also tilts up to ~0.24rad of
    // elevation, which lifts the frame's far top corner and clips it at a
    // margin that only accounts for the untilted silhouette. Verified across
    // viewports by scripts/check-framing.mjs.
    fitDist =
      (Math.max(radiusH / Math.tan(hHalf), radiusV / Math.tan(vHalf)) + radiusH) * 1.22;

    // Fog has to travel with the camera. Pinned to fixed distances it would
    // swallow the whole structure on a narrow viewport, where fitDist is much
    // larger — the depth cue is meant to fade the back of the frame, not erase it.
    scene.fog.near = fitDist - radiusH * 1.15;
    scene.fog.far = fitDist + radiusH * 2.2;

    if (!running) renderFrame(); // keep the static/paused frame correct
  }

  // ----------------------------------------------------------- context loss
  function onContextLost(event) {
    event.preventDefault();
    contextLost = true;
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function onContextRestored() {
    contextLost = false;
    resize();
    if (!reducedMotion) start();
    else renderFrame();
  }

  canvas.addEventListener('webglcontextlost', onContextLost, false);
  canvas.addEventListener('webglcontextrestored', onContextRestored, false);

  // ----------------------------------------------------------- initial paint
  resize();
  if (reducedMotion) {
    // A single composed frame: the structure already built, no loop, no motion.
    progress = 1;
    targetProgress = 1;
  } else {
    // Open part-built rather than empty, then let scroll finish the job.
    progress = ASSEMBLY_FLOOR;
    targetProgress = ASSEMBLY_FLOOR;
  }
  renderFrame();

  // --------------------------------------------------------------- controls
  function start() {
    if (running || disposed || contextLost) return;
    if (reducedMotion) return; // static by request — never spin up a loop
    running = true;
    lastTime = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    if (!running) return;
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function setScroll(p) {
    // Under reduced motion the scene is the single composed frame painted at
    // construction (progress 1). Repainting per scroll would make the hero a
    // scroll-linked animation — exactly what the preference asks us not to do —
    // and, since the page loads at scrollY 0, would snap the structure back to
    // progress 0 and leave the canvas empty.
    if (reducedMotion) return;
    // Scroll drives the remaining assembly above the resting floor.
    targetProgress = ASSEMBLY_FLOOR + (1 - ASSEMBLY_FLOOR) * clamp01(p);
  }

  function setPointer(x, y) {
    if (reducedMotion) return; // no pointer-driven motion under reduced motion
    targetPointerX = Math.max(-1, Math.min(1, x));
    targetPointerY = Math.max(-1, Math.min(1, y));
  }

  function dispose() {
    if (disposed) return;
    stop();
    disposed = true;

    canvas.removeEventListener('webglcontextlost', onContextLost);
    canvas.removeEventListener('webglcontextrestored', onContextRestored);

    scene.remove(group);
    group.remove(structuralMesh, accentMesh);
    structuralMesh.dispose();
    accentMesh.dispose();

    boxGeo.dispose();
    structuralMat.dispose();
    accentMat.dispose();

    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss?.();
  }

  return { start, stop, setScroll, setPointer, resize, dispose };
}
