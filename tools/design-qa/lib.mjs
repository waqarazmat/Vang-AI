// Shared helpers for the VangAI design QA tools.
// The design export renders client-side (support.js), so it is served over a local
// HTTP server and given time to boot, translate and settle before capture.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '../..');
export const DESIGN_DIR = path.join(ROOT, 'Website Design');
export const OUT_DIR = path.join(HERE, 'out');

export const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 820, height: 1180 },
  desktop: { width: 1440, height: 900 },
};
export const LANGS = ['en', 'nl', 'fr'];

// Freezes everything that moves so two captures of the same state are identical.
// Applied identically to design and build, so it never hides a real difference.
const FREEZE_CSS = `
*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
html{scroll-behavior:auto!important}
`;

export function parseArgs(argv = process.argv.slice(2)) {
  const a = {
    page: 'all',
    vp: 'all',
    lang: 'en',
    build: process.env.BUILD_URL || 'http://localhost:3000',
    self: false,
    threshold: 0,
  };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--self') a.self = true;
    // Git Bash on Windows rewrites arguments starting with / into paths; undo that.
    else if (k.startsWith('--'))
      a[k.slice(2)] = String(argv[++i]).replace(/^[A-Za-z]:\/Program Files\/Git(\/.*)$/, '$1');
  }
  a.threshold = Number(a.threshold);
  return a;
}

export function loadPages() {
  const all = JSON.parse(fs.readFileSync(path.join(HERE, 'pages.json'), 'utf8'));
  delete all._note;
  return all;
}

// CSS corrections for known export bugs, applied to the design side only.
export function designFixes(pageKey) {
  const { fixes } = JSON.parse(fs.readFileSync(path.join(HERE, 'design-fixes.json'), 'utf8'));
  // QA_ONLY_FIXES=id1,id2 limits which fixes apply (diagnostics only).
  const only = process.env.QA_ONLY_FIXES ? process.env.QA_ONLY_FIXES.split(',') : null;
  return fixes.filter((f) => (f.pages.includes('*') || f.pages.includes(pageKey)) && (!only || only.includes(f.id)));
}

export function select(list, want) {
  if (!want || want === 'all') return list;
  const w = String(want).split(',');
  const bad = w.filter((x) => !list.includes(x));
  if (bad.length) throw new Error(`Unknown: ${bad.join(', ')}. Options: ${list.join(', ')}`);
  return w;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.css': 'text/css',
};

