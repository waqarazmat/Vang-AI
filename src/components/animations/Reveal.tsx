'use client';

import { m, useReducedMotion } from 'motion/react';
import { distance, duration, ease } from '@/lib/animation/motion';

/**
 * Added motion: content fades up 16px once when it enters the viewport.
 * Under reduced motion it renders plainly, so the resting design state is what shows.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: distance.reveal }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: duration.reveal, ease: ease.out, delay }}
    >
      {children}
    </m.div>
  );
}
