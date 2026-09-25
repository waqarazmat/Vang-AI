'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mark } from '@/components/ui/Mark';
import { PhoneFrame, StatusIcons } from './PhoneFrame';

const BARS = Array.from({ length: 21 }, (_, i) => i);

type Mode = 'idle' | 'live';
type Kind = 'mic' | 'script';

/**
 * VangVoice demo (design: VangCall.dc.html). Pressing call asks for the microphone; with
 * access, the "You" waveform follows the visitor's voice (Web Audio analyser). Without it,
 * a scripted call alternates speakers every 3 seconds. The assistant's voice is connected
 * later through the assistant adapter (src/lib/assistant).
 */
export function VoiceDemo() {
  const t = useTranslations('demos.voice');
  const [mode, setMode] = useState<Mode>('idle');
  const [kind, setKind] = useState<Kind>('script');
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);

  const you = useRef<HTMLDivElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const raf = useRef(0);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  const flatten = () => {
    if (!you.current) return;
    for (const bar of Array.from(you.current.children)) (bar as HTMLElement).style.transform = 'scaleY(0.1)';
  };

  const teardown = useCallback(() => {
    if (tick.current) clearInterval(tick.current);
    tick.current = null;
    cancelAnimationFrame(raf.current);
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    void audio.current?.close().catch(() => {});
    audio.current = null;
    flatten();
  }, []);

  useEffect(() => teardown, [teardown]);

  const go = (k: Kind) => {
    setKind(k);
    setSeconds(0);
    setMuted(false);
    setMode('live');
    tick.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const start = async () => {
    if (mode !== 'idle') return;
    if (!navigator.mediaDevices?.getUserMedia) return go('script');
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = media;
      const ctx = new AudioContext();
      audio.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.7;
      ctx.createMediaStreamSource(media).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const loop = () => {
        raf.current = requestAnimationFrame(loop);
        const bars = you.current?.children;
        if (!bars) return;
        analyser.getByteFrequencyData(data);
        for (let i = 0; i < bars.length; i++) {
          const v = data[Math.floor((i / bars.length) * (data.length * 0.7))] / 255;
          (bars[i] as HTMLElement).style.transform = `scaleY(${Math.max(0.1, Math.min(1, v * 2.1)).toFixed(3)})`;
        }
      };
      loop();
      go('mic');
    } catch {
      go('script');
    }
  };

  const end = () => {
    teardown();
    setMode('idle');
    setSeconds(0);
    setMuted(false);
  };

  const toggleMute = () => {
    const next = !muted;
    stream.current?.getAudioTracks().forEach((track) => (track.enabled = !next));
    if (next) flatten();
    setMuted(next);
  };

  const live = mode === 'live';
  const mic = kind === 'mic';
  const speaker = live && !mic ? Math.floor(seconds / 3) % 2 : -1;
  const youOn = (!mic && speaker === 0) || (mic && !muted && seconds > 0);
  const aiOn = !mic && speaker === 1;
  const youActive = mic ? !muted : youOn;
  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <PhoneFrame screen="bg-[#17120D]">
      <div className="relative z-[2] flex items-center justify-between px-[24px] pt-[15px] text-cream">
        <span className="text-[12.5px] font-[700] tracking-[0.01em]">9:41</span>
        <StatusIcons color="#FAEEDA" faint="rgba(250,238,218,0.55)" />
      </div>

      {!live && (
        <div className="absolute inset-[44px_0_0] flex flex-col items-center justify-center px-[26px] pb-[30px]">
          <div className="relative flex h-[118px] w-[118px] items-center justify-center">
            <div className="voice-ring absolute inset-0 rounded-[50%] border-2 border-coral" />
            <div className="relative flex h-[104px] w-[104px] items-center justify-center rounded-[50%] bg-cream">
              <Mark size={58} />
            </div>
          </div>
          <div className="mt-[22px] text-[21px] font-[800] tracking-[-0.03em] text-cream">{t('name')}</div>
          <div className="mt-[8px] font-mono text-[10px] tracking-[0.14em] text-cream/55 uppercase">{t('ready')}</div>
          <p className="mx-0 mt-[20px] mb-0 max-w-[30ch] text-center text-[13.5px] leading-[1.55] text-pretty text-cream/65">
            {t('intro')}
          </p>
          <button
            type="button"
            onClick={() => void start()}
            className="mt-[26px] inline-flex cursor-pointer items-center gap-[10px] rounded-[99px] bg-coral px-[30px] py-[15px] text-[15.5px] font-[700] text-cream transition-[background,transform] duration-[180ms] ease-[ease] hover:-translate-y-[2px] hover:bg-cream hover:text-ink"
          >
            <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
              <path d="M6.6 3.2h2.9l1.5 3.9-2 1.5a10 10 0 0 0 6 6l1.5-2 3.9 1.5v2.9a2 2 0 0 1-2.2 2A16.2 16.2 0 0 1 4.6 5.4a2 2 0 0 1 2-2.2z" />
            </svg>
            {t('call')}
          </button>
          <div className="mt-[16px] text-center font-mono text-[9.5px] leading-[1.7] tracking-[0.1em] text-cream/40 uppercase">
            {t('privacy')}
          </div>
        </div>
      )}

      {live && (
        <div className="absolute inset-[44px_0_0] flex flex-col px-[22px] pb-[26px]">
          <div className="flex flex-col items-center gap-[10px] pt-[14px]">
            <div className="flex h-[74px] w-[74px] items-center justify-center rounded-[50%] bg-cream">
              <Mark size={42} />
            </div>
            <div className="text-[18px] font-[800] tracking-[-0.028em] text-cream">{t('name')}</div>
            <div className="font-mono text-[13px] tracking-[0.12em] text-coral" aria-live="off">
              {time}
            </div>
          </div>

          <div className="mt-[22px] flex flex-col gap-[12px]">
            <div className="rounded-[18px] border border-cream/14 bg-cream/7 px-[16px] py-[14px]">
              <div className="flex items-center gap-[8px]">
                <div className={`h-[7px] w-[7px] rounded-[50%] ${youActive ? 'bg-[#4ED07A]' : 'bg-cream/30'}`} />
                <div
                  className={`font-mono text-[9.5px] tracking-[0.14em] uppercase ${youActive ? 'text-cream' : 'text-cream/50'}`}
                >
                  {t('you')}
                </div>
              </div>
              <div
                ref={you}
                className={`voice-wave mt-[10px] flex h-[42px] items-center justify-between gap-[3px] ${!mic && youOn ? 'on' : ''}`}
              >
                {BARS.map((i) => (
                  <div
                    key={i}
                    style={{ transform: 'scaleY(0.1)' }}
                    className="h-[40px] w-[4px] origin-center rounded-[99px] bg-cream transition-transform duration-[90ms] ease-linear"
                  />
                ))}
              </div>
            </div>
            <div className="rounded-[18px] border border-[rgba(216,90,48,0.32)] bg-[rgba(216,90,48,0.1)] px-[16px] py-[14px]">
              <div className="flex items-center gap-[8px]">
                <div className={`h-[7px] w-[7px] rounded-[50%] ${aiOn ? 'bg-coral' : 'bg-[rgba(216,90,48,0.35)]'}`} />
                <div
                  className={`font-mono text-[9.5px] tracking-[0.14em] uppercase ${aiOn ? 'text-cream' : 'text-cream/50'}`}
                >
                  VangAI
                </div>
              </div>
              <div
                className={`voice-wave mt-[10px] flex h-[42px] items-center justify-between gap-[3px] ${aiOn ? 'on' : ''}`}
              >
                {BARS.map((i) => (
                  <div
                    key={i}
                    style={{ transform: 'scaleY(0.1)' }}
                    className="h-[40px] w-[4px] origin-center rounded-[99px] bg-coral transition-transform duration-[90ms] ease-linear"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-[14px] text-center text-[11.5px] leading-[1.6] text-pretty text-cream/60">
            {mic ? t('noteMic') : t('noteScript')}
          </div>

          <div className="mt-auto flex items-center justify-center gap-[26px]">
            <button type="button" onClick={toggleMute} className="flex cursor-pointer flex-col items-center gap-[7px]">
              <div
                className={`flex h-[56px] w-[56px] items-center justify-center rounded-[50%] border border-cream/25 transition-[background] duration-[180ms] ease-[ease] ${
                  muted ? 'bg-cream/90' : 'bg-cream/8'
                }`}
              >
                {muted ? (
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="#2B2118"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <rect x="9" y="2.6" width="6" height="11" rx="3" />
                    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" />
                    <path d="M4 3.5 20 20.5" stroke="#FFFFFF" strokeWidth="5" />
                    <path d="M4 3.5 20 20.5" stroke="#E8443A" strokeWidth="2.6" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="#FAEEDA"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <rect x="9" y="2.6" width="6" height="11" rx="3" />
                    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" />
                  </svg>
                )}
              </div>
              <div className="font-mono text-[9px] tracking-[0.12em] text-cream/60 uppercase">
                {muted ? t('unmute') : t('mute')}
              </div>
            </button>
            <button type="button" onClick={end} className="flex cursor-pointer flex-col items-center gap-[7px]">
              <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[50%] bg-[#D93025] transition-[background] duration-[180ms] ease-[ease] hover:bg-[#B3251C]">
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="#FFFFFF"
                  className="rotate-[134deg]"
                  aria-hidden="true"
                >
                  <path d="M6.6 3.2h2.9l1.5 3.9-2 1.5a10 10 0 0 0 6 6l1.5-2 3.9 1.5v2.9a2 2 0 0 1-2.2 2A16.2 16.2 0 0 1 4.6 5.4a2 2 0 0 1 2-2.2z" />
                </svg>
              </div>
              <div className="font-mono text-[9px] tracking-[0.12em] text-cream/60 uppercase">{t('end')}</div>
            </button>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
