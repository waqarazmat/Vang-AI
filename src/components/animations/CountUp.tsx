'use client';

import { useEffect, useRef } from 'react';
import { animate, useReducedMotion } from 'motion/react';
import { duration, ease } from '@/lib/animation/motion';

/**
 * Added motion: the number inside a figure such as "34", "9 hrs" or "€1,870" counts up
 * from 0 when it enters the viewport. The server renders the final text (SEO, no-JS), and
 * the reset to 0 only happens while the figure is still off screen, so there is no flash.
 * Figures that are already visible on load, and reduced motion, keep the final text.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^(\D*)(\d[\d.,   ]*\d|\d)(.*)$/);
    if (!el || reduce || !m) return;
    const [, before, digits, after] = m;
    const separator = digits.match(/[.,   ]/)?.[0] ?? '';
    const target = Number(digits.replace(/\D/g, ''));
    const format = (n: number) => before + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, separator) + after;

    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return; // already visible: no animation
    el.textContent = format(0);
    let stop: (() => void) | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const controls = animate(0, target, {
          duration: duration.countUp,
          ease: ease.out,
          onUpdate: (n) => (el.textContent = format(n)),
        });
        stop = () => controls.stop();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop?.();
      el.textContent = value;
    };
  }, [value, reduce]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
