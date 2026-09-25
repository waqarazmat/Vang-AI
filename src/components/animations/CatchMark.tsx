'use client';

import { useEffect, useRef } from 'react';
import { m, useAnimate, useInView, useReducedMotion } from 'motion/react';
import { Mark } from '@/components/ui/Mark';
import { ease } from '@/lib/animation/motion';

/**
 * Signature motion, "the catch" (Vangst means the catch): when the mark scrolls into view,
 * a coral dot, the customer, drops into the open hands; the hands dip as they catch it and
 * the dot settles into the V. The resting state is the design's plain mark.
 */
export function CatchMark({
  size,
  tone = 'cream',
  dotClass = 'bg-coral',
}: {
  size: number;
  tone?: 'cream' | 'twotone' | 'orange';
  /** Coral on dark bands, cream on coral bands. */
  dotClass?: string;
}) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.6 });
  const [scope, animate] = useAnimate();
  const dot = Math.round(size * 0.12);

  useEffect(() => {
    if (!inView || reduce || !scope.current) return;
    const run = async () => {
      await animate(
        '[data-dot]',
        { opacity: [0, 1], y: [-size * 0.55, size * 0.34] },
        { duration: 0.7, ease: [0.5, 0, 0.75, 0] },
      );
      animate('[data-hands]', { y: [0, size * 0.035, 0] }, { duration: 0.5, ease: ease.out });
      await animate('[data-dot]', { y: size * 0.42, scale: [1, 0.2], opacity: 0 }, { duration: 0.45, ease: ease.out });
    };
    const id = setTimeout(() => void run(), 250);
    return () => clearTimeout(id);
  }, [inView, reduce, animate, scope, size]);

  return (
    <div ref={root}>
      <div ref={scope} className="relative" style={{ width: size, height: size }}>
        <m.div data-hands="" className="relative">
          <Mark size={size} tone={tone} />
        </m.div>
        {/* Always rendered (hidden until it drops) so server and client markup match. */}
        <m.span
          data-dot=""
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 rounded-[50%] ${dotClass}`}
          style={{ width: dot, height: dot, left: (size - dot) / 2, opacity: 0 }}
        />
      </div>
    </div>
  );
}
