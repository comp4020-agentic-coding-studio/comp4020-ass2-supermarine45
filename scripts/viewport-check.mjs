#!/usr/bin/env node
// Screenshots a page at the two marking viewports and reports whether it
// overflows horizontally.
//
// Why this exists rather than `chrome --headless --window-size=390,844`:
// --window-size sets the *window*, not the layout viewport. Headless lays the
// page out wider and crops the image to the requested width, so every page
// looks broken at 390px whether or not it is. That artefact is convincing
// enough that it cost an hour before the live site, built from an untouched
// commit, reproduced it identically. Emulation.setDeviceMetricsOverride is
// what DevTools' device toolbar actually calls, and it sets the layout
// viewport, so what comes back is what a marker sees.
//
// Usage: node scripts/viewport-check.mjs <url> [<url>...]

import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333;
const VIEWPORTS = [
  { name: "desktop", width: 1920, height: 1080, mobile: false },
  { name: "phone", width: 390, height: 844, mobile: true },
];

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error("usage: node scripts/viewport-check.mjs <url> [<url>...]");
  process.exit(2);
}

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    `--remote-debugging-port=${PORT}`,
    "--no-first-run",
    "--user-data-dir=/tmp/.viewport-check-profile",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function targetUrl() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const targets = await res.json();
      const page = targets.find((t) => t.type === "page");
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

const ws = new WebSocket(await targetUrl());
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
const send = session(ws);
await send("Page.enable");

let failures = 0;

for (const url of urls) {
  const slug = url.replace(/https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  for (const vp of VIEWPORTS) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.mobile,
    });
    await send("Page.navigate", { url });
    await sleep(1400);

    const { result } = await send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const d = document.documentElement;
        const over = [...document.querySelectorAll('body *')]
          .filter(el => el.getBoundingClientRect().right > d.clientWidth + 1)
          .slice(0, 5)
          .map(el => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).join('.') : ''));
        return { scrollWidth: d.scrollWidth, clientWidth: d.clientWidth, offenders: over };
      })()`,
    });
    const { scrollWidth, clientWidth, offenders } = result.value;
    const overflow = scrollWidth > clientWidth + 1;
    if (overflow) failures++;
    const mark = overflow ? "OVERFLOW" : "ok";
    console.log(
      `${mark.padEnd(9)} ${vp.name.padEnd(8)} ${clientWidth}px viewport, ${scrollWidth}px content  ${url}`,
    );
    if (overflow && offenders.length) console.log(`          widest: ${offenders.join(", ")}`);

    const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
    writeFileSync(`/tmp/vp-${slug}-${vp.name}.png`, Buffer.from(shot.data, "base64"));
  }
}

ws.close();
chrome.kill();
console.log(failures === 0 ? "\nno horizontal overflow at either viewport" : `\n${failures} overflowing`);
process.exit(failures === 0 ? 0 : 1);
