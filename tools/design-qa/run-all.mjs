// Runs every design check for one or more pages and prints one summary table.
// Usage: node run-all.mjs --page home [--build URL] [--until "<text>"] [--quick]
//   --quick: EN only at the three widths (skips NL/FR and the palette audit), for the build loop.
import { spawnSync } from 'node:child_process';
import { parseArgs } from './lib.mjs';

const a = parseArgs();
const common = ['--page', a.page, ...(a.build ? ['--build', a.build] : []), ...(a.self ? ['--self'] : [])];
const until = a.until ? ['--until', a.until] : [];

const steps = [
  ['pixel EN', 'pixel-diff.mjs', [...common, ...until, '--lang', 'en']],
  ['states EN', 'states.mjs', [...common, '--lang', 'en']],
  ['style EN', 'style-diff.mjs', [...common, '--lang', 'en']],
];
if (!a.quick) {
  steps.push(
    ['pixel NL', 'pixel-diff.mjs', [...common, ...until, '--lang', 'nl', '--vp', 'mobile,desktop']],
    ['pixel FR', 'pixel-diff.mjs', [...common, ...until, '--lang', 'fr', '--vp', 'mobile,desktop']],
    ['palette', 'palette-audit.mjs', [...common, '--vp', 'mobile,desktop']],
  );
  if (!a.until) steps.push(['overflow', 'overflow.mjs', [...common, '--lang', 'en']]);
}

const rows = [];
for (const [name, script, argv] of steps) {
  const t = Date.now();
  process.stdout.write(`running ${name} ... `);
  const r = spawnSync(process.execPath, [script, ...argv], { cwd: import.meta.dirname, encoding: 'utf8' });
  const out = (r.stdout || '') + (r.stderr || '');
  const verdict = out.match(/^(PIXEL|STATES|STYLE|PALETTE|OVERFLOW): .*$/m)?.[0] ?? `exit ${r.status}`;
  console.log(`${r.status === 0 ? 'PASS' : 'FAIL'} (${Math.round((Date.now() - t) / 1000)}s)`);
  rows.push({
    name,
    pass: r.status === 0,
    verdict,
    detail: out
      .split('\n')
      .filter((l) => /^(FAIL|ERROR)|^\s{3}/.test(l))
      .slice(0, 12),
  });
}

console.log('\n| check | result | summary |\n| --- | --- | --- |');
for (const r of rows) console.log(`| ${r.name} | ${r.pass ? 'PASS' : 'FAIL'} | ${r.verdict} |`);
for (const r of rows.filter((x) => !x.pass)) console.log(`\n${r.name}:\n${r.detail.join('\n')}`);
const failed = rows.filter((r) => !r.pass).length;
console.log(`\nDESIGN QA (${a.page}): ${failed ? `FAIL (${failed} checks)` : 'PASS'}`);
process.exit(failed ? 1 : 0);
