// The garage scene's timeline, ported from the design's lost-engine.js without changing a
// single track value. Each track is a list of [time in seconds, value] keyframes over a
// 54-second loop, interpolated with smoothstep easing. The scene writes transforms and
// opacities straight to the SVG nodes (no React render per frame).

type Track = [number, number][];
type Windows = [number, number][];

export const TR = {
  L: 54,
  mechX: [
    [0, -88],
    [3.4, -88],
    [5.4, -380],
    [8.9, -380],
    [10.9, -88],
    [11.9, -125],
    [14.45, -125],
    [15.1, -88],
    [26.0, -88],
    [26.6, -72],
    [34.8, -72],
    [36.5, -232],
    [37.3, -232],
    [39.3, -88],
    [54, -88],
  ] as Track,
  crouch: [
    [0, 1],
    [3.3, 1],
    [3.8, 0],
    [10.9, 0],
    [11.9, 1.7],
    [13.9, 1.7],
    [14.1, 1.3],
    [14.4, 1.3],
    [14.9, 0],
    [19.4, 0],
    [20.3, 1],
    [22.6, 1],
    [23.3, 0.4],
    [24.4, 0.4],
    [25.0, 1],
    [25.8, 1],
    [26.4, 0],
    [39.2, 0],
    [40.0, 1],
    [54, 1],
  ] as Track,
  jump: [
    [0, 0],
    [13.92, 0],
    [14.06, -14],
    [14.2, -9],
    [14.4, 0],
    [54, 0],
  ] as Track,
  sx: [
    [0, 1],
    [8.7, 1],
    [9.0, -1],
    [10.8, -1],
    [11.1, 1],
    [26.3, 1],
    [26.7, -1],
    [32.2, -1],
    [32.6, 1],
    [37.0, 1],
    [37.3, -1],
    [39.2, -1],
    [39.5, 1],
    [54, 1],
  ] as Track,
  hood: [
    [0, -62],
    [54, -62],
  ] as Track,
  head: [
    [0, 7],
    [3.2, 7],
    [3.6, 0],
    [10.9, 0],
    [11.9, 8],
    [13.9, 8],
    [14.1, -10],
    [14.8, -4],
    [16.4, -2],
    [16.9, 0],
    [19.4, 0],
    [20.3, 7],
    [22.4, 7],
    [22.8, -10],
    [24.2, -10],
    [24.8, 7],
    [25.8, 7],
    [26.4, 0],
    [28.6, 0],
    [28.9, -9],
    [30.8, -9],
    [31.2, 0],
    [36.3, 0],
    [36.6, 12],
    [37.1, 12],
    [37.5, 0],
    [39.4, 0],
    [40.0, 7],
    [54, 7],
  ] as Track,
  armA: [
    [0, -6],
    [5.2, -6],
    [5.7, 150],
    [8.5, 150],
    [8.9, -6],
    [14.2, -6],
    [14.6, 132],
    [16.0, 132],
    [16.35, -14],
    [16.6, -14],
    [17.0, 150],
    [19.0, 150],
    [19.4, -6],
    [54, -6],
  ] as Track,
  armB: [
    [0, 2],
    [54, 2],
  ] as Track,
  osc: [
    [0, 12],
    [3.1, 12],
    [3.4, 0],
    [11.9, 0],
    [12.3, 13],
    [13.8, 13],
    [13.9, 0],
    [14.6, 0],
    [14.8, 15],
    [15.8, 15],
    [16.0, 0],
    [19.8, 0],
    [20.4, 12],
    [22.4, 12],
    [22.6, 0],
    [24.8, 0],
    [25.2, 12],
    [25.6, 12],
    [25.8, 0],
    [39.9, 0],
    [40.4, 12],
    [54, 12],
  ] as Track,
  custX: [
    [0, 44],
    [25.0, 44],
    [27.0, -90],
    [31.9, -90],
    [34.0, 80],
    [44.8, 80],
    [44.9, 44],
    [46.6, -90],
    [51.9, -90],
    [53.9, 80],
    [54, 80],
  ] as Track,
  custSx: [
    [0, 1],
    [31.5, 1],
    [31.9, -1],
    [44.7, -1],
    [44.8, 1],
    [51.5, 1],
    [51.9, -1],
    [54, -1],
  ] as Track,
  rows: {
    A: [
      [0, 330],
      [2.6, 330],
      [3.4, 0],
      [39.6, 0],
      [40.3, 330],
      [40.6, 330],
      [41.3, 0],
      [53.2, 0],
      [53.9, 330],
      [54, 330],
    ] as Track,
    B: [
      [0, 330],
      [13.2, 330],
      [14.0, 0],
      [39.6, 0],
      [40.3, 330],
      [42.4, 330],
      [43.1, 0],
      [53.2, 0],
      [53.9, 330],
      [54, 330],
    ] as Track,
    C: [
      [0, 330],
      [20.6, 330],
      [21.4, 0],
      [39.6, 0],
      [40.3, 330],
      [44.0, 330],
      [44.7, 0],
      [53.2, 0],
      [53.9, 330],
      [54, 330],
    ] as Track,
    D: [
      [0, 330],
      [27.6, 330],
      [28.4, 0],
      [39.6, 0],
      [40.3, 330],
      [45.6, 330],
      [46.3, 0],
      [53.2, 0],
      [53.9, 330],
      [54, 330],
    ] as Track,
    E: [
      [0, 330],
      [33.8, 330],
      [34.6, 0],
      [39.6, 0],
      [40.3, 330],
      [47.2, 330],
      [47.9, 0],
      [53.2, 0],
      [53.9, 330],
      [54, 330],
    ] as Track,
  },
  ok: {
    A: [
      [8.3, 39.9],
      [41.6, 53.9],
    ],
    B: [
      [18.6, 39.9],
      [43.4, 53.9],
    ],
    C: [[45.0, 53.9]],
    D: [[46.6, 53.9]],
    E: [[48.2, 53.9]],
  } as Record<string, Windows>,
  no: { C: [[24.0, 39.9]], D: [[31.0, 39.9]], E: [[36.4, 39.9]] } as Record<string, Windows>,
  rings: [
    [3.0, 5.7],
    [21.0, 24.0],
    [28.0, 31.0],
    [34.2, 36.4],
  ] as Windows,
  buzz: [[13.5, 16.35]] as Windows,
  airing: [
    [41.0, 42.3],
    [42.6, 43.9],
    [44.2, 45.5],
    [45.8, 47.1],
    [47.4, 48.7],
  ] as Windows,
  call: [[5.7, 8.6]] as Windows,
  mob: [[16.7, 19.1]] as Windows,
  pock: [[16.35, 19.25]] as Windows,
  stars: [[14.08, 15.9]] as Windows,
  talkM: [
    [6.0, 6.9],
    [7.3, 8.2],
    [17.2, 17.9],
    [18.2, 18.9],
    [28.1, 28.8],
    [29.6, 30.3],
  ] as Windows,
  talkC: [
    [27.2, 28.0],
    [29.0, 29.5],
    [30.5, 31.3],
    [46.9, 47.8],
    [48.7, 49.6],
    [50.5, 51.3],
  ] as Windows,
  ai: [[40.0, 53.8]] as Windows,
  pops: [[40.8, 53.6]] as Windows,
  end: [[49.6, 53.7]] as Windows,
  miss: [24.0, 31.0, 36.4],
  fix: 40.0,
  unfix: 53.9,
};

