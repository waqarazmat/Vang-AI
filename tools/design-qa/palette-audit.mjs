// Brand colour and contrast audit.
// 1. Palette: every colour the build paints (text, backgrounds, borders, SVG fill/stroke,
//    gradients, shadows) must also appear in the design or in the brand core palette.
//    Colours within a small distance of an allowed one are reported as "near miss"
//    (almost always a wrong token or a typo in a hex value).
// 2. Contrast: text pairs are checked against the brand rules: small text needs 4.5:1,
//    white on coral is approved for large text only.
// Usage: node palette-audit.mjs [--page all] [--vp all] [--lang en] [--build URL] [--self]
import fs from 'node:fs';
import {
  parseArgs,
  loadPages,
  select,
  VIEWPORTS,
  serveDesign,
  launch,
  designUrl,
  buildUrl,
  openPage,
  outPath,
} from './lib.mjs';
import { collectColors, collectContrast } from './collect.mjs';

// Brand guide core palette (GenAITech_Brand_Guide.docx, Vangst_Brand_System.pptx, VangAI Brand Guide).
const BRAND = { coral: '#D85A30', amber: '#854F0B', cream: '#FAEEDA', dark: '#2B2118', white: '#FFFFFF' };

const args = parseArgs();
const pages = loadPages();
const pageKeys = select(Object.keys(pages), args.page);
const vps = select(Object.keys(VIEWPORTS), args.vp);
const lang = args.lang;

const rgba = (c) => {
  if (c.startsWith('#')) {
    const h = c.slice(1);
    const v = h.length === 3 ? h.split('').map((x) => x + x) : h.match(/../g);
    return [...v.slice(0, 3).map((x) => parseInt(x, 16)), v[3] ? parseInt(v[3], 16) / 255 : 1];
  }
  const m = (c.match(/[\d.]+/g) || []).map(Number);
  if (!/^rgba?\(/.test(c) || m.length < 3) return null; // e.g. currentcolor, color(), oklab()
  return [m[0], m[1], m[2], m[3] ?? 1];
};
const keyOf = (c) => {
  const v = rgba(c);
  return v ? v.map((x, i) => (i === 3 ? +x.toFixed(2) : Math.round(x))).join(',') : c;
};
const hex = (k) => {
  if (!/^\d/.test(k)) return k;
  const [r, g, b, a] = k.split(',').map(Number);
  return (
    '#' +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase() +
    (a < 1 ? ` @${a}` : '')
  );
};
const dist = (a, b) => {
  if (!/^\d/.test(a) || !/^\d/.test(b)) return a === b ? 0 : Infinity;
  const x = a.split(',').map(Number),
    y = b.split(',').map(Number);
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) + 100 * Math.abs(x[3] - y[3]);
};

