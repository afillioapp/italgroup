/**
 * Scene colours, hardcoded per CONTRACTS.md §4.
 *
 * These mirror docs/DESIGN.md §Palette → "WebGL scene colours". Several are
 * byte-identical to the CSS tokens on purpose: the fog/background matches
 * --color-bg so the canvas edges dissolve into the page instead of reading as
 * an inset video, and the accent matches --color-accent exactly.
 *
 * Deliberately NOT read from CSS at runtime — a getComputedStyle call per
 * frame (or a paint-blocking one at boot) buys nothing here.
 */
export const KEY_LIGHT = 0xf3e4c0; // warm white-gold, brass family
export const FILL_LIGHT = 0x3b4854; // cool steel-blue, softens the shadow side
export const MATERIAL_BASE = 0x2c2e33; // graphite — brushed metal / concrete
export const MATERIAL_SECONDARY = 0x1b1d21; // recessed geometry, == --color-surface
export const ACCENT = 0xc9a24b; // brass — the one warm accent, == --color-accent
export const FOG = 0x121316; // == --color-bg
