'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { site } from '@/config/site';
import { PauseOffscreen } from '@/components/animations/PauseOffscreen';

const BARS = Array.from({ length: 14 }, (_, i) => i);

/**
 * "No waiting" card next to the VangVoice demo (design: VangAI Product.dc.html, .vp-side).
 * Caller and VangAI take turns every 3 seconds; the speaker button plays the recorded demo
 * call on a loop.
 */
export function VoiceSideCard() {
  const t = useTranslations('product.voice.side');
  const [muted, setMuted] = useState(true);
  const [callerSpeaks, setCallerSpeaks] = useState(true);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const id = setInterval(() => setCallerSpeaks(Math.floor(Date.now() / 3000) % 2 === 0), 200);
    return () => {
      clearInterval(id);
      audio.current?.pause();
    };
  }, []);

  const toggle = () => {
    const next = !muted;
    if (!next) {
      audio.current ??= Object.assign(new Audio(site.demoCallAudio), { loop: true });
      void audio.current.play().catch(() => {});
    } else {
      audio.current?.pause();
    }
    setMuted(next);
  };

  return (
    <PauseOffscreen className="vp-side flex w-[196px] flex-none flex-col gap-[10px] rounded-[22px] bg-ink p-[16px] text-cream shadow-[0_16px_34px_rgba(43,33,24,0.18)]">
      <div className="flex items-center justify-between gap-[8px]">
        <div className="font-mono text-[9.5px] tracking-[0.14em] text-coral-light uppercase">{t('label')}</div>
        <button
          type="button"
          onClick={toggle}
          aria-label={muted ? t('unmute') : t('mute')}
          aria-pressed={!muted}
          className={`flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-[50%] border border-cream/35 transition-[background] duration-[180ms] ease-[ease] ${
            muted ? 'bg-cream/8' : 'bg-coral'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="#FAEEDA"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
            {muted ? (
              <path d="M16 9.5l5 5M21 9.5l-5 5" stroke="#E8443A" strokeWidth="2.4" />
            ) : (
              <path d="M15.5 9.2a4 4 0 0 1 0 5.6M18 7a7 7 0 0 1 0 10" />
            )}
          </svg>
        </button>
      </div>
      <div className="rounded-[14px] border border-cream/16 bg-cream/7 px-[12px] py-[10px]">
        <div
          className={`font-mono text-[9px] tracking-[0.12em] uppercase ${callerSpeaks ? 'text-cream' : 'text-cream/55'}`}
        >
          {t('caller')}
        </div>
        <div className={`vs-w mt-[6px] text-cream ${callerSpeaks ? 'on' : ''}`}>
          {BARS.map((i) => (
            <i key={i} />
          ))}
        </div>
      </div>
      <div
        className={`relative h-[34px] w-[10px] flex-none self-center ${callerSpeaks ? 'vs-dn' : 'vs-up'}`}
        aria-hidden="true"
      >
        <div className="absolute top-0 bottom-0 left-[4px] w-[2px] rounded-[99px] bg-cream/18" />
        <i />
        <i />
        <i />
      </div>
      <div className="rounded-[14px] border border-coral/40 bg-coral/14 px-[12px] py-[10px]">
        <div
          className={`font-mono text-[9px] tracking-[0.12em] uppercase ${callerSpeaks ? 'text-cream/55' : 'text-coral-light'}`}
        >
          VangAI
        </div>
        <div className={`vs-w mt-[6px] text-coral-light ${callerSpeaks ? '' : 'on'}`}>
          {BARS.map((i) => (
            <i key={i} />
          ))}
        </div>
      </div>
      <div className="text-[13px] leading-[1.4] font-[700] text-balance text-cream">{t('note')}</div>
    </PauseOffscreen>
  );
}
