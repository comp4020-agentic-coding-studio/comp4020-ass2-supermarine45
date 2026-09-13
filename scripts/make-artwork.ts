#!/usr/bin/env node
// Generates the site's two pieces of course artwork from one description, so
// the hero and the link-preview card cannot drift apart:
//
//   src/assets/images/hero-home.svg  - the home page hero, vector
//   src/assets/images/card.png       - the og:image, 1200x630 raster
//
// Both are a shelf elevation reduced to flat shapes in two inks, in the Slop
// palette. A repeating shelf rhythm is deliberate: the theme's hero is
// `object-fit: cover` over a band that is roughly 8:1 on desktop and nearly
// square at the 390px marking viewport, so a single focal composition would
// survive neither crop. A repeat crops gracefully at any aspect.
//
// The theme passes an SVG hero through unrasterised (see Hero.astro), which is
// why the hero is vector and only the card needs sharp. Social scrapers still
// don't decode SVG, so the card stays a raster.
//
// Run: node scripts/make-artwork.ts

import { writeFileSync } from "node:fs";
import sharp from "sharp";

// The two inks, plus the ground. Gold and bronze are the Slop brand tokens
// (--at-primary, --at-secondary); the ink is a warm near-black rather than
// #000 so it sits in the same family as --at-tertiary.
const GOLD = "#b97d1c";
const BRONZE = "#8a5c13";
const INK = "#1a1611";
const CREAM = "#f2e9d8";

// A riso print misregisters: each ink is laid down in a separate pass, and the
// passes never line up perfectly. Offsetting the gold pass behind the ink pass
// is what reads as "printed" rather than "drawn in a browser".
const REGISTRATION = { x: 7, y: 5 };

/** Deterministic PRNG, so the artwork is reproducible from the script alone. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

type Vessel = "bottle" | "cask" | "can";

/** One vessel silhouette, baseline-anchored at (cx, baseY). */
function silhouette(kind: Vessel, cx: number, baseY: number, w: number, h: number): string {
  const l = cx - w / 2;
  const r = cx + w / 2;
  const top = baseY - h;

  if (kind === "cask") {
    // Bag-in-box: a plain box with a tap. Week 3's entire case study.
    const tapW = w * 0.1;
    const tapH = h * 0.12;
    return [
      `M${l} ${baseY}`,
      `V${top}`,
      `H${r}`,
      `V${baseY}`,
      "Z",
      // tap, punched low on the face
      `M${cx - tapW / 2} ${baseY}`,
      `v${-tapH}`,
      `h${tapW}`,
      `v${tapH}`,
      "Z",
    ].join(" ");
  }

  if (kind === "can") {
    // RTD can: straight sides, a chamfer at each top corner.
    const ch = w * 0.18;
    return [
      `M${l} ${baseY}`,
      `V${top + ch}`,
      `L${l + ch} ${top}`,
      `H${r - ch}`,
      `L${r} ${top + ch}`,
      `V${baseY}`,
      "Z",
    ].join(" ");
  }

  // Bottle: body, shoulder, neck, lip.
  const neckW = w * 0.34;
  const neckH = h * 0.3;
  const shoulderH = h * 0.16;
  const bodyTop = top + neckH + shoulderH;
  const lipH = h * 0.045;
  const nl = cx - neckW / 2;
  const nr = cx + neckW / 2;
  return [
    `M${l} ${baseY}`,
    `V${bodyTop}`,
    `Q${l} ${bodyTop - shoulderH} ${nl} ${top + neckH}`,
    `V${top + lipH}`,
    `H${nl - w * 0.04}`,
    `V${top}`,
    `H${nr + w * 0.04}`,
    `V${top + lipH}`,
    `H${nr}`,
    `V${top + neckH}`,
    `Q${r} ${bodyTop - shoulderH} ${r} ${bodyTop}`,
    `V${baseY}`,
    "Z",
  ].join(" ");
}

interface Shelf {
  baseY: number;
  height: number;
  pitch: number;
}

