import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const dir = path.resolve(import.meta.dirname, '..', 'messages');
const load = (l) => JSON.parse(fs.readFileSync(path.join(dir, `${l}.json`), 'utf8'));
const leaves = (o, p = '') =>
  Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? leaves(v, `${p}${k}.`) : [[`${p}${k}`, v]]));

describe('translations', () => {
  const en = Object.fromEntries(leaves(load('en')));
  for (const l of ['nl', 'fr']) {
    const other = Object.fromEntries(leaves(load(l)));
    it(`${l} has exactly the English keys`, () => expect(Object.keys(other).sort()).toEqual(Object.keys(en).sort()));
    it(`${l} has no empty strings`, () => expect(Object.entries(other).filter(([, v]) => v === '')).toEqual([]));
  }
});
