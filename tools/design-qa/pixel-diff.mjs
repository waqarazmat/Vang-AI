// Pixel-by-pixel comparison of design vs build, full page, per viewport and language.
// Usage: node pixel-diff.mjs [--page home,product|all] [--vp mobile,tablet,desktop|all]
//        [--lang en|nl|fr] [--build http://localhost:3000] [--threshold 0] [--self]
// --self compares the design with itself (tool self-test, must report 0 diff).
// Progressive mode:  --until "<text>"  compares only from the top of the page down to the
//   first element with that visible text (use while a page is built section by section).
// Component mode:    --design-loc "<locator>" --build-loc "<locator>"  compares one element
//   (Playwright locators, e.g. "header", "text=Book a call", "xpath=//footer").
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
  cropTop,
  findTextY,
} from './lib.mjs';
import { PNG } from 'pngjs';

const args = parseArgs();
const pages = loadPages();
const pageKeys = select(Object.keys(pages), args.page);
const vps = select(Object.keys(VIEWPORTS), args.vp);
const lang = args.lang;
const component = Boolean(args['design-loc'] && args['build-loc']);

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
        let dPng = component
          ? PNG.sync.read(
              await d.page
                .locator(args['design-loc'])
                .first()
                .screenshot({ path: outPath(...dir, 'design.png'), animations: 'disabled' }),
            )
          : await shot(d.page, outPath(...dir, 'design.png'));
        marks = await landmarks(d.page);
        const cutY = args.until ? await findTextY(d.page, args.until) : null;
        await d.ctx.close();
        if (args.until && cutY === null) {
          loadError = `--until text not found in the design: ${JSON.stringify(args.until)}`;
          break;
        }

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
        let bPng;
        try {
          bPng = component
            ? PNG.sync.read(
                await b.page
                  .locator(args['build-loc'])
                  .first()
                  .screenshot({ path: outPath(...dir, 'build.png'), animations: 'disabled', timeout: 5000 }),
              )
            : await shot(b.page, outPath(...dir, 'build.png'));
        } catch (e) {
          loadError = `Build element not found: ${args['build-loc']} (${e.message.split('\n')[0]})`;
          await b.ctx.close();
          break;
        }
        pageErrors = b.errors;
        await b.ctx.close();

        if (cutY !== null) {
          // Progressive mode: only the part of the page that is already built is compared.
          dPng = cropTop(dPng, cutY);
          bPng = cropTop(bPng, cutY);
        }
        cmp = comparePngs(dPng, bPng, outPath(...dir, 'diff.png'));
        cmp.mode = component ? 'component' : cutY !== null ? `until y=${cutY}` : 'full page';
        // Pixel-perfect: no clustered differences, same size. --threshold allows a % of stray pixels.
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
    `${r.pass ? 'PASS' : 'FAIL'} ${r.page} ${r.vp} ${r.lang} [${r.mode}]  diff ${r.diffPct}%${note}  height design ${r.heightA}px vs build ${r.heightB}px  width ${r.widthA} vs ${r.widthB}`,
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
