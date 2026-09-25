'use client';

import { useEffect, useState } from 'react';
import { m, useReducedMotion } from 'motion/react';

// Added motion: a soft cross-fade between pages. Skipped on the very first page load (so it
// never delays the first paint) and under reduced motion. Server renders never animate.
let navigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [animate] = useState(() => typeof window !== 'undefined' && navigated);
  useEffect(() => {
    navigated = true;
  }, []);
  return (
    <m.div
      initial={animate && !reduce ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </m.div>
  );
}