/** The full composition, as two ink passes. */
function compose(w: number, h: number, seed: number): { gold: string; ink: string } {
  const rand = rng(seed);
  const gold: string[] = [];
  const ink: string[] = [];

  // Three shelves, deepest at the bottom. The lower third sits under the
  // theme's 80%-black scrim, so it carries the least detail.
  const shelves: Shelf[] = [
    { baseY: h * 0.42, height: h * 0.26, pitch: w / 26 },
    { baseY: h * 0.72, height: h * 0.3, pitch: w / 21 },
    { baseY: h * 1.02, height: h * 0.34, pitch: w / 17 },
  ];

  for (const [row, shelf] of shelves.entries()) {
    // The shelf board itself.
    const boardH = Math.max(3, h * 0.008);
    ink.push(`<rect x="0" y="${shelf.baseY}" width="${w}" height="${boardH}" />`);

    const count = Math.ceil(w / shelf.pitch) + 1;
    for (let i = 0; i < count; i++) {
      const cx = i * shelf.pitch + shelf.pitch / 2;
      const roll = rand();
      const kind: Vessel = roll < 0.18 ? "cask" : roll < 0.34 ? "can" : "bottle";

      // Vessels vary in height and width so the rhythm reads as stock, not
      // wallpaper. Cans sit shorter, casks wider.
      const scale = 0.72 + rand() * 0.28;
      const vh = shelf.height * scale * (kind === "can" ? 0.62 : 1);
      const vw = shelf.pitch * (kind === "cask" ? 0.82 : kind === "can" ? 0.46 : 0.58);

      // Roughly a third of the stock is inked gold, the rest solid. Alternating
      // by a threshold rather than strictly keeps the row from striping.
      const isGold = rand() < 0.38;
      const path = silhouette(kind, cx, shelf.baseY, vw, vh);
      (isGold ? gold : ink).push(`<path d="${path}" />`);

      // Shelf tags: a small tick under some of the stock. These are the
      // course's actual subject, so they earn their place in the artwork.
      if (rand() < 0.3) {
        const tw = shelf.pitch * 0.3;
        const th = Math.max(4, h * 0.011);
        gold.push(
          `<rect x="${cx - tw / 2}" y="${shelf.baseY + boardH + th * 0.6}" width="${tw}" height="${th}" />`,
        );
      }
    }

    // One bronze band per shelf, behind the stock, as a depth cue.
    if (row < 2) {
      gold.push(
        `<rect x="0" y="${shelf.baseY - shelf.height * 1.06}" width="${w}" height="${Math.max(2, h * 0.004)}" opacity="0.55" />`,
      );
    }
  }

  return { gold: gold.join("\n      "), ink: ink.join("\n      ") };
}

function svg(w: number, h: number, seed: number, overlay?: string): string {
  const { gold, ink } = compose(w, h, seed);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">
  <rect width="${w}" height="${h}" fill="${CREAM}" />
  <!-- gold pass, laid first and misregistered behind the ink -->
  <g fill="${GOLD}" transform="translate(${REGISTRATION.x} ${REGISTRATION.y})">
      ${gold}
  </g>
  <!-- ink pass -->
  <g fill="${INK}">
      ${ink}
  </g>
  <!-- the bronze token, used as a single hairline horizon -->
  <rect x="0" y="${h * 0.425}" width="${w}" height="${Math.max(1, h * 0.002)}" fill="${BRONZE}" />
${overlay ?? ""}</svg>
`;
}

// --- hero: vector, passed through by the theme unrasterised ---
const heroPath = "src/assets/images/hero-home.svg";
writeFileSync(heroPath, svg(2560, 1086, 20270222));
console.log(`wrote ${heroPath} (2560x1086 svg)`);

// --- card: 1200x630 raster for og:image, with the course record set in it ---
// A flat scrim mutes the cream ground to a dead grey. A directional one holds
// contrast under the type on the left while the stock stays warm on the right,
// which is the half a thumbnail actually shows.
const cardOverlay = `  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${INK}" stop-opacity="0.88" />
      <stop offset="0.55" stop-color="${INK}" stop-opacity="0.66" />
      <stop offset="1" stop-color="${INK}" stop-opacity="0.34" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#scrim)" />
  <text x="72" y="300" fill="#e0a53a" font-family="Public Sans, Helvetica, Arial, sans-serif" font-size="34" font-weight="600" letter-spacing="6">SLOP4230</text>
  <text x="72" y="386" fill="${CREAM}" font-family="Public Sans, Helvetica, Arial, sans-serif" font-size="68" font-weight="600" letter-spacing="-1.5">Retail Ethanol Economics</text>
  <text x="72" y="440" fill="${CREAM}" font-family="Public Sans, Helvetica, Arial, sans-serif" font-size="28" opacity="0.82">Slop University · Semester 1, 2027</text>
  <rect x="72" y="478" width="132" height="5" fill="${GOLD}" />
`;
const cardPath = "src/assets/images/card.png";
await sharp(Buffer.from(svg(1200, 630, 42230, cardOverlay))).png().toFile(cardPath);
console.log(`wrote ${cardPath} (1200x630 png)`);
