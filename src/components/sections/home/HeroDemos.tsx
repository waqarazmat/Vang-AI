'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { SlidingTabs } from '@/components/ui/SlidingTabs';
import { VoiceDemo } from '@/components/demos/VoiceDemo';
import { WhatsAppDemo } from '@/components/demos/WhatsAppDemo';
import { WebChatDemo } from '@/components/demos/WebChatDemo';

const TABS = ['VangVoice', 'VangMessage', 'VangChat'];

/**
 * The hero's live demo with channel tabs. Like the design, the tabs rotate every 5 seconds
 * until the visitor interacts with a demo, and only while the hero is on screen, the tab is
 * visible and motion is allowed. All three demos stay mounted so a chat keeps its state.
 */
export function HeroDemos() {
  const t = useTranslations('home.hero');
  const [tab, setTab] = useState(0);
  const touched = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      const el = root.current;
      if (touched.current || document.hidden || !el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      setTab((i) => (i + 1) % 3);
    }, 5000);
    return () => clearInterval(id);
  }, [reduce]);

  const touch = () => {
    touched.current = true;
  };

  return (
    <div
      ref={root}
      className="hero-rise flex min-w-0 flex-col items-center gap-[14px]"
      style={{ '--d': '360ms' } as React.CSSProperties}
    >
      <div className="text-center font-mono text-[10.5px] tracking-[0.16em] text-amber uppercase">{t('demoLabel')}</div>
      <SlidingTabs
        tabs={TABS}
        active={tab}
        label={t('demoTabsLabel')}
        onChange={(i) => {
          touch();
          setTab(i);
        }}
      />
      <div
        className="flex w-full justify-center"
        onPointerDown={touch}
        onKeyDown={touch}
        onWheel={touch}
        onFocus={touch}
      >
        {[<VoiceDemo key="voice" />, <WhatsAppDemo key="whatsapp" />, <WebChatDemo key="chat" />].map((demo, i) => (
          <div key={i} role="tabpanel" aria-label={TABS[i]} hidden={tab !== i} className="max-w-full">
            {demo}
          </div>
        ))}
      </div>
    </div>
  );
}
