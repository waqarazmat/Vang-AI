'use client';

import { LazyMotion, MotionConfig, domMax } from 'motion/react';

// domMax (not domAnimation) because the sliding pills use shared layout animations.
// reducedMotion="user": visitors who turn motion off get every end state instantly.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
