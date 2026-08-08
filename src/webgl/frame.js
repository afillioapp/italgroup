/**
 * Generates the structural members of a building frame — columns, floor beams,
 * and a few diagonal braces.
 *
 * Every member is described declaratively (final position, final scale, and an
 * assembly delay) so the render loop can interpolate each one from "not yet
 * placed" to "seated" without allocating anything per frame.
 *
 * Members are returned centred on the origin so the whole frame can be rotated
 * about its own axis rather than orbiting a corner.
 */

/**
 * @param {{floors:number, baysX:number, baysZ:number, spacing:number, floorH:number, member:number}} cfg
 * @returns {{ structural: Member[], accent: Member[], height: number, radius: number }}
 * @typedef {{ x:number, y:number, z:number, sx:number, sy:number, sz:number, delay:number, spin:number }} Member
 */
export function buildFrame(cfg) {
  const { floors, baysX, baysZ, spacing, floorH, member } = cfg;

  const width = baysX * spacing;
  const depth = baysZ * spacing;
  const height = floors * floorH;

  // Centre the frame on the origin.
  const ox = -width / 2;
  const oz = -depth / 2;
  const oy = -height / 2;

  const structural = [];
  const accent = [];

  // Assembly reads bottom-up: a member's delay is driven by its height, with a
  // small deterministic jitter so members on the same floor don't snap in as a
  // single rigid row.
  const jitter = (i) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
  // Capped at 1 - ASSEMBLY_WINDOW (0.22) so the last member is fully seated at
  // p = 1 rather than needing a progress value the page can never deliver.
  const delayFor = (y, i) => {
    const h = (y - oy) / height; // 0 at the base, 1 at the roof
    return Math.min(0.78, h * 0.62 + jitter(i) * 0.12);
  };

  let n = 0;

  // ---- Columns: one per grid node, per floor ----
  for (let f = 0; f < floors; f++) {
    for (let i = 0; i <= baysX; i++) {
      for (let k = 0; k <= baysZ; k++) {
        const y = oy + f * floorH + floorH / 2;
        structural.push({
          x: ox + i * spacing,
          y,
          z: oz + k * spacing,
          sx: member,
          sy: floorH,
          sz: member,
          delay: delayFor(y, n),
          spin: (jitter(n) - 0.5) * 1.6,
        });
        n++;
      }
    }
  }

  // ---- Floor beams spanning X, at every floor line above the base ----
  for (let f = 1; f <= floors; f++) {
    for (let i = 0; i < baysX; i++) {
      for (let k = 0; k <= baysZ; k++) {
        const y = oy + f * floorH;
        structural.push({
          x: ox + i * spacing + spacing / 2,
          y,
          z: oz + k * spacing,
          sx: spacing,
          sy: member,
          sz: member,
          delay: delayFor(y, n),
          spin: (jitter(n) - 0.5) * 1.6,
        });
        n++;
      }
    }
  }

  // ---- Floor beams spanning Z ----
  for (let f = 1; f <= floors; f++) {
    for (let i = 0; i <= baysX; i++) {
      for (let k = 0; k < baysZ; k++) {
        const y = oy + f * floorH;
        structural.push({
          x: ox + i * spacing,
          y,
          z: oz + k * spacing + spacing / 2,
          sx: member,
          sy: member,
          sz: spacing,
          delay: delayFor(y, n),
          spin: (jitter(n) - 0.5) * 1.6,
        });
        n++;
      }
    }
  }

  // ---- Accent: brass edge beams along the roof and one mid-height band ----
  // Kept few and deliberate — this is the one warm colour in the scene.
  const accentLevels = [floors, Math.max(1, Math.round(floors * 0.5))];
  for (const f of accentLevels) {
    const y = oy + f * floorH;
    for (let i = 0; i < baysX; i++) {
      for (const k of [0, baysZ]) {
        accent.push({
          x: ox + i * spacing + spacing / 2,
          y,
          z: oz + k * spacing,
          sx: spacing,
          sy: member * 1.25,
          sz: member * 1.25,
          delay: delayFor(y, n),
          spin: (jitter(n) - 0.5) * 1.2,
        });
        n++;
      }
    }
    for (let k = 0; k < baysZ; k++) {
      for (const i of [0, baysX]) {
        accent.push({
          x: ox + i * spacing,
          y,
          z: oz + k * spacing + spacing / 2,
          sx: member * 1.25,
          sy: member * 1.25,
          sz: spacing,
          delay: delayFor(y, n),
          spin: (jitter(n) - 0.5) * 1.2,
        });
        n++;
      }
    }
  }

  return {
    structural,
    accent,
    height,
    radius: Math.hypot(width, depth) / 2,
  };
}