/** Static frame shown under reduced motion (design: t = 47.6 s, every call booked). */
export const REDUCED_MOTION_TIME = 47.6;

// Smoothstep interpolation between keyframes (identical to the design engine).
export function at(tr: Track, t: number): number {
  if (t <= tr[0][0]) return tr[0][1];
  for (let i = 1; i < tr.length; i++) {
    if (t <= tr[i][0]) {
      const a = tr[i - 1];
      const b = tr[i];
      let u = (t - a[0]) / (b[0] - a[0] || 1);
      u = u * u * (3 - 2 * u);
      return a[1] + (b[1] - a[1]) * u;
    }
  }
  return tr[tr.length - 1][1];
}

// 0..1 visibility inside time windows, fading over `f` seconds at each edge.
export function win(ws: Windows, t: number, f: number): number {
  let o = 0;
  for (const w of ws) {
    const v = Math.min((t - w[0]) / f, (w[1] - t) / f, 1);
    if (v > o) o = v;
  }
  return o < 0 ? 0 : o > 1 ? 1 : o;
}

export type SceneNodes = Record<string, HTMLElement | SVGElement>;

/** Frame state carried between frames (walk cycles). */
export type WalkState = { ph: number; st: number; cph: number; cst: number };

/**
 * Writes one frame at time t. `dt` is the scaled frame delta used by the walk cycle.
 * Returns the number of missed customers so far and whether VangAI has taken over.
 */
