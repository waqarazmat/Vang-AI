// Lists every text element the approved small-text-contrast fix changes on the design,
// with its original and corrected colour: the reference for building those elements.
// Usage: node contrast-map.mjs [--page all]
import fs from 'node:fs';
import { parseArgs, loadPages, select, serveDesign, launch, designUrl, openPage, VIEWPORTS, outPath } from './lib.mjs';

const args = parseArgs();
const pages = loadPages();
const keys = select(Object.keys(pages), args.page);
const server = await serveDesign();
const browser = await launch();
const rows = [];
for (const key of keys) {
  for (const vp of ['desktop', 'mobile']) {
    const { ctx, page } = await openPage(browser, designUrl(server, pages[key]), { viewport: VIEWPORTS[vp], lang: 'en', isDesign: true, pageKey: key });
    const found = await page.evaluate(() =>
      [...document.querySelectorAll('body *')]
        .filter((el) => el.style.getPropertyPriority('color') === 'important')
        .map((el) => ({
          text: [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.data).join('').trim().slice(0, 60),
          to: el.style.getPropertyValue('color'),
          size: getComputedStyle(el).fontSize,
        })),
    );
    for (const f of found) if (!rows.some((r) => r.text === f.text && r.to === f.to)) rows.push({ page: key, ...f });
    await ctx.close();
  }
}
await browser.close();
server.close();
fs.writeFileSync(outPath('contrast-map.json'), JSON.stringify(rows, null, 2));
for (const r of rows) console.log(`${r.page.padEnd(12)} ${r.size.padEnd(6)} -> ${r.to.padEnd(26)} "${r.text}"`);
