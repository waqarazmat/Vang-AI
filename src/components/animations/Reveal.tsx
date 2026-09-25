'use client';

import { useEffect, useRef } from 'react';

/*
 * Added motion (scroll reveals). Content fades up 16px once when it enters the viewport.
 * Each component renders exactly one div with the className it is given, so it can replace an
 * existing div without changing the layout. The hidden start state lives in CSS (globals.css,
 * `.reveal`) and applies only with prefers-reduced-motion: no-preference and JavaScript on, so
 * server and client markup are identical and the resting state is the design.
 */

type Props = { children: React.ReactNode; className?: string; delay?: number };

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add('is-in');
        io.disconnect();
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

const cx = (base: string, className?: string) => (className ? `${base} ${className}` : base);

export function Reveal({ children, className, delay = 0 }: Props) {
  const ref = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cx('reveal', className)}
      style={delay ? ({ '--reveal-delay': `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

/** A grid or list whose RevealItem children appear one after another. */
export function RevealGroup({ children, className }: Omit<Props, 'delay'>) {
  const ref = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={cx('reveal-group', className)}>
      {children}
    </div>
  );
}

export function RevealItem({ children, className }: Omit<Props, 'delay'>) {
  return <div className={cx('reveal-item', className)}>{children}</div>;
}
