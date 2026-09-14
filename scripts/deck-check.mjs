#!/usr/bin/env node
// Walks every slide of every deck and reports the ones that do not fit.
//
// Why this is a separate check from viewport-check.mjs: reveal.js lays slides
// out on a fixed 1280x720 canvas and scales the whole thing with a CSS
// transform, so a deck *never* overflows the viewport horizontally no matter
// how much is on it. The horizontal-overflow check that catches a broken table
// on an ordinary page is structurally incapable of catching an overfull slide —
// it passes on a slide whose last three bullets have spilled off the bottom.
//
// What actually goes wrong on a slide is vertical: too many lines for 720px.
// That is a property of the canvas, not of the viewport, which is why this
// measures once in canvas units rather than twice at the two marking sizes. It
// also reports the tightest fill on the deck, because a slide at 96% of the
// canvas fits today and stops fitting the moment a line wraps differently.
//
// Usage: node scripts/deck-check.mjs <deck-url> [<deck-url>...]
//        node scripts/deck-check.mjs --all          (every deck under src/decks)
//        pnpm check:decks                           (--all, starting its own server)

import { spawn } from "node:child_process";
import { readdirSync } from "node:fs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9334;
const CANVAS = { width: 1280, height: 720 };
// A slide filling more than this much of the canvas has no room for a line to
// re-wrap. It is not broken, but it is one edit away from broken.
const TIGHT = 0.9;

const args = process.argv.slice(2);
const base = process.env.DECK_BASE ?? "http://localhost:4321/comp4020-ass2-supermarine45";
const urls = args.includes("--all")
  ? readdirSync("src/decks")
      .filter((f) => f.endsWith(".deck.mdx"))
      .map((f) => `${base}/decks/${f.replace(".deck.mdx", "")}/`)
      .sort()
  : args;

if (urls.length === 0) {
  console.error("usage: node scripts/deck-check.mjs <deck-url>... | --all");
  process.exit(2);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Reuse a dev or preview server if one is already up — running this next to a
// `pnpm dev` is the normal case while writing a deck, and re-measuring against a
// stale `dist/` instead of the file just edited is a trap worth closing.
async function reachable(url) {
  try {
    return (await fetch(url, { redirect: "manual" })).status < 400;
  } catch {
    return false;
  }
}

let server;
if (!(await reachable(`${base}/`))) {
  server = spawn("pnpm", ["exec", "astro", "preview"], { stdio: "ignore" });
  for (let i = 0; i < 60 && !(await reachable(`${base}/`)); i++) await sleep(500);
  if (!(await reachable(`${base}/`))) {
    console.error(`no server at ${base} and astro preview never came up`);
    server.kill();
    process.exit(2);
  }
}

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    `--remote-debugging-port=${PORT}`,
    "--no-first-run",
    "--user-data-dir=/tmp/.deck-check-profile",
    "about:blank",
  ],
  { stdio: "ignore" },
);

async function targetUrl() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const page = (await res.json()).find((t) => t.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      // chrome not up yet
    }
    await sleep(200);
  }
  throw new Error("chrome devtools endpoint never came up");
}

function session(ws) {
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result);
      pending.delete(msg.id);
    }
  });
  return (method, params = {}) =>
    new Promise((resolve) => {
      const n = ++id;
      pending.set(n, resolve);
      ws.send(JSON.stringify({ id: n, method, params }));
    });
}

