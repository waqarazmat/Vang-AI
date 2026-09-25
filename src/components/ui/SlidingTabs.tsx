'use client';

import { useRef, useState } from 'react';
import { m } from 'motion/react';
import { duration, ease } from '@/lib/animation/motion';

type Slide = { x0: number; w0: number; x1: number; w1: number; y: number; h: number };

/**
 * Pill tabs where the coral pill slides to the chosen tab (added motion).
 * At rest the active tab paints its own background, exactly like the design; the separate
 * sliding pill exists only during the move (a background layer under text changes how
 * Chrome smooths that text).
 */
export function SlidingTabs({
  tabs,
  active,
  onChange,
  label,
}: {
  tabs: string[];
  active: number;
  onChange: (index: number) => void;
  label: string;
}) {
  const row = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [slide, setSlide] = useState<Slide | null>(null);

  const select = (i: number) => {
    const from = buttons.current[active];
    const to = buttons.current[i];
    const box = row.current?.getBoundingClientRect();
    if (i !== active && from && to && box) {
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      if (a.top === b.top) {
        setSlide({
          x0: a.left - box.left,
          w0: a.width,
          x1: b.left - box.left,
          w1: b.width,
          y: a.top - box.top,
          h: a.height,
        });
      }
    }
    onChange(i);
  };

  return (
    <div ref={row} role="tablist" aria-label={label} className="relative flex flex-wrap justify-center gap-[8px]">
      {slide && (
        <m.span
          aria-hidden="true"
          className="absolute left-0 rounded-[99px] bg-coral"
          style={{ top: slide.y, height: slide.h }}
          initial={{ x: slide.x0, width: slide.w0 }}
          animate={{ x: slide.x1, width: slide.w1 }}
          transition={{ duration: duration.pill, ease: ease.out }}
          onAnimationComplete={() => setSlide(null)}
        />
      )}
      {tabs.map((name, i) => {
        const on = i === active;
        return (
          <button
            key={name}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => select(i)}
            className={`relative cursor-pointer rounded-[99px] border px-[18px] py-[10px] text-[14px] font-[700] transition-[background,color,border-color] duration-[180ms] ease-[ease] hover:border-coral ${
              on
                ? `border-coral text-white ${slide ? 'bg-transparent' : 'bg-coral'}`
                : 'border-ink/25 bg-transparent text-ink/75'
            }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