export function renderFrame(q: SceneNodes, S: WalkState, t: number, dt: number): { missed: number; fixed: boolean } {
  const set = (k: string, tf: string | null, op?: number | null) => {
    const n = q[k];
    if (!n) return;
    if (tf !== null && tf !== undefined) n.style.transform = tf;
    if (op !== null && op !== undefined) n.style.opacity = String(op);
  };

  const mx = at(TR.mechX, t);
  const mspeed = Math.abs(mx - at(TR.mechX, t - 0.04)) / 0.04;
  S.st += ((mspeed > 22 ? 1 : 0) - S.st) * Math.min(1, dt * 10);
  S.ph += mspeed * dt * 0.037;
  const c = at(TR.crouch, t);
  const sx = at(TR.sx, t);
  const sw = Math.sin(S.ph) * S.st;
  const bob = -2.2 * Math.abs(Math.cos(S.ph)) * S.st + at(TR.jump, t);
  set('mech', `translate(${mx.toFixed(2)}px,${(bob + 6 * c).toFixed(2)}px) scale(${sx.toFixed(3)},1)`);
  set('mTorso', `rotate(${(-17 * c).toFixed(2)}deg)`);
  set('mHead', `rotate(${at(TR.head, t).toFixed(2)}deg)`);
  const o = at(TR.osc, t) * Math.sin(t * 7.4);
  set('mArmA', `rotate(${(at(TR.armA, t) + o - 22 * sw).toFixed(2)}deg)`);
  set('mArmB', `rotate(${(at(TR.armB, t) - o + 22 * sw).toFixed(2)}deg)`);
  set('mLegA', `rotate(${(24 * sw + 9 * Math.min(c, 1)).toFixed(2)}deg)`);
  set('mLegB', `rotate(${(-24 * sw - 7 * Math.min(c, 1)).toFixed(2)}deg)`);
  const wob = t > 14.05 && t < 15.2 ? 6 * Math.sin((t - 14.05) * 28) * (1 - (t - 14.05) / 1.15) : 0;
  set('hood', `rotate(${(at(TR.hood, t) + wob).toFixed(2)}deg)`);
  set('stars', `rotate(${((t * 160) % 360).toFixed(1)}deg)`, win(TR.stars, t, 0.15));
  set('mMob', null, win(TR.mob, t, 0.12));
  set('mPock', null, 1 - win(TR.pock, t, 0.1));
  const bz = win(TR.buzz, t, 0.1);
  set('mBuzz', `translate(${(1.4 * Math.sin(t * 60) * bz).toFixed(2)}px,0)`, bz);

  const cx = at(TR.custX, t);
  const csx = at(TR.custSx, t);
  const cspeed = Math.abs(cx - at(TR.custX, t - 0.04)) / 0.04;
  S.cst += ((cspeed > 18 ? 1 : 0) - S.cst) * Math.min(1, dt * 10);
  S.cph += cspeed * dt * 0.037;
  const csw = Math.sin(S.cph) * S.cst;
  set(
    'cust',
    `translate(${cx.toFixed(2)}px,${(-2 * Math.abs(Math.cos(S.cph)) * S.cst).toFixed(2)}px) scale(${csx.toFixed(3)},1)`,
  );
  set('cLegA', `rotate(${(24 * csw).toFixed(2)}deg)`);
  set('cLegB', `rotate(${(-24 * csw).toFixed(2)}deg)`);
  set('cArmA', `rotate(${(-4 - 18 * csw).toFixed(2)}deg)`);
  set('cArmB', `rotate(${(4 + 18 * csw).toFixed(2)}deg)`);

  const ring = win(TR.rings, t, 0.18);
  set('ring', null, ring);
  set('airing', null, win(TR.airing, t, 0.3));
  const onCall = win(TR.call, t, 0.12);
  set(
    'hset',
    ring > 0.04
      ? `translate(${(1.1 * Math.sin(t * 5.5) * ring).toFixed(2)}px,${(-1.4 * Math.abs(Math.sin(t * 5.5)) * ring).toFixed(2)}px) rotate(${(3.2 * Math.sin(t * 5.5) * ring).toFixed(2)}deg)`
      : 'none',
    1 - onCall,
  );
  set('mRec', null, onCall);
  set('cord', null, onCall);
  set('talkM', null, win(TR.talkM, t, 0.15));
  set('talkC', null, win(TR.talkC, t, 0.15));
  const aiv = win(TR.ai, t, 0.4);
  set('aiph', `scale(${(1 + 0.08 * Math.sin(t * 3)).toFixed(3)})`, aiv);
  set('aimk', null, aiv);
  set('pops', null, win(TR.pops, t, 0.4));
  const e = win(TR.end, t, 0.45);
  set('end', `translateY(${((1 - e) * 10).toFixed(2)}px)`, e);

  for (const k of ['A', 'B', 'C', 'D', 'E'] as const) {
    const x = at(TR.rows[k], t);
    const op = (330 - x) / 120;
    const row = q['c' + k];
    set(
      'c' + k,
      row && row.tagName.toLowerCase() === 'g'
        ? `translateX(${x.toFixed(2)}px)`
        : `translateX(${(x * 0.12).toFixed(2)}px)`,
      op < 0 ? 0 : op > 1 ? 1 : op,
    );
    if (TR.no[k]) set('no' + k, null, win(TR.no[k], t, 0.2));
    if (TR.ok[k]) set('ok' + k, null, win(TR.ok[k], t, 0.2));
  }

  let missed = 0;
  for (const m of TR.miss) if (t >= m) missed++;
  return { missed, fixed: t >= TR.fix && t < TR.unfix };
}
