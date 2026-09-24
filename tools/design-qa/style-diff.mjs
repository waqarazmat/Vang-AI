// Element-by-element computed-style comparison of design vs build, including hover states.
// Elements are paired by their visible text (and aria-label/placeholder for controls),
// in document order. Reports: style mismatches, size mismatches, where layout drift starts,
// copy missing from or added to the build, and hover-state mismatches for buttons and links.
// Usage: node style-diff.mjs [--page home|all] [--vp desktop|all] [--lang en] [--build URL] [--self] [--hover 80]
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
  designFixes,
} from './lib.mjs';
import { collectElements } from './collect.mjs';

const args = parseArgs();
const hoverLimit = Number(args.hover ?? 80);
const pages = loadPages();
const pageKeys = select(Object.keys(pages), args.page);
const vps = select(Object.keys(VIEWPORTS), args.vp);
const lang = args.lang;

const TOL = { fontSize: 0.25, lineHeight: 0.5, letterSpacing: 0.05, px: 0.5 };
const PX_PROPS = [
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
];
const HOVER_PROPS = [
  'color',
  'backgroundColor',
  'borderTopColor',
  'boxShadow',
  'textDecorationLine',
  'transform',
  'opacity',
];

// next/font renames families to e.g. "__Archivo_1a2b3c" and adds "__Archivo_Fallback_...".
const family = (f) =>
  f
    .split(',')[0]
    .replace(/["']/g, '')
    .trim()
    .replace(/^__/, '')
    .replace(/_Fallback.*$/, '')
    .replace(/_[0-9a-f]{5,}$/i, '')
    .replace(/_/g, ' ')
    .toLowerCase();
const color = (c) => (c || '').replace(/rgb\(([^)]+)\)/g, 'rgba($1, 1)').replace(/\s+/g, '');
const num = (v) => (v === 'normal' ? null : parseFloat(v));

function diffStyle(a, b) {
  const out = [];
  const push = (prop, da, db) => out.push({ prop, design: da, build: db });
  if (family(a.fontFamily) !== family(b.fontFamily)) push('fontFamily', a.fontFamily, b.fontFamily);
  if (Math.abs(num(a.fontSize) - num(b.fontSize)) > TOL.fontSize) push('fontSize', a.fontSize, b.fontSize);
  for (const p of ['fontWeight', 'fontStyle', 'textTransform', 'textAlign', 'textDecorationLine', 'cursor'])
    if (a[p] !== b[p]) push(p, a[p], b[p]);
  const lhA = num(a.lineHeight),
    lhB = num(b.lineHeight);
  if (lhA === null || lhB === null ? a.lineHeight !== b.lineHeight : Math.abs(lhA - lhB) > TOL.lineHeight)
    push('lineHeight', a.lineHeight, b.lineHeight);
  const lsA = num(a.letterSpacing) ?? 0,
    lsB = num(b.letterSpacing) ?? 0;
  if (Math.abs(lsA - lsB) > TOL.letterSpacing) push('letterSpacing', a.letterSpacing, b.letterSpacing);
  for (const p of [
    'color',
    'backgroundColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'backgroundImage',
    'boxShadow',
  ]) {
    if (color(a[p]) !== color(b[p])) push(p, a[p], b[p]);
  }
  if (Math.abs(parseFloat(a.opacity) - parseFloat(b.opacity)) > 0.01) push('opacity', a.opacity, b.opacity);
  for (const p of PX_PROPS) if (Math.abs(num(a[p]) - num(b[p])) > TOL.px) push(p, a[p], b[p]);
  return out;
}

function pair(dEls, bEls) {
  const byKey = new Map();
  for (const e of bEls) {
    if (!byKey.has(e.key)) byKey.set(e.key, []);
    byKey.get(e.key).push(e);
  }
  const pairs = [],
    missing = [];
  const used = new Set();
  for (const d of dEls) {
    const list = byKey.get(d.key);
    const b = list && list.shift();
    if (b) {
      pairs.push([d, b]);
      used.add(b.idx);
    } else missing.push(d);
  }
  const extra = bEls.filter((b) => !used.has(b.idx));
  return { pairs, missing, extra };
}

async function hoverStyles(page, idxs) {
  const res = {};
  for (const i of idxs) {
    try {
      await page.hover(`[data-qa-idx="${i}"]`, { timeout: 1500, force: true });
      await page.waitForTimeout(60);
      res[i] = await page.$eval(
        `[data-qa-idx="${i}"]`,
        (el, props) => {
          const cs = getComputedStyle(el);
          const o = {};
          for (const p of props) o[p] = cs[p];
          return o;
        },
        HOVER_PROPS,
      );
    } catch {
      res[i] = null;
    }
  }
  await page.mouse.move(0, 0);
  return res;
}

const server = await serveDesign();
const browser = await launch();
const report = [];
const issueCount = (r) =>
  r.error
    ? 1
    : r.missingInBuild.length +
      r.extraInBuild.length +
      r.styleDiffs.length +
      r.sizeDiffs.length +
      r.driftStarts.length +
      r.hoverDiffs.length;

async function compareOnce(key, pg, vp) {
  const viewport = VIEWPORTS[vp];
  const dUrl = designUrl(server, pg);
  const bUrl = args.self ? dUrl : buildUrl(args.build, pg, lang);
  const d = await openPage(browser, dUrl, { viewport, lang, isDesign: true, pageKey: key });
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
    await d.ctx.close();
    return { page: key, vp, lang, error: `Build page failed to load: ${bUrl}` };
  }
  const dEls = await d.page.evaluate(collectElements);
  const bEls = await b.page.evaluate(collectElements);
  const { pairs, missing, extra } = pair(dEls, bEls);

  const styleDiffs = [],
    sizeDiffs = [],
    driftStarts = [];
  // Drift is tracked per column (x bucket) so side-by-side columns do not look like jitter.
  const lastDrift = new Map();
  for (const [de, be] of pairs.sort((x, y) => x[0].rect.y - y[0].rect.y)) {
    const s = diffStyle(de.style, be.style);
    if (s.length) styleDiffs.push({ text: de.text, tag: `${de.tag} → ${be.tag}`, y: de.rect.y, diffs: s });
    if (
      Math.abs(de.rect.w - be.rect.w) > 1.5 ||
      Math.abs(de.rect.h - be.rect.h) > 1.5 ||
      Math.abs(de.rect.x - be.rect.x) > 2
    ) {
      sizeDiffs.push({ text: de.text, design: de.rect, build: be.rect });
    }
    const drift = be.rect.y - de.rect.y;
    const col = Math.round(de.rect.x / 160);
    const before = lastDrift.get(col) ?? 0;
    if (Math.abs(drift - before) > 3)
      driftStarts.push({
        text: de.text,
        designY: de.rect.y,
        buildY: be.rect.y,
        driftBefore: before,
        driftAfter: drift,
      });
    lastDrift.set(col, drift);
  }

  // Hover states of paired interactive elements.
  const hoverPairs = pairs.filter(([de]) => de.interactive).slice(0, hoverLimit);
  const dHover = await hoverStyles(
    d.page,
    hoverPairs.map(([de]) => de.idx),
  );
  const bHover = await hoverStyles(
    b.page,
    hoverPairs.map(([, be]) => be.idx),
  );
  const hoverDiffs = [];
  for (const [de, be] of hoverPairs) {
    const hd = dHover[de.idx],
      hb = bHover[be.idx];
    if (!hd || !hb) {
      hoverDiffs.push({ text: de.text, note: 'could not hover on one side' });
      continue;
    }
    const diffs = HOVER_PROPS.filter((p) => color(hd[p]) !== color(hb[p])).map((p) => ({
      prop: p,
      design: hd[p],
      build: hb[p],
    }));
    if (diffs.length) hoverDiffs.push({ text: de.text, diffs });
  }

  await d.ctx.close();
  await b.ctx.close();
  return {
    page: key,
    vp,
    lang,
    url: bUrl,
    counts: { design: dEls.length, build: bEls.length, paired: pairs.length, hoverChecked: hoverPairs.length },
    missingInBuild: missing.map((m) => ({ text: m.text, tag: m.tag, y: m.rect.y })),
    extraInBuild: extra.map((m) => ({ text: m.text, tag: m.tag, y: m.rect.y })),
    styleDiffs,
    sizeDiffs,
    driftStarts,
    hoverDiffs,
  };
}

