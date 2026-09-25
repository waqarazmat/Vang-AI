// Downloads the exact font files the design gets from Google Fonts (as Chrome receives them),
// so the site renders text identically to the design. Latin subset only (NL/FR/EN).
// Run: node scripts/fetch-design-fonts.mjs
import fs from 'node:fs';
import path from 'node:path';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const CSS =
  'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap';
const out = path.resolve(import.meta.dirname, '..', 'src', 'app', 'fonts');
fs.mkdirSync(out, { recursive: true });

const css = await (await fetch(CSS, { headers: { 'user-agent': UA } })).text();
const blocks = css
  .split('/* ')
  .slice(1)
  .map((b) => ({ subset: b.split(' */')[0], body: b }));
const saved = {};
for (const { subset, body } of blocks) {
  if (subset !== 'latin') continue;
  const family = body.match(/font-family: '([^']+)'/)[1];
  const weight = body.match(/font-weight: (\d+)/)[1];
  const url = body.match(/url\((https:[^)]+\.woff2)\)/)[1];
  const name = `${family.replace(/\s+/g, '')}-${url.split('/').pop()}`;
  if (!saved[name]) {
    const buf = Buffer.from(await (await fetch(url, { headers: { 'user-agent': UA } })).arrayBuffer());
    fs.writeFileSync(path.join(out, name), buf);
    saved[name] = [];
    console.log(`${name} ${buf.length}B`);
  }
  saved[name].push(`${family} ${weight}`);
}
console.log(JSON.stringify(saved, null, 2));
