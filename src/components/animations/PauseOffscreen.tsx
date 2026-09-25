'use client';

import { useEffect, useRef } from 'react';

/**
 * Pauses every CSS animation inside while the block is off screen or the tab is hidden
 * (sets data-paused, see globals.css). Same behaviour as the design's data-anim blocks.
 */
export function PauseOffscreen({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let visible = false;
    const apply = () => el.setAttribute('data-paused', visible && !document.hidden ? '0' : '1');
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      apply();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', apply);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', apply);
    };
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
