'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Eyebrow } from '@/components/ui/Eyebrow';

const ITEMS = ['setup', 'tone', 'languages', 'calendar', 'summary', 'report', 'updates', 'person', 'privacy'] as const;

/**
 * "What is included" (design: VangAI Home.dc.html). A magnifier follows the mouse and
 * reveals the card under it; "Reveal all" / "Hide" toggle everything; on touch screens
 * everything is revealed. Hidden cards keep their text for screen readers.
 */
export function Included() {
  const t = useTranslations('home.included');
  const [all, setAll] = useState(false);
  const [hover, setHover] = useState(-1);
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const area = useRef<HTMLDivElement>(null);
  const glass = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync with the input device, like the design
    if (window.matchMedia('(hover: none)').matches) setAll(true);
  }, []);

  const move = (e: React.MouseEvent) => {
    if (!area.current || !glass.current || all) return;
    const r = area.current.getBoundingClientRect();
    glass.current.style.transform = `translate(${e.clientX - r.left}px,${e.clientY - r.top}px)`;
    glass.current.style.opacity = '1';
  };
  const leave = () => {
    if (glass.current) glass.current.style.opacity = '0';
    setHover(-1);
  };
  const revealAll = () => {
    if (glass.current) glass.current.style.opacity = '0';
    setAll(true);
    setHover(-1);
  };

  const found = all ? ITEMS.length : seen.size;
  const toggle = (active: boolean) =>
    `cursor-pointer rounded-[99px] border px-[20px] py-[11px] text-[15px] font-[600] transition-[border-color,background,color] duration-[180ms] ease-[ease] hover:border-coral ${
      active ? '' : 'border-ink/25 bg-transparent text-ink'
    }`;

  return (
    <section className="border-y border-ink/12 bg-sand">
      <div className="mx-auto max-w-[1200px] px-[40px] py-[80px]">
        <div className="flex flex-wrap items-end justify-between gap-x-[30px] gap-y-[18px]">
          <div className="min-w-0">
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <h2 className="mx-0 mt-[18px] mb-0 max-w-[26ch] text-[40px] leading-[1.05] font-[800] tracking-[-0.035em] text-balance">
              {t('title')}
            </h2>
            <p className="mx-0 mt-[12px] mb-0 max-w-[46ch] text-[17px] leading-[1.6] text-pretty text-ink/78">
              {t('lead')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-[14px]">
            <div className="font-mono text-[11px] tracking-[0.14em] text-coral-deep uppercase" aria-live="polite">
              {t('found', { found, total: ITEMS.length })}
            </div>
            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                onClick={revealAll}
                aria-pressed={all}
                className={`${toggle(all)} ${all ? 'border-coral bg-coral text-white' : ''}`}
              >
                {t('revealAll')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAll(false);
                  setHover(-1);
                }}
                aria-pressed={!all}
                className={`${toggle(!all)} ${!all ? 'border-ink bg-ink text-cream' : ''}`}
              >
                {t('hide')}
              </button>
            </div>
          </div>
        </div>

        <div
          ref={area}
          onMouseMove={move}
          onMouseLeave={leave}
          className={`relative mt-[30px] ${all ? 'cursor-default' : 'cursor-none'}`}
        >
          <div
            ref={glass}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-[6] h-0 w-0 opacity-0 transition-opacity duration-[180ms] ease-[ease]"
          >
            <div className="absolute top-0 left-0 h-0 w-0 -rotate-45">
              <div className="absolute top-[80px] left-[-9px] h-[12px] w-[18px] rounded-[3px] bg-[#8A3417]" />
              <div className="absolute top-[90px] left-[-11px] h-[60px] w-[22px] rounded-[11px] bg-coral-deep shadow-[0_8px_18px_rgba(43,33,24,0.2)]" />
            </div>
            <div className="absolute top-[-82px] left-[-82px] box-border h-[164px] w-[164px] rounded-[50%] border-[7px] border-coral bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.5),rgba(255,255,255,0.1)_58%,rgba(255,255,255,0.02))] shadow-[0_0_0_3px_rgba(43,33,24,0.1),0_16px_36px_rgba(43,33,24,0.22)]" />
          </div>
          <div className="grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[14px] max-640:grid-cols-[minmax(0,1fr)]">
            {ITEMS.map((key, i) => {
              const on = all || hover === i;
              return (
                <div
                  key={key}
                  onMouseEnter={() => {
                    setHover(i);
                    setSeen((s) => (s.has(i) ? s : new Set(s).add(i)));
                  }}
                  onMouseLeave={() => setHover((h) => (h === i ? -1 : h))}
                  className={`relative min-h-[160px] overflow-hidden rounded-[20px] border p-[22px] transition-[background,border-color] duration-[300ms] ease-[ease] ${
                    on ? 'border-ink/18 bg-cream' : 'border-ink/12 bg-ink/5'
                  }`}
                >
                  {on ? (
                    <div className="flex flex-col gap-[9px]">
                      <div className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[50%] bg-coral">
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M4 12.5l5 5L20 6.5" />
                        </svg>
                      </div>
                      <div className="text-[18.5px] leading-[1.2] font-[800] tracking-[-0.022em] text-balance">
                        {t(`items.${key}.title`)}
                      </div>
                      <div className="text-[15.5px] leading-[1.55] text-pretty text-ink/80">
                        {t(`items.${key}.text`)}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-[11px] opacity-50 blur-[3px]" aria-hidden="true">
                        <div className="h-[34px] w-[34px] rounded-[50%] bg-ink opacity-22" />
                        <div className="h-[13px] w-[64%] rounded-[99px] bg-ink opacity-20" />
                        <div className="h-[10px] rounded-[99px] bg-ink opacity-14" />
                        <div className="h-[10px] w-[80%] rounded-[99px] bg-ink opacity-14" />
                      </div>
                      <div className="sr-only">
                        {t(`items.${key}.title`)}. {t(`items.${key}.text`)}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
