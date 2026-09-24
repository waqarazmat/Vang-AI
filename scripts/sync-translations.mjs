// Fills messages/nl.json and messages/fr.json from messages/en.json using the design's own
// translations (messages/design-dictionary.json), so NL and FR match the design word for word.
//
// - Values that are not in the dictionary (new copy such as the 404 page) are kept from the
//   existing nl/fr files if present; otherwise they are reported and the sync fails.
// - Strings containing {placeholders} are matched with the placeholder text restored, e.g.
//   en "Or call our AI at {number} and hear it yourself" is looked up as
//   "Or call our AI at [demo number] and hear it yourself".
// - Brand-only strings (VangAI, VangVoice, ...) are copied unchanged.
//
// Run: node scripts/sync-translations.mjs [--check]   (--check: fail without writing)
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dir = path.join(root, 'messages');
const check = process.argv.includes('--check');
const read = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
const dict = read('design-dictionary.json');
const en = read('en.json');
const norm = (s) => s.replace(/\s+/g, ' ').trim();

// Placeholder names used in en.json and the design text they stand for.
const PLACEHOLDERS = { number: '[demo number]', email: '[email address]', companyNumber: '[company number]' };
const SAME_IN_ALL =
  /^(VangAI|VangVoice|VangMessage|VangChat|WhatsApp|NL|FR|EN|Garage Vanhees|garagevanhees\.be|\s|[·/|0-9:€,.+-])+$/;

function lookup(value, lang) {
  if (SAME_IN_ALL.test(value)) return value;
  let key = value;
  for (const [name, text] of Object.entries(PLACEHOLDERS)) key = key.replaceAll(`{${name}}`, text);
  const hit = dict[norm(key)];
  if (!hit) return undefined;
  let out = hit[lang];
  for (const [name, text] of Object.entries(PLACEHOLDERS)) out = out.replaceAll(text, `{${name}}`);
  return out;
}

function build(node, existing, lang, trail, missing) {
  if (typeof node === 'string') {
    const v = lookup(node, lang) ?? existing;
    if (v === undefined) missing.push(`${trail.join('.')}: ${JSON.stringify(node)}`);
    return v ?? node;
  }
  const out = Array.isArray(node) ? [] : {};
  for (const [k, v] of Object.entries(node)) out[k] = build(v, existing?.[k], lang, [...trail, k], missing);
  return out;
}

let failed = false;
for (const lang of ['nl', 'fr']) {
  const file = `${lang}.json`;
  const existing = fs.existsSync(path.join(dir, file)) ? read(file) : {};
  const missing = [];
  const next = build(en, existing, lang, [], missing);
  const text = JSON.stringify(next, null, 2) + '\n';
  const current = fs.existsSync(path.join(dir, file)) ? fs.readFileSync(path.join(dir, file), 'utf8') : '';
  if (missing.length) {
    failed = true;
    console.log(`${lang}: ${missing.length} strings without a design translation (add them to ${file} by hand):`);
    for (const m of missing) console.log(`   ${m}`);
  }
  if (check) {
    if (text !== current) {
      failed = true;
      console.log(`${lang}: out of date, run node scripts/sync-translations.mjs`);
    }
  } else {
    fs.writeFileSync(path.join(dir, file), text);
    console.log(`${lang}: written`);
  }
}
process.exit(failed ? 1 : 0);