// Measures the slide reveal is currently showing.
//
// The tempting shortcut — map over every `<section>` in one pass — silently
// undercounts. Reveal keeps a window of nearby slides laid out and sets
// `display: none` on the rest, so a whole-DOM sweep returns a zero-sized rect
// for every slide more than a step or two away and quietly drops it: a 13-slide
// deck came back as 10 checked, with the three worst offenders among the
// missing. So this walks the deck one slide at a time through the hash, the
// same route a `#/5` deep link takes, and measures only what is on screen.
//
// astromotion sets `hashOneBasedIndex: true`, so `#/1` is the *first* slide,
// not the second. Asking for the slide we landed on and comparing it to the one
// we asked for is what caught that: the off-by-one was invisible in the output
// (every slide still reported a plausible height) and silently dropped the last
// slide of every deck.
const MEASURE = `(() => {
  const all = [...document.querySelectorAll('.reveal .slides > section')];
  const section = document.querySelector('.reveal .slides > section.present');
  if (!section) return null;
  const at = all.indexOf(section);
  const canvas = { w: ${CANVAS.width}, h: ${CANVAS.height} };
  // The scale transform is on an ancestor, so rects come back in screen pixels;
  // divide it back out to talk in canvas units the author can act on.
  const slides = document.querySelector('.reveal .slides');
  const scale = slides.getBoundingClientRect().width / canvas.w || 1;
  const box = section.getBoundingClientRect();
  let top = Infinity, bottom = -Infinity, right = -Infinity, left = Infinity;
  for (const child of section.children) {
    if (child.tagName === 'ASIDE') continue; // speaker notes, never rendered
    const r = child.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    top = Math.min(top, r.top); bottom = Math.max(bottom, r.bottom);
    left = Math.min(left, r.left); right = Math.max(right, r.right);
  }
  if (!isFinite(top)) return { at, empty: true };
  const heading = section.querySelector('h1, h2, h3');
  const text = [...section.querySelectorAll('p, li, td, th')]
    .map((el) => parseFloat(getComputedStyle(el).fontSize))
    .filter((n) => n > 0);
  return {
    at,
    // Rehype appends an anchor '#' to every heading; it is chrome, not title.
    heading: heading ? heading.textContent.trim().replace(/#$/, '').trim().slice(0, 48) : '(no heading)',
    contentH: (bottom - top) / scale,
    contentW: (right - left) / scale,
    overTop: (box.top - top) / scale,
    overBottom: (bottom - box.bottom) / scale,
    minFontPx: text.length ? Math.min(...text) : null,
  };
})()`;

const COUNT = `document.querySelectorAll('.reveal .slides > section').length`;

const ws = new WebSocket(await targetUrl());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
const send = session(ws);
await send("Page.enable");

let broken = 0;
let tight = 0;
let checked = 0;

for (const url of urls) {
  // astromotion-export suppresses the first-run help card, which is a real
  // element over the first slide and would otherwise be measured as content.
  const sep = url.includes("?") ? "&" : "?";
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Page.navigate", { url: `${url}${sep}astromotion-export` });
  await sleep(1200);

  const name = url.replace(/\/$/, "").split("/").pop();
  const count = (await send("Runtime.evaluate", { returnByValue: true, expression: COUNT })).result
    .value;
  if (!count) {
    console.log(`NODECK    ${url}`);
    broken++;
    continue;
  }

  const slides = [];
  for (let i = 0; i < count; i++) {
    await send("Runtime.evaluate", { expression: `location.hash = '#/${i + 1}'` });
    await sleep(180);
    const { result } = await send("Runtime.evaluate", { returnByValue: true, expression: MEASURE });
    const s = result.value;
    if (!s || s.at !== i) {
      console.log(`STUCK     ${name} — asked for slide ${i}, reveal is showing ${s?.at ?? "none"}`);
      broken++;
      continue;
    }
    if (s.empty) {
      console.log(`BLANK     ${name} slide ${i} — nothing measurable on screen`);
      broken++;
      continue;
    }
    slides.push({ ...s, index: i });
  }
  if (slides.length === 0) continue;
  let worst = null;
  for (const s of slides) {
    checked++;
    const fill = s.contentH / CANVAS.height;
    if (!worst || fill > worst.fill) worst = { ...s, fill };
    const spills = s.overTop > 1 || s.overBottom > 1 || s.contentW > CANVAS.width + 1;
    if (spills) {
      broken++;
      console.log(
        `OVERFULL  ${name} slide ${s.index} "${s.heading}" — ` +
          `${Math.round(s.contentH)}px of content in a ${CANVAS.height}px canvas` +
          (s.overBottom > 1 ? `, ${Math.round(s.overBottom)}px past the bottom` : "") +
          (s.contentW > CANVAS.width + 1 ? `, ${Math.round(s.contentW - CANVAS.width)}px past the side` : ""),
      );
    } else if (fill > TIGHT) {
      tight++;
      console.log(
        `TIGHT     ${name} slide ${s.index} "${s.heading}" — ${Math.round(fill * 100)}% of the canvas height`,
      );
    }
  }
  const smallest = Math.min(...slides.map((s) => s.minFontPx ?? Infinity));
  console.log(
    `          ${name}: ${slides.length} slides, fullest ${Math.round(worst.fill * 100)}% ` +
      `("${worst.heading}"), smallest text ${isFinite(smallest) ? Math.round(smallest) : "—"}px on canvas ` +
      `(${isFinite(smallest) ? (smallest * (390 / CANVAS.width)).toFixed(1) : "—"}px at 390px wide)`,
  );
}

ws.close();
chrome.kill();
server?.kill();
console.log(
  `\n${checked} slides checked — ${broken} overfull, ${tight} tight (over ${TIGHT * 100}% of the canvas)`,
);
process.exit(broken === 0 ? 0 : 1);
