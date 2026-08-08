#!/usr/bin/env node
/**
 * Hero framing check.
 *
 * Projects the real frame geometry through the real camera math across every
 * target viewport and asserts nothing falls outside the frustum. Catches the
 * class of bug you otherwise only find by opening the page on a device you
 * don't own: a structure cropped at the top on a laptop, or losing its outer
 * bays on a portrait phone.
 *
 * Keep the constants below in sync with src/webgl/index.js.
 * Exits non-zero if any viewport clips.
 */
import * as THREE from 'three';
import { buildFrame } from '../src/webgl/frame.js';

const FLOOR = 0.55; // ASSEMBLY_FLOOR in src/webgl/index.js
let clipped = 0;
const tiers = [
  ['desktop 1440x900',  {floors:7,baysX:4,baysZ:3,spacing:2.2,floorH:1.65,member:0.15}, 1440, 900],
  ['desktop 1920x1080', {floors:7,baysX:4,baysZ:3,spacing:2.2,floorH:1.65,member:0.15}, 1920,1080],
  ['laptop  1280x720',  {floors:7,baysX:4,baysZ:3,spacing:2.2,floorH:1.65,member:0.15}, 1280, 720],
  ['ultrawide 2560x700',{floors:7,baysX:4,baysZ:3,spacing:2.2,floorH:1.65,member:0.15}, 2560, 700],
  ['phone   360x740',   {floors:5,baysX:3,baysZ:2,spacing:2.3,floorH:1.7, member:0.17},  360, 740],
  ['phone   390x844',   {floors:5,baysX:3,baysZ:2,spacing:2.3,floorH:1.7, member:0.17},  390, 844],
  ['tablet  768x1024',  {floors:7,baysX:4,baysZ:3,spacing:2.2,floorH:1.65,member:0.15},  768,1024],
];

for (const [label, cfg, w, h] of tiers) {
  const frame = buildFrame(cfg);
  const cam = new THREE.PerspectiveCamera(38, w/h, 0.1, 200);
  const vHalf = (cam.fov*Math.PI)/360;
  const hHalf = Math.atan(Math.tan(vHalf)*cam.aspect);
  const rH = frame.radius, rV = frame.height/2;
  const fitDist = (Math.max(rH/Math.tan(hHalf), rV/Math.tan(vHalf)) + rH) * 1.22;
  const fogNear = fitDist - rH*1.15, fogFar = fitDist + rH*2.2;

  const members = [...frame.structural, ...frame.accent];
  let maxX=0, maxY=0, minZ=Infinity, maxFog=0, nearest=Infinity;

  // Sweep spin, pointer extremes, and progress from rest to complete.
  for (let s=0; s<Math.PI*2; s+=0.15)
  for (const pxv of [-1,0,1]) for (const pyv of [-1,0,1])
  for (const prog of [FLOOR, 0.7, 1.0]) {
    const orbit = s + pxv*0.42;
    const elev  = 0.12 - pyv*0.08 + prog*0.04;
    const d = fitDist*(1 - prog*0.06);
    const horiz = Math.cos(elev)*d;
    cam.position.set(Math.sin(orbit)*horiz, Math.sin(elev)*d, Math.cos(orbit)*horiz);
    cam.lookAt(0,0,0);
    cam.updateMatrixWorld(true);
    cam.updateProjectionMatrix();

    for (const m of members) {
      const t = Math.min(1, Math.max(0, (prog-m.delay)/0.22));
      const te = t*t*(3-2*t);
      if (te < 0.999) continue;           // only judge seated members
      // 8 corners of the seated member
      for (const sx of [-.5,.5]) for (const sy of [-.5,.5]) for (const sz of [-.5,.5]) {
        const v = new THREE.Vector3(m.x+sx*m.sx, m.y+sy*m.sy, m.z+sz*m.sz);
        const view = v.clone().applyMatrix4(cam.matrixWorldInverse);
        const dist = -view.z;
        nearest = Math.min(nearest, dist);
        maxFog = Math.max(maxFog, (dist-fogNear)/(fogFar-fogNear));
        const ndc = v.project(cam);
        maxX = Math.max(maxX, Math.abs(ndc.x));
        maxY = Math.max(maxY, Math.abs(ndc.y));
      }
    }
  }
  const fits = maxX <= 1 && maxY <= 1;
  if (!fits) clipped++;
  const ok = fits ? 'IN FRAME' : 'CLIPPED ';
  console.log(`${ok} ${label.padEnd(20)} dist=${fitDist.toFixed(1).padStart(5)} maxNDC x=${maxX.toFixed(2)} y=${maxY.toFixed(2)}  nearest=${nearest.toFixed(1)}  backFog=${(maxFog*100).toFixed(0)}%`);
}

if (clipped) {
  console.error(`\n  ${clipped} viewport(s) clip the hero geometry — raise the margin in resize().\n`);
  process.exit(1);
}
console.log('\n  All viewports frame the structure.\n');