export async function serveDesign() {
  const server = http.createServer((req, res) => {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const f = path.join(DESIGN_DIR, p);
    if (!f.startsWith(DESIGN_DIR) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
      res.writeHead(404);
      return res.end();
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return { url: `http://127.0.0.1:${server.address().port}`, close: () => server.close() };
}

export async function launch() {
  // Prefer the installed Chrome so no browser download is needed.
  try {
    return await chromium.launch({ channel: 'chrome' });
  } catch {
    return await chromium.launch();
  }
}

export function designUrl(server, page) {
  return `${server.url}/${encodeURIComponent(page.design)}`;
}

export function buildUrl(base, page, lang) {
  return base.replace(/\/$/, '') + page.route.replace('{lang}', lang);
}

// Installs window.__qaNormColor in the page: rewrites every oklab(...) and color(srgb ...)
// inside a computed style string as rgba(r, g, b, a). Tailwind 4 writes opacity modifiers as
// color-mix(in oklab, ...), which Chrome reports as oklab() although the painted pixel equals
// the design's rgba(). Comparing normalised values compares the actual colours.
function installColorNormalizer() {
  const enc = (v) => {
    const c = Math.max(0, Math.min(1, v));
    return Math.round(255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055));
  };
  const alpha = (a) => (a === undefined ? 1 : +(+a).toFixed(3));
  const rgba = (r, g, b, a) =>
    `rgba(${r}, ${g}, ${b}, ${alpha(a)})`.replace(/, 1\)$/, ')').replace(/^rgba\((\d+, \d+, \d+)\)$/, 'rgb($1)');
  window.__qaNormColor = (s) =>
    typeof s !== 'string'
      ? s
      : s
          .replace(/oklab\(([-\d.e]+) ([-\d.e]+) ([-\d.e]+)(?: \/ ([\d.e]+))?\)/g, (_, L, A, B, a) => {
            [L, A, B] = [+L, +A, +B];
            const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
            const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
            const q = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
            return rgba(
              enc(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * q),
              enc(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * q),
              enc(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * q),
              a,
            );
          })
          .replace(/color\(srgb ([-\d.e]+) ([-\d.e]+) ([-\d.e]+)(?: \/ ([\d.e]+))?\)/g, (_, r, g, b, a) =>
            rgba(...[r, g, b].map((v) => Math.round(255 * Math.max(0, Math.min(1, +v)))), a),
          );
}

// Opens a page in a deterministic state: fixed viewport, DPR 1, reduced motion,
// fonts loaded, language set, animations frozen.
export async function openPage(browser, url, { viewport, lang, isDesign, pageKey, injectCss }) {
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    locale: lang === 'nl' ? 'nl-BE' : lang === 'fr' ? 'fr-BE' : 'en-US',
    timezoneId: 'Europe/Brussels',
  });
  await ctx.addInitScript((l) => {
    try {
      localStorage.setItem('vang-lang', l);
    } catch {}
  }, lang);
  await ctx.addInitScript(installColorNormalizer);
  const page = await ctx.newPage();
  // Fixed wall clock (timers still run) so chat timestamps and the contact calendar match.
  await page.clock.setFixedTime(new Date('2026-09-24T10:00:00+02:00'));
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  // Background prefetches can keep a request open; idle is best effort, settle() decides.
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  // The design's i18n re-applies for ~5s after boot; wait it out, then wait until
  // the page stops changing (text, size, layout) for a full second.
  await page.waitForTimeout(isDesign ? 5600 : 800);
  if (isDesign) {
    // The design runtime sometimes drops the garage engine's first state update on load
    // (the counter then shows the wrong label). Its engine re-renders on 'vang-lang'.
    await page.evaluate(() => window.dispatchEvent(new Event('vang-lang')));
    // The design's i18n script re-applies stored text for 5s after boot and can revert the
    // garage counter label after the engine changed it, leaving "0" + coral styling next to
    // the pre-VangAI label. Restore the label that belongs to the counter's current state.
    await page.evaluate(() => {
      const label = [...document.querySelectorAll('span')].find(
        (el) => /Missed customers/i.test(el.textContent || '') && el.parentElement?.children.length === 2,
      );
      if (!label) return;
      const fixed = getComputedStyle(label.parentElement).backgroundColor.includes('216, 90, 48');
      const en = fixed ? 'Missed customers with VangAI' : 'Missed customers';
      label.textContent = window.VangT ? window.VangT(en) : en;
    });
  }
  await settle(page);
  await page.addStyleTag({ content: FREEZE_CSS });
  if (isDesign && pageKey) {
    for (const f of designFixes(pageKey)) {
      // `js` only tags elements (the design has no class names); `css` does the styling.
      if (f.js) await page.evaluate(f.js);
      if (f.css) await page.addStyleTag({ content: f.css });
    }
  }
  // Test-only: deliberate mistakes on the build side, to prove the tools catch them.
  if (injectCss) await page.addStyleTag({ content: injectCss });
  await page.mouse.move(0, 0);
  await settle(page);
  return { ctx, page, errors };
}

// Resolves once body text and document size have been stable for `quietMs`.
export async function settle(page, { quietMs = 1000, maxMs = 15000 } = {}) {
  const snap = () =>
    page.evaluate(() => {
      const b = document.body;
      return `${b.scrollHeight}x${b.scrollWidth}|${b.innerText.length}|${b.innerText.slice(0, 20000)}`;
    });
  const start = Date.now();
  let last = await snap(),
    since = Date.now();
  while (Date.now() - start < maxMs) {
    await page.waitForTimeout(200);
    const now = await snap();
    if (now !== last) {
      last = now;
      since = Date.now();
    } else if (Date.now() - since >= quietMs) return true;
  }
  return false;
}

export async function shot(page, file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
  return PNG.sync.read(fs.readFileSync(file));
}

function crop(png, w, h) {
  const out = new PNG({ width: w, height: h });
  PNG.bitblt(png, out, 0, 0, w, h, 0, 0);
  return out;
}

// Compares two screenshots. Returns mismatch stats and the vertical bands that differ.
// threshold 0.02 (pixelmatch YIQ distance) flags even small colour shifts such as
// #D85A30 vs #E0602F; a cell counts as different once it has `cellMin` changed pixels.
export function comparePngs(a, b, diffFile, { cell = 24, cellMin = 3, threshold = 0.02 } = {}) {
  const w = Math.min(a.width, b.width);
  const h = Math.min(a.height, b.height);
  const A = crop(a, w, h),
    B = crop(b, w, h);
  const diff = new PNG({ width: w, height: h });
  const n = pixelmatch(A.data, B.data, diff.data, w, h, { threshold, includeAA: false, alpha: 0.2 });
  fs.writeFileSync(diffFile, PNG.sync.write(diff));

  // Grid the diff to find where differences cluster, then merge into vertical bands.
  const rows = [];
  for (let y0 = 0; y0 < h; y0 += cell) {
    let hot = 0,
      minX = Infinity,
      maxX = -1;
    for (let x0 = 0; x0 < w; x0 += cell) {
      let c = 0;
      for (let y = y0; y < Math.min(y0 + cell, h); y++) {
        for (let x = x0; x < Math.min(x0 + cell, w); x++) {
          const i = (y * w + x) * 4;
          if (diff.data[i] > 200 && diff.data[i + 1] < 100) c++; // pixelmatch paints diffs red
        }
      }
      if (c >= cellMin) {
        hot++;
        minX = Math.min(minX, x0);
        maxX = Math.max(maxX, x0 + cell);
      }
    }
    rows.push(hot ? { y: y0, minX, maxX } : null);
  }
  const bands = [];
  for (const r of rows) {
    if (!r) continue;
    const last = bands[bands.length - 1];
    if (last && r.y - last.y1 <= cell) {
      last.y1 = r.y + cell;
      last.x0 = Math.min(last.x0, r.minX);
      last.x1 = Math.max(last.x1, r.maxX);
    } else bands.push({ y0: r.y, y1: r.y + cell, x0: r.minX, x1: r.maxX });
  }
  return {
    width: w,
    compareHeight: h,
    heightA: a.height,
    heightB: b.height,
    widthA: a.width,
    widthB: b.width,
    diffPixels: n,
    diffPct: +((100 * n) / (w * h)).toFixed(4),
    bands,
  };
}