try {
  for (const key of pageKeys) {
    const pg = pages[key];
    for (const vp of vps) {
      // Some design widgets settle a moment late on occasional loads. Real differences
      // reproduce on every run, so a failing comparison is repeated before it is reported.
      const retries = Number(args.retries ?? 2);
      const earlier = [];
      let r;
      for (let attempt = 1; attempt <= retries + 1; attempt++) {
        r = await compareOnce(key, pg, vp);
        r.attempts = attempt;
        if (r.error || issueCount(r) === 0) break;
        earlier.push(issueCount(r));
      }
      r.flaky = !r.error && issueCount(r) === 0 && earlier.length > 0;
      r.earlierIssueCounts = earlier;
      report.push(r);
    }
  }
} finally {
  await browser.close();
  server.close();
}

fs.writeFileSync(outPath('style-report.json'), JSON.stringify(report, null, 2));
let failures = 0;
for (const r of report) {
  if (r.error) {
    failures++;
    console.log(`ERROR ${r.page} ${r.vp}: ${r.error}`);
    continue;
  }
  const n = issueCount(r);
  if (n) failures++;
  const note = r.flaky
    ? `  (unsettled on attempt 1, clean on attempt ${r.attempts})`
    : n
      ? `  (reproduced on all ${r.attempts} runs)`
      : '';
  console.log(
    `${n ? 'FAIL' : 'PASS'} ${r.page} ${r.vp} ${r.lang}  paired ${r.counts.paired}/${r.counts.design}  missing ${r.missingInBuild.length}  extra ${r.extraInBuild.length}  style ${r.styleDiffs.length}  size ${r.sizeDiffs.length}  drift ${r.driftStarts.length}  hover ${r.hoverDiffs.length}/${r.counts.hoverChecked}${note}`,
  );
  for (const s of r.styleDiffs.slice(0, 8))
    console.log(
      `   style "${s.text.slice(0, 40)}": ${s.diffs.map((x) => `${x.prop} ${x.design} ≠ ${x.build}`).join('; ')}`,
    );
  for (const s of r.driftStarts.slice(0, 5))
    console.log(`   layout drift starts at "${s.text.slice(0, 40)}" (${s.driftBefore}px → ${s.driftAfter}px)`);
  for (const s of r.missingInBuild.slice(0, 5)) console.log(`   missing: "${s.text.slice(0, 60)}"`);
}
const applied = [...new Set(pageKeys.flatMap((k) => designFixes(k).map((f) => f.id)))];
if (applied.length) console.log(`\nDesign fixes applied (see design-fixes.json): ${applied.join(', ')}`);
console.log(
  `\nSTYLE: ${failures ? `FAIL (${failures}/${report.length})` : `PASS (${report.length})`}  report: ${outPath('style-report.json')}`,
);
process.exit(failures ? 1 : 0);
