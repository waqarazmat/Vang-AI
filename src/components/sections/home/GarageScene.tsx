'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { REDUCED_MOTION_TIME, renderFrame, TR, type SceneNodes, type WalkState } from '@/lib/animation/garageTimeline';
import { GarageSvg } from './GarageSvg';

const ROWS = [
  { key: 'A', time: '09:12', text: 'rowA', kind: 'phoneCall', canMiss: false },
  { key: 'B', time: '10:04', text: 'rowB', kind: 'mobile', canMiss: false },
  { key: 'C', time: '11:30', text: 'rowC', kind: 'phoneCall', canMiss: true },
  { key: 'D', time: '13:47', text: 'rowD', kind: 'phoneCall', canMiss: true },
  { key: 'E', time: '16:20', text: 'rowE', kind: 'phoneCall', canMiss: true },
] as const;

const badge =
  'absolute inset-0 flex items-center justify-center rounded-[99px] font-mono text-[9.5px] tracking-[0.12em] uppercase opacity-0';

/**
 * "A normal day at the garage" (design: VangLost C). Joe misses three calls, then VangAI
 * picks up and every call is booked. One requestAnimationFrame loop writes the frame to
 * the SVG nodes; it stops while the scene is off screen or the tab is hidden, and shows
 * the static "all booked" frame when the visitor prefers reduced motion.
 */
export function GarageScene() {
  const t = useTranslations('home.garage');
  const root = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ missed: 0, fixed: false });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const nodes: SceneNodes = {};
    el.querySelectorAll<HTMLElement>('[data-vl]').forEach((n) => (nodes[n.dataset.vl!] = n));
    const walk: WalkState = { ph: 0, st: 0, cph: 0, cst: 0 };
    const report = (s: { missed: number; fixed: boolean }) =>
      setState((prev) => (prev.missed === s.missed && prev.fixed === s.fixed ? prev : s));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      report(renderFrame(nodes, walk, REDUCED_MOTION_TIME, 0));
      return;
    }

    let time = 0;
    let last = 0;
    let raf = 0;
    let onScreen = false;
    const setPaused = () => el.setAttribute('data-paused', onScreen && !document.hidden ? '0' : '1');
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      let dt = last ? (now - last) / 1000 : 0;
      last = now;
      if (dt > 0.4) dt = 0;
      if (!onScreen || document.hidden) return;
      time = (time + dt) % TR.L;
      report(renderFrame(nodes, walk, time, dt));
    };
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      setPaused();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', setPaused);
    renderFrame(nodes, walk, 0, 0);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', setPaused);
    };
  }, []);

  const { missed, fixed } = state;

  return (
    <div ref={root} className="vlc-scene flex w-full max-w-full flex-col gap-[14px] overflow-hidden font-sans">
      <div className="flex justify-end">
        <div
          className={`inline-flex items-center gap-[10px] rounded-[99px] border px-[16px] py-[8px] transition-[background,border-color] duration-[400ms] ease-[ease] ${
            fixed ? 'border-[rgba(216,90,48,0.5)] bg-[rgba(216,90,48,0.12)]' : 'border-ink/18 bg-ink/4'
          }`}
        >
          <span
            className={`font-mono text-[10.5px] tracking-[0.14em] uppercase transition-colors duration-[400ms] ease-[ease] ${
              fixed ? 'text-coral-deep' : 'text-ink/60'
            }`}
          >
            {fixed ? t('missedWithVangAI') : t('missed')}
          </span>
          <span
            className={`text-[19px] font-[800] tracking-[-0.02em] tabular-nums transition-colors duration-[400ms] ease-[ease] ${
              fixed ? 'text-coral' : 'text-ink'
            }`}
          >
            {fixed ? 0 : missed}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-stretch justify-center gap-[18px]">
        <GarageSvg label={t('sceneLabel')} />
        <div className="flex max-w-[440px] min-w-0 flex-[1_1_280px] flex-col gap-[10px] overflow-hidden rounded-[24px] bg-ink p-[22px]">
          <div className="flex items-baseline justify-between gap-[12px]">
            <div className="font-mono text-[10.5px] tracking-[0.16em] text-cream/65 uppercase">{t('panelTitle')}</div>
            <div className="font-mono text-[10.5px] tracking-[0.16em] text-coral-light uppercase">{t('live')}</div>
          </div>
          {ROWS.map((row) => (
            <div
              key={row.key}
              data-vl={`c${row.key}`}
              className="flex items-center gap-[14px] rounded-[16px] border border-cream/16 bg-cream/6 px-[16px] py-[12px] opacity-0"
            >
              <div className="w-[42px] flex-none font-mono text-[12px] text-cream/60">{row.time}</div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-[700] tracking-[-0.015em] text-pretty text-cream">{t(row.text)}</div>
                <div className="mt-[4px] font-mono text-[10px] tracking-[0.12em] text-cream/55 uppercase">
                  {t(row.kind)}
                </div>
              </div>
              <div className="relative h-[30px] w-[96px] flex-none">
                {row.canMiss && (
                  <div data-vl={`no${row.key}`} className={`${badge} border border-cream/35 text-cream/70`}>
                    {t('missedBadge')}
                  </div>
                )}
                <div data-vl={`ok${row.key}`} className={`${badge} bg-coral text-cream`}>
                  {t('booked')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-h-[104px] items-center justify-center px-[12px]">
        <div data-vl="end" className="rounded-[22px] bg-ink px-[34px] py-[24px] text-center text-cream opacity-0">
          <div className="mb-[10px] font-mono text-[11px] tracking-[0.16em] text-coral-light uppercase">
            {t('endLabel')}
          </div>
          <div className="text-[30px] leading-[1.05] font-[800] tracking-[-0.035em] text-balance">{t('endTitle')}</div>
        </div>
      </div>
    </div>
  );
}
