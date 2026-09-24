// Builds messages/design-dictionary.json: every English string of the design mapped to the
// design's own Dutch and French, from Website Design/i18n-{nl,fr}.js plus the per-page
// <title> and meta description translations (data-nl / data-fr attributes).
// Run: node scripts/build-design-dictionary.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const design = path.join(root, 'Website Design');
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const sandbox = { window: {} };
vm.createContext(sandbox);
for (const f of ['i18n-nl.js', 'i18n-fr.js']) vm.runInContext(fs.readFileSync(path.join(design, f), 'utf8'), sandbox);
const { VANG_NL: nl, VANG_FR: fr } = sandbox.window;

const dict = {};
for (const en of Object.keys(nl)) dict[norm(en)] = { nl: nl[en], fr: fr[en] };

// Page titles and descriptions carry their translations as attributes.
for (const file of fs.readdirSync(design).filter((f) => /^VangAI .*\.dc\.html$/.test(f))) {
  const html = fs.readFileSync(path.join(design, file), 'utf8');
  const title = html.match(/<title data-fr="([^"]*)" data-nl="([^"]*)">([^<]*)<\/title>/);
  if (title) dict[norm(decode(title[3]))] = { nl: decode(title[2]), fr: decode(title[1]) };
  const desc = html.match(/<meta name="description" content="([^"]*)" data-fr="([^"]*)" data-nl="([^"]*)">/);
  if (desc) dict[norm(decode(desc[1]))] = { nl: decode(desc[3]), fr: decode(desc[2]) };
}

const out = path.join(root, 'messages', 'design-dictionary.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(dict, null, 2) + '\n');
console.log(`design-dictionary.json: ${Object.keys(dict).length} strings`);
