// Pixel-by-pixel comparison of design vs build, full page, per viewport and language.
// Usage: node pixel-diff.mjs [--page home,product|all] [--vp mobile,tablet,desktop|all]
//        [--lang en|nl|fr] [--build http://localhost:3000] [--threshold 0] [--self]
// --self compares the design with itself (tool self-test, must report 0 diff).
import fs from 'node:fs';
import path from 'node:path';
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
  shot,
  comparePngs,
  landmarks,
  nameBand,
  outPath,
  OUT_DIR,
  designFixes,
} from './lib.mjs';

const args = parseArgs();
const pages = loadPages();
const pageKeys = select(Object.keys(pages), args.page);
const vps = select(Object.keys(VIEWPORTS), args.vp);
const lang = args.lang;

const server = await serveDesign();
const browser = await launch();
const results = [];
try {
  for (const key of pageKeys) {
    const pg = pages[key];
    for (const vp of vps) {
      const viewport = VIEWPORTS[vp];
      const dUrl = designUrl(server, pg);
      const bUrl = args.self ? dUrl : buildUrl(args.build, pg, lang);
      const dir = [lang, key, vp];

      // Chrome occasionally anti-aliases a few glyphs differently between loads. A real
      // difference reproduces on every capture, so a failing comparison is re-captured
      // (up to `retries` more times) and only reported if it persists.
      const retries = Number(args.retries ?? 2);
      let cmp,
        marks,
        pageErrors,
        attempts = 0,
        loadError = null;
      const firstFailures = [];
      while (attempts <= retries) {
        attempts++;
        const d = await openPage(browser, dUrl, { viewport, lang, isDesign: true, pageKey: key });
        const dPng = await shot(d.page, outPath(...dir, 'design.png'));
        marks = await landmarks(d.page);
        await d.ctx.close();

        let b;
        try {
          b = await openPage(browser, bUrl, {
            viewport,
            lang,
            isDesign: args.self,
            pageKey: args.self ? key : undefined,
            injectCss: args.inject,
          });
        } catch (e) {
          loadError = `Build page failed to load: ${bUrl} (${e.message.split('\n')[0]})`;
          break;
        }
        const bPng = await shot(b.page, outPath(...dir, 'build.png'));
        pageErrors = b.errors;
        await b.ctx.close();

        cmp = comparePngs(dPng, bPng, outPath(...dir, 'diff.png'));
        // Pixel-perfect: no clustered differences, same page size. --threshold allows a % of stray pixels.
        cmp.pass =
          cmp.bands.length === 0 &&
          cmp.diffPct <= args.threshold + 0.0005 &&
          cmp.heightA === cmp.heightB &&
          cmp.widthA === cmp.widthB;
        if (cmp.pass) break;
        firstFailures.push(cmp.diffPct);
      }
      if (loadError) {
        results.push({ page: key, vp, lang, error: loadError });
        continue;
      }
      const bands = cmp.bands.map((x) => ({ ...x, section: nameBand(marks, x.y0) }));
      const flaky = cmp.pass && firstFailures.length > 0;
      results.push({
        page: key,
        vp,
        lang,
        pass: cmp.pass,
        flaky,
        attempts,
        earlierDiffPct: firstFailures,
        url: bUrl,
        ...cmp,
        bands,
        pageErrors,
        files: path.join(OUT_DIR, ...dir),
      });
    }
  }
} finally {
  await browser.close();
  server.close();
}

fs.writeFileSync(outPath('pixel-report.json'), JSON.stringify(results, null, 2));
for (const r of results) {
  if (r.error) {
    console.log(`ERROR ${r.page} ${r.vp} ${r.lang}: ${r.error}`);
    continue;
  }
  const note = r.flaky
    ? `  (render noise on attempt 1: ${r.earlierDiffPct.join('%, ')}%, clean on attempt ${r.attempts})`
    : r.pass
      ? ''
      : `  (reproduced on all ${r.attempts} captures)`;
  console.log(
    `${r.pass ? 'PASS' : 'FAIL'} ${r.page} ${r.vp} ${r.lang}  diff ${r.diffPct}%${note}  height design ${r.heightA}px vs build ${r.heightB}px  width ${r.widthA} vs ${r.widthB}`,
  );
  for (const bd of r.bands.slice(0, 12))
    console.log(`   diff band y ${bd.y0}-${bd.y1} x ${bd.x0}-${bd.x1}  in "${bd.section}"`);
  if (r.bands.length > 12) console.log(`   ... ${r.bands.length - 12} more bands`);
  if (r.pageErrors?.length) console.log(`   page errors: ${r.pageErrors.join(' | ')}`);
}
const applied = [...new Set(pageKeys.flatMap((k) => designFixes(k).map((f) => f.id)))];
if (applied.length) console.log(`\nDesign fixes applied (see design-fixes.json): ${applied.join(', ')}`);
const failed = results.filter((r) => r.error || !r.pass).length;
console.log(
  `\nPIXEL: ${failed ? `FAIL (${failed}/${results.length})` : `PASS (${results.length})`}  report: ${outPath('pixel-report.json')}`,
);
process.exit(failed ? 1 : 0);
