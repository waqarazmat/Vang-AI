'use client';

import { useId, useState } from 'react';
import { Link } from '@/i18n/navigation';
import type { AppPathname } from '@/i18n/routing';

export type FaqEntry = { q: string; a: string; link?: { label: string; href: AppPathname } };
type Variant = 'dark' | 'light' | 'compact';

// Values per design variant: Home (dark), Pricing (light), Product (compact, per channel).
const V = {
  dark: {
    item: 'rounded-[18px] border-cream/14 bg-cream/6',
    head: 'px-[22px] py-[15px]',
    q: 'text-[18.5px] text-cream',
    a: 'px-[22px] pb-[16px] text-[17px] leading-[1.7] text-cream/82',
    link: 'text-coral-light hover:text-cream',
  },
  light: {
    item: 'rounded-[18px] border-ink/10 bg-cream',
    head: 'px-[22px] py-[15px]',
    q: 'text-[20px]',
    a: 'px-[22px] pb-[16px] text-[18px] leading-[1.7] text-ink/80',
    link: 'text-coral hover:text-ink',
  },
  compact: {
    item: 'rounded-[14px] border-ink/10 bg-cream',
    head: 'px-[18px] py-[15px]',
    q: 'text-[16.5px]',
    a: 'px-[18px] pb-[16px] text-[15.5px] leading-[1.6] text-ink/80',
    link: 'text-coral hover:text-ink',
  },
} as const;

function FaqItem({ entry, variant }: { entry: FaqEntry; variant: Variant }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const v = V[variant];
  return (
    <div className={`overflow-hidden border ${v.item}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full cursor-pointer items-start justify-between gap-[16px] text-left ${v.head}`}
      >
        <span className={`leading-[1.35] font-[700] tracking-[-0.02em] text-pretty ${v.q}`}>{entry.q}</span>
        {/* Added motion: the sign turns in when it changes (+ to –). */}
        <span
          key={open ? 'minus' : 'plus'}
          aria-hidden="true"
          className="faq-sign flex-none font-mono text-[20px] leading-[1.1] text-coral"
        >
          {open ? '–' : '+'}
        </span>
      </button>
      <div
        id={id}
        role="region"
        className={`grid transition-[grid-template-rows] duration-[380ms] ease-design ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="min-h-0 overflow-hidden" inert={!open}>
          <div className={`max-w-[64ch] text-pretty ${v.a}`}>
            {entry.link ? (
              <>
                {`${entry.a} `}
                <Link href={entry.link.href} className={`font-[600] ${v.link}`}>
                  {entry.link.label}
                </Link>
                .
              </>
            ) : (
              entry.a
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Accordion list. With `visible`, the rest sits behind a "show more" toggle (Home). */
export function Faq({
  entries,
  variant,
  visible,
  moreLabel,
  lessLabel,
  gap = 6,
}: {
  entries: FaqEntry[];
  variant: Variant;
  visible?: number;
  moreLabel?: string;
  lessLabel?: string;
  gap?: number;
}) {
  const [more, setMore] = useState(false);
  const head = visible ? entries.slice(0, visible) : entries;
  const rest = visible ? entries.slice(visible) : [];
  const list = (items: FaqEntry[]) => items.map((entry) => <FaqItem key={entry.q} entry={entry} variant={variant} />);

  return (
    <div className="flex flex-col" style={{ gap }}>
      {list(head)}
      {rest.length > 0 && (
        <>
          <div
            className={`grid transition-[grid-template-rows] duration-[520ms] ease-design ${more ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
          >
            <div className="min-h-0 overflow-hidden" inert={!more}>
              <div className="flex flex-col" style={{ gap }}>
                {list(rest)}
              </div>
            </div>
          </div>
          <div className="mt-[10px]">
            <button
              type="button"
              aria-expanded={more}
              onClick={() => setMore((m) => !m)}
              className="inline-flex cursor-pointer items-center gap-[9px] rounded-[99px] border border-cream/50 px-[24px] py-[12px] text-[15px] font-[600] text-cream transition-[background,color] duration-[180ms] ease-[ease] hover:bg-cream hover:text-ink"
            >
              {more ? lessLabel : moreLabel}
              <span
                aria-hidden="true"
                className={`inline-block transition-transform duration-[300ms] ease-[ease] ${more ? 'rotate-180' : ''}`}
              >
                ↓
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
