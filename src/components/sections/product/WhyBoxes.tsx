'use client';

import { useState } from 'react';
import { ArrowIcon, CheckIcon } from './listIcons';

// "What X does" / "Why X matters". Hovering the second box swaps the two backgrounds (design).
export function WhyBoxes({
  doesTitle,
  does,
  whyTitle,
  why,
}: {
  doesTitle: string;
  does: string[];
  whyTitle: string;
  why: string[];
}) {
  const [swap, setSwap] = useState(false);
  const box =
    'min-w-0 rounded-[24px] border border-ink/12 p-[30px] transition-[background] duration-[300ms] ease-[ease]';
  const title = 'mb-[10px] text-[24px] leading-[1.15] font-[800] tracking-[-0.028em]';
  const row = 'flex items-start gap-[12px] border-b border-ink/10 py-[9px]';
  const text = 'text-[16.5px] leading-[1.55] text-pretty text-ink/86';
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-[20px]">
      <div className={`${box} ${swap ? 'bg-sand' : 'bg-paper'}`}>
        <div className={title}>{doesTitle}</div>
        {does.map((item) => (
          <div key={item} className={row}>
            <CheckIcon />
            <span className={text}>{item}</span>
          </div>
        ))}
      </div>
      <div
        className={`${box} ${swap ? 'bg-paper' : 'bg-sand'}`}
        onMouseEnter={() => setSwap(true)}
        onMouseLeave={() => setSwap(false)}
      >
        <div className={title}>{whyTitle}</div>
        {why.map((item) => (
          <div key={item} className={row}>
            <ArrowIcon />
            <span className={text}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
