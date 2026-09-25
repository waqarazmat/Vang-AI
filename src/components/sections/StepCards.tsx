'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const STEPS = ['call', 'build', 'test', 'live'] as const;

/**
 * The four "how we work" steps on a dark band (design: VangAI Home / About, .vg-steps).
 * Ported reveal logic: step 1 shows first; hovering or tapping the newest step reveals the
 * next; once the row has been in view for 4 s all steps show. On screens up to 1060px and
 * under reduced motion all steps show at once.
 */
export function StepCards() {
  const t = useTranslations('steps');
  const [shown, setShown] = useState(1);
  const row = useRef<HTMLDivElement>(null);
  const auto = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = (q: string) => window.matchMedia(q).matches;
    if (mq('(max-width: 1060px)') || mq('(prefers-reduced-motion: reduce)')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync with the viewport, like the design
      setShown(4);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !auto.current) auto.current = setTimeout(() => setShown(4), 4000);
      },
      { rootMargin: '-20% 0px -20% 0px' },
    );
    if (row.current) io.observe(row.current);
    return () => {
      io.disconnect();
      if (auto.current) clearTimeout(auto.current);
    };
  }, []);

  const advance = (i: number) => {
    if (auto.current) clearTimeout(auto.current);
    auto.current = setTimeout(() => setShown(4), 4000);
    if (shown === i + 1 && i < 3) setShown(i + 2);
  };

  return (
    <div ref={row} className="mt-[40px] flex flex-wrap items-stretch gap-[16px] max-1060:flex-col">
      {STEPS.map((key, i) => {
        const visible = shown > i;
        return (
          <div
            key={key}
            onMouseEnter={() => advance(i)}
            onClick={() => advance(i)}
            className={`flex min-w-0 flex-[1_1_220px] items-stretch gap-[8px] transition-[opacity,transform] duration-[1100ms] ease-design max-1060:flex-[1_1_auto] max-1060:flex-col ${
              visible ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-[48px] opacity-0'
            }`}
          >
            <div className="flex min-w-0 flex-1 flex-col gap-[12px] rounded-[22px] border border-cream/16 bg-cream/7 p-[26px]">
              <div className="flex items-center justify-between gap-[10px]">
                <div className="font-mono text-[12px] tracking-[0.1em] text-coral-light">0{i + 1}</div>
                {visible && shown === i + 1 && i < 3 && (
                  <div className="font-mono text-[9.5px] tracking-[0.12em] text-cream/60 uppercase">{t('hint')}</div>
                )}
              </div>
              <div className="text-[20px] leading-[1.2] font-[800] tracking-[-0.026em] text-balance text-cream">
                {t(`${key}.title`)}
              </div>
              <div className="text-[15.5px] leading-[1.6] text-pretty text-cream/82">{t(`${key}.text`)}</div>
            </div>
            {i < 3 && (
              <div
                aria-hidden="true"
                className="flex w-[24px] flex-none items-center justify-center max-1060:w-full max-1060:py-[2px]"
              >
                <div className="flex items-center max-1060:rotate-90">
                  <div className="h-[3px] w-[12px] rounded-[99px] bg-coral" />
                  <div className="h-0 w-0 border-y-[7px] border-l-[10px] border-y-transparent border-l-coral" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