const server = await serveDesign();
const browser = await launch();
const designColors = new Map();
const buildColors = new Map();
const contrast = [];
try {
  for (const key of pageKeys) {
    const pg = pages[key];
    for (const vp of vps) {
      const viewport = VIEWPORTS[vp];
      const d = await openPage(browser, designUrl(server, pg), { viewport, lang, isDesign: true, pageKey: key });
      for (const [c, v] of Object.entries(await d.page.evaluate(collectColors))) designColors.set(keyOf(c), v);
      await d.ctx.close();

      const bUrl = args.self ? designUrl(server, pg) : buildUrl(args.build, pg, lang);
      let b;
      try {
        b = await openPage(browser, bUrl, {
          viewport,
          lang,
          isDesign: args.self,
          pageKey: args.self ? key : undefined,
          injectCss: args.inject,
        });
      } catch {
        console.log(`ERROR build page failed to load: ${bUrl}`);
        continue;
      }
      for (const [c, v] of Object.entries(await b.page.evaluate(collectColors))) {
        const k = keyOf(c);
        const prev = buildColors.get(k) || { count: 0, examples: [], where: new Set() };
        prev.count += v.count;
        prev.examples.push(...v.examples.slice(0, 2));
        prev.where.add(`${key}/${vp}`);
        buildColors.set(k, prev);
      }
      for (const t of await b.page.evaluate(collectContrast)) contrast.push({ page: key, vp, ...t });
      await b.ctx.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}

const allowed = new Set([...designColors.keys(), ...Object.values(BRAND).map(keyOf)]);
const offPalette = [],
  nearMiss = [];
for (const [k, v] of buildColors) {
  if (allowed.has(k)) continue;
  let best = null,
    bd = Infinity;
  for (const a of allowed) {
    const dd = dist(k, a);
    if (dd < bd) {
      bd = dd;
      best = a;
    }
  }
  const item = {
    color: hex(k),
    closestAllowed: hex(best),
    distance: +bd.toFixed(1),
    count: v.count,
    where: [...v.where],
    examples: v.examples.slice(0, 4),
  };
  (bd <= 12 ? nearMiss : offPalette).push(item);
}
const coral = keyOf(BRAND.coral).split(',').slice(0, 3).join(',');
// Pairs the user has accepted as designed (design-fixes.json "accepted"): reported separately, not as issues.
const acceptedBgs = (
  JSON.parse(fs.readFileSync(new URL('./design-fixes.json', import.meta.url), 'utf8')).accepted || []
).map((a) => ({ id: a.id, key: (a.background.match(/\d+/g) || []).slice(0, 3).join(',') }));
const accepted = {};
const contrastIssues = [];
const seen = new Set();
for (const c of contrast) {
  const bgKey = c.bg.match(/\d+/g).join(',');
  const acc = acceptedBgs.find((a) => a.key === bgKey);
  if (acc) {
    accepted[acc.id] = (accepted[acc.id] || 0) + 1;
    continue;
  }
  const whiteOnCoral = bgKey === coral && /rgba?\(255, 255, 255/.test(c.fg);
  const min = c.large ? 3 : 4.5;
  let problem = null;
  if (whiteOnCoral && !c.large) problem = 'white on coral is approved for large text only (brand guide)';
  else if (c.ratio < min) problem = `contrast ${c.ratio}:1 below ${min}:1`;
  const id = `${c.text}|${c.fg}|${c.bg}`;
  if (problem && !seen.has(id)) {
    seen.add(id);
    contrastIssues.push({ ...c, problem });
  }
}

const report = {
  designPaletteSize: designColors.size,
  buildPaletteSize: buildColors.size,
  offPalette,
  nearMiss,
  contrastIssues,
};
fs.writeFileSync(outPath('palette-report.json'), JSON.stringify(report, null, 2));
console.log(`Design uses ${designColors.size} distinct colours, build uses ${buildColors.size}.`);
console.log(`Near misses (almost a brand/design colour, likely wrong value): ${nearMiss.length}`);
for (const n of nearMiss.slice(0, 15))
  console.log(`   ${n.color} ≈ ${n.closestAllowed} (distance ${n.distance}) e.g. ${n.examples[0]}`);
console.log(`Off-palette colours (not in design or brand guide): ${offPalette.length}`);
for (const n of offPalette.slice(0, 15))
  console.log(`   ${n.color} (closest ${n.closestAllowed}) e.g. ${n.examples[0]}`);
for (const [id, n] of Object.entries(accepted)) console.log(`Accepted as designed (${id}): ${n} text elements`);
console.log(`Contrast issues: ${contrastIssues.length}`);
for (const c of contrastIssues.slice(0, 15))
  console.log(
    `   ${c.page}/${c.vp} "${c.text.slice(0, 40)}" ${c.fg} on ${c.bg}, ${c.size}px/${c.weight}: ${c.problem}`,
  );
const fail = nearMiss.length + offPalette.length;
console.log(
  `\nPALETTE: ${fail ? `FAIL (${fail} colours)` : 'PASS'}  CONTRAST: ${contrastIssues.length ? `WARN (${contrastIssues.length}, compare with design before changing)` : 'PASS'}  report: ${outPath('palette-report.json')}`,
);
process.exit(fail ? 1 : 0);
