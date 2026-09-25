import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { renderFrame, TR, type SceneNodes, type WalkState } from './garageTimeline';

const KEYS = [
  'mech',
  'mTorso',
  'mHead',
  'mArmA',
  'mArmB',
  'mLegA',
  'mLegB',
  'hood',
  'stars',
  'mMob',
  'mPock',
  'mBuzz',
  'cust',
  'cLegA',
  'cLegB',
  'cArmA',
  'cArmB',
  'ring',
  'airing',
  'hset',
  'mRec',
  'cord',
  'talkM',
  'talkC',
  'aiph',
  'aimk',
  'pops',
  'end',
  'cA',
  'cB',
  'cC',
  'cD',
  'cE',
  'noC',
  'noD',
  'noE',
  'okA',
  'okB',
  'okC',
  'okD',
  'okE',
];

function makeRoot() {
  const root = document.createElement('div');
  for (const k of KEYS) {
    const n = document.createElement('div');
    n.setAttribute('data-vl', k);
    root.appendChild(n);
  }
  document.body.appendChild(root);
  const nodes: SceneNodes = {};
  root.querySelectorAll<HTMLElement>('[data-vl]').forEach((n) => (nodes[n.dataset.vl!] = n));
  return { root, nodes };
}

const snapshot = (nodes: SceneNodes) => KEYS.map((k) => `${k}:${nodes[k].style.transform}|${nodes[k].style.opacity}`);

describe('garage timeline port', () => {
  it('writes exactly the same transforms and opacities as the design engine (lost-engine.js)', () => {
    // Load the design's original engine into this jsdom window.
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    vi.stubGlobal('requestAnimationFrame', () => 0);
    const src = fs.readFileSync(path.resolve(__dirname, '../../../Website Design/lost-engine.js'), 'utf8');
    new Function(src)();
    const engine = (
      window as unknown as {
        VangLostEngine: { start: (r: Element, o: object) => { seek: (t: number) => void; stop: () => void } };
      }
    ).VangLostEngine;

    const original = makeRoot();
    const ctl = engine.start(original.root, { pace: () => TR.L });
    const port = makeRoot();
    const S: WalkState = { ph: 0, st: 0, cph: 0, cst: 0 };

    for (let i = 0; i < 60; i++) {
      const t = (i * 0.9 + 0.13) % TR.L;
      ctl.seek(t); // original: frame(0.016) at time t
      renderFrame(port.nodes, S, t, 0.016);
      expect(snapshot(port.nodes), `t=${t.toFixed(2)}`).toEqual(snapshot(original.nodes));
    }
    ctl.stop();
  });

  it('counts missed customers and the VangAI takeover like the design', () => {
    const { nodes } = makeRoot();
    const S: WalkState = { ph: 0, st: 0, cph: 0, cst: 0 };
    expect(renderFrame(nodes, S, 10, 0)).toEqual({ missed: 0, fixed: false });
    expect(renderFrame(nodes, S, 32, 0)).toEqual({ missed: 2, fixed: false });
    expect(renderFrame(nodes, S, 47.6, 0)).toEqual({ missed: 3, fixed: true });
  });
});
