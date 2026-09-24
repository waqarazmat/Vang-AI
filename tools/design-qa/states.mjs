// Interaction-state comparison: runs the scripted steps from pages.json (hover/click by
// visible text) on design and build, then pixel-compares the viewport in that state.
// Covers dropdowns, tabs, accordions, reveal toggles and the scripted demo replies.
// Step forms: { "hover": "Text" } | { "click": "Text", "nth": 0 } | { "wait": ms }
// Text starting with "re:" is a regular expression, e.g. "re:^Product".
// Usage: node states.mjs [--page home|all] [--vp all] [--lang en] [--build URL] [--self] [--state name]
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
  comparePngs,
  settle,
} from './lib.mjs';
import { PNG } from 'pngjs';

const args = parseArgs();
const pages = loadPages();
const pageKeys = select(Object.keys(pages), args.page);
const vps = select(Object.keys(VIEWPORTS), args.vp);
const lang = args.lang;

const target = (page, text, nth = 0) => {
  const m = text.startsWith('re:') ? new RegExp(text.slice(3)) : text;
  return page
    .getByText(m, { exact: !text.startsWith('re:') })
    .filter({ visible: true })
    .nth(nth);
};

async function runSteps(page, steps) {
  for (const s of steps) {
    if (s.wait) {
      await page.waitForTimeout(s.wait);
      continue;
    }
    const loc = target(page, s.hover ?? s.click, s.nth ?? 0);
    if (s.hover) await loc.hover({ timeout: 5000 });
    else await loc.click({ timeout: 5000 });
    await page.waitForTimeout(120);
  }
  await settle(page, { quietMs: 600, maxMs: 6000 });
}

async function capture(page, file) {
  const buf = await page.screenshot({ path: file, animations: 'disabled' });
  return PNG.sync.read(buf);
}

const server = await serveDesign();
const browser = await launch();
const results = [];
try {
  for (const key of pageKeys) {
    const pg = pages[key];
    const states = (pg.states || []).filter((s) => !args.state || s.name === args.state);
    for (const st of states) {
      for (const vp of vps.filter((v) => !st.vp || st.vp.includes(v))) {
        const viewport = VIEWPORTS[vp];
        const dir = [lang, key, vp, 'states'];
        // Re-capture a failing state (render noise does not reproduce, real diffs do).
        for (let attempt = 1; attempt <= 1 + Number(args.retries ?? 2); attempt++) {
          const run = async (url, isDesign, inject) => {
            const o = await openPage(browser, url, {
              viewport,
              lang,
              isDesign,
              pageKey: isDesign ? key : undefined,
              injectCss: inject,
            });
            try {
              await runSteps(o.page, st.steps);
            } catch (e) {
              await o.ctx.close();
              throw e;
            }
            return o;
          };
          let d, b;
          try {
            d = await run(designUrl(server, pg), true);
          } catch (e) {
            results.push({ page: key, vp, state: st.name, error: `design step failed: ${e.message.split('\n')[0]}` });
            break;
          }
          const dPng = await capture(d.page, outPath(...dir, `${st.name}.design.png`));
          await d.ctx.close();
          const bUrl = args.self ? designUrl(server, pg) : buildUrl(args.build, pg, lang);
          try {
            b = await run(bUrl, args.self, args.inject);
          } catch (e) {
            results.push({
              page: key,
              vp,
              state: st.name,
              error: `build step failed (element missing or not interactive?): ${e.message.split('\n')[0]}`,
            });
            break;
          }
          const bPng = await capture(b.page, outPath(...dir, `${st.name}.build.png`));
          await b.ctx.close();
          const cmp = comparePngs(dPng, bPng, outPath(...dir, `${st.name}.diff.png`));
          const pass = cmp.bands.length === 0;
          if (pass || attempt > Number(args.retries ?? 2)) {
            results.push({
              page: key,
              vp,
              state: st.name,
              pass,
              attempts: attempt,
              diffPct: cmp.diffPct,
              bands: cmp.bands,
              files: outPath(...dir),
            });
            break;
          }
        }
      }
    }
  }
} finally {
  await browser.close();
  server.close();
}

fs.writeFileSync(outPath('states-report.json'), JSON.stringify(results, null, 2));
for (const r of results) {
  if (r.error) {
    console.log(`ERROR ${r.page} ${r.vp} [${r.state}]: ${r.error}`);
    continue;
  }
  console.log(
    `${r.pass ? 'PASS' : 'FAIL'} ${r.page} ${r.vp} [${r.state}] diff ${r.diffPct}%${r.bands.length ? `  ${r.bands.length} diff regions, first at y ${r.bands[0].y0}` : ''}`,
  );
}
const failed = results.filter((r) => r.error || !r.pass).length;
console.log(
  `\nSTATES: ${failed ? `FAIL (${failed}/${results.length})` : `PASS (${results.length})`}  report: ${outPath('states-report.json')}`,
);
process.exit(failed ? 1 : 0);
