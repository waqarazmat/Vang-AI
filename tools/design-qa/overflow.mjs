// Sideways-scroll check: the page must be exactly as wide as the screen at every width.
// Usage: node overflow.mjs [--page all] [--lang en] [--build URL] [--self] [--widths 360,375,...]
// Reports the outermost elements that stick out when a width fails.
import fs from 'node:fs';
import { parseArgs, loadPages, select, serveDesign, launch, designUrl, buildUrl, openPage, outPath } from './lib.mjs';

const args = parseArgs();
const pages = loadPages();
const pageKeys = select(Object.keys(pages), args.page);
const widths = (args.widths || '360,375,390,414,768,1024,1280,1440').split(',').map(Number);

const server = await serveDesign();
const browser = await launch();
const results = [];
try {
  for (const key of pageKeys) {
    const url = args.self ? designUrl(server, pages[key]) : buildUrl(args.build, pages[key], args.lang);
    for (const w of widths) {
      let o;
      try {
        o = await openPage(browser, url, {
          viewport: { width: w, height: 900 },
          lang: args.lang,
          isDesign: args.self,
          pageKey: args.self ? key : undefined,
        });
      } catch {
        results.push({ page: key, width: w, error: `failed to load ${url}` });
        continue;
      }
      const r = await o.page.evaluate(() => {
        const W = document.documentElement.clientWidth;
        const sw = document.documentElement.scrollWidth;
        const culprits = [];
        if (sw > W) {
          const clipped = (el) => {
            for (let p = el.parentElement; p && p !== document.body; p = p.parentElement)
              if (getComputedStyle(p).overflowX !== 'visible') return true;
            return false;
          };
          for (const el of document.querySelectorAll('body *')) {
            const b = el.getBoundingClientRect();
            if (b.right <= W + 0.5 || clipped(el)) continue;
            let p = el.parentElement,
              parentOver = false;
            for (; p && p !== document.body; p = p.parentElement)
              if (p.getBoundingClientRect().right > W + 0.5) parentOver = true;
            if (!parentOver)
              culprits.push(
                `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''} right=${Math.round(b.right)} "${(el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40)}"`,
              );
          }
        }
        return { W, sw, culprits: culprits.slice(0, 5) };
      });
      await o.ctx.close();
      results.push({ page: key, width: w, pass: r.sw <= r.W, pageWidth: r.sw, culprits: r.culprits });
    }
  }
} finally {
  await browser.close();
  server.close();
}

fs.writeFileSync(outPath('overflow-report.json'), JSON.stringify(results, null, 2));
for (const key of pageKeys) {
  const rows = results.filter((r) => r.page === key);
  console.log(
    `${key.padEnd(13)} ${rows.map((r) => (r.error ? `${r.width}:ERR` : r.pass ? `${r.width}:ok` : `${r.width}:OVER(${r.pageWidth})`)).join('  ')}`,
  );
  for (const r of rows.filter((x) => !x.pass && x.culprits))
    for (const c of r.culprits) console.log(`   ${r.width}px: ${c}`);
}
const failed = results.filter((r) => r.error || !r.pass).length;
console.log(`\nOVERFLOW: ${failed ? `FAIL (${failed}/${results.length})` : `PASS (${results.length})`}`);
process.exit(failed ? 1 : 0);
