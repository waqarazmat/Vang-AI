'use client';

import { m } from 'motion/react';
import { distance, duration, ease } from '@/lib/animation/motion';

// Added motion: a new message pops in from its own side of the chat.
export function ChatBubble({
  mine,
  children,
  className,
}: {
  mine: boolean;
  children: React.ReactNode;
  className: string;
}) {
  return (
    <m.div
      layout="position"
      initial={{ opacity: 0, x: mine ? distance.bubble : -distance.bubble, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: duration.bubble, ease: ease.out }}
      style={{ transformOrigin: mine ? 'bottom right' : 'bottom left' }}
      className={className}
    >
      {children}
    </m.div>
  );
}