// Section headings with their document y, used to name where a diff band is.
export async function landmarks(page) {
  return page.evaluate(() => {
    const out = [];
    document.querySelectorAll('h1,h2,h3,footer,[id]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.height) return;
      const label =
        el.tagName === 'FOOTER'
          ? 'footer'
          : /^H[1-3]$/.test(el.tagName)
            ? el.textContent.replace(/\s+/g, ' ').trim().slice(0, 60)
            : '#' + el.id;
      if (label) out.push({ y: Math.round(r.top + scrollY), label });
    });
    return out.sort((a, b) => a.y - b.y);
  });
}

// Keeps the top `h` pixels of a screenshot (shorter images are kept whole, so a
// build that is too short still shows up as a height difference).
export function cropTop(png, h) {
  const height = Math.min(h, png.height);
  const out = new PNG({ width: png.width, height });
  PNG.bitblt(png, out, 0, 0, png.width, height, 0, 0);
  return out;
}

// Document y of the first visible element whose own text equals `text` ("re:" = regex).
export async function findTextY(page, text) {
  return page.evaluate((t) => {
    const re = t.startsWith('re:') ? new RegExp(t.slice(3)) : null;
    const norm = (s) => s.replace(/\s+/g, ' ').trim();
    for (const el of document.querySelectorAll('body *')) {
      const own = norm(
        [...el.childNodes]
          .filter((n) => n.nodeType === 3)
          .map((n) => n.data)
          .join(' '),
      );
      if (!own || !(re ? re.test(own) : own === norm(t))) continue;
      const r = el.getBoundingClientRect();
      if (r.width && r.height) return Math.floor(r.top + scrollY);
    }
    return null;
  }, text);
}

// Visible raster images (<img>, SVG <image>) with their file name and document box.
export async function imageBoxes(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('img, image')]
      .map((el) => {
        const r = el.getBoundingClientRect();
        const src = (el.getAttribute('src') || el.getAttribute('href') || '').split('/').pop();
        return { src, x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
      })
      .filter((b) => b.w > 0 && b.h > 0),
  );
}

// Chrome's image scaler smooths the edges of a downscaled image slightly differently
// depending on the rest of the page (verified: even a blank page differs from both sides).
// So images are verified by what and where: same file, same box (within 0.02px). Verified
// boxes are blanked on both screenshots; anything missing, moved or resized still fails.
export function maskMatchedImages(dPng, bPng, dBoxes, bBoxes) {
  const used = new Set();
  let matched = 0;
  const unmatched = [];
  for (const d of dBoxes) {
    const i = bBoxes.findIndex(
      (b, j) =>
        !used.has(j) &&
        b.src === d.src &&
        Math.abs(b.x - d.x) <= 0.02 &&
        Math.abs(b.y - d.y) <= 0.02 &&
        Math.abs(b.w - d.w) <= 0.02 &&
        Math.abs(b.h - d.h) <= 0.02,
    );
    if (i < 0) {
      unmatched.push(d);
      continue;
    }
    used.add(i);
    matched++;
    for (const png of [dPng, bPng]) {
      const x0 = Math.max(0, Math.floor(d.x) - 1),
        y0 = Math.max(0, Math.floor(d.y) - 1);
      const x1 = Math.min(png.width, Math.ceil(d.x + d.w) + 1),
        y1 = Math.min(png.height, Math.ceil(d.y + d.h) + 1);
      for (let y = y0; y < y1; y++)
        for (let x = x0; x < x1; x++) {
          const k = (y * png.width + x) * 4;
          png.data[k] = 255;
          png.data[k + 1] = 0;
          png.data[k + 2] = 255;
          png.data[k + 3] = 255;
        }
    }
  }
  return { matched, unmatched };
}

export function nameBand(marks, y) {
  let best = 'top of page';
  for (const m of marks) if (m.y <= y + 40) best = m.label;
  return best;
}

export function outPath(...p) {
  const f = path.join(OUT_DIR, ...p);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  return f;
}
