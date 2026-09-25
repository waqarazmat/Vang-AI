'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Mark } from '@/components/ui/Mark';
import { ArrowRight } from '@/components/ui/icons';
import { ChatBubble } from './ChatBubble';
import { PhoneFrame, StatusIcons } from './PhoneFrame';
import { useScriptedChat } from './useScriptedChat';
import { useDemoScript } from './useDemoScript';

// VangMessage demo: a WhatsApp chat with Garage Vanhees (design: VangWhatsApp.dc.html).
export function WhatsAppDemo() {
  const t = useTranslations('demos');
  const script = useDemoScript();
  const chat = useScriptedChat({
    channel: 'whatsapp',
    initial: [
      { text: t('whatsapp.openingQuestion'), mine: true, time: '19:41' },
      { text: t('whatsapp.openingAnswer'), mine: false, time: '19:41' },
    ],
    qa: script.qa,
    fallback: script.fallback,
    delayMs: 1000,
    withTime: true,
  });
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (list.current) list.current.scrollTop = list.current.scrollHeight;
  }, [chat.msgs, chat.typing, chat.done]);

  return (
    <PhoneFrame screen="bg-[#EFE7DE]">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 300 560"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id="vwaDoodle" width="104" height="104" patternUnits="userSpaceOnUse">
            <g
              fill="none"
              stroke="#2B2118"
              strokeOpacity="0.05"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="20" r="8" />
              <path d="M46 12h20v14H56l-6 6v-6h-4z" />
              <path d="M88 14l7 9-7 9-7-9z" />
              <path d="M12 56c6-9 15-9 21 0" />
              <circle cx="58" cy="60" r="6.5" />
              <path d="M86 50v16M78 58h16" />
              <path d="M14 88h16v11H14z" />
              <path d="M52 84l9 15H43z" />
              <circle cx="88" cy="92" r="7.5" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="#EFE7DE" />
        <rect width="100%" height="100%" fill="url(#vwaDoodle)" />
      </svg>

      <div className="relative z-[2] bg-[#008069] text-white">
        <div className="flex items-center justify-between px-[24px] pt-[14px] pb-[2px]">
          <span className="text-[12.5px] font-[700]">9:41</span>
          <StatusIcons color="#FFFFFF" faint="rgba(255,255,255,0.6)" />
        </div>
        <div className="flex items-center gap-[11px] px-[14px] pt-[8px] pb-[11px]">
          <svg
            viewBox="0 0 24 24"
            width="21"
            height="21"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-none"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="M11 6 5 12l6 6" />
          </svg>
          <div className="flex h-[36px] w-[36px] flex-none items-center justify-center overflow-hidden rounded-[50%] bg-cream">
            <Mark size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="overflow-hidden text-[15.5px] font-[600] tracking-[-0.01em] text-ellipsis whitespace-nowrap">
              {t('businessName')}
            </div>
            <div className="mt-[1px] text-[11.5px] text-white/80">{t('whatsapp.online')}</div>
          </div>
          <svg
            viewBox="0 0 24 24"
            width="19"
            height="19"
            fill="#FFFFFF"
            className="flex-none opacity-90"
            aria-hidden="true"
          >
            <path d="M6.6 3.2h2.9l1.5 3.9-2 1.5a10 10 0 0 0 6 6l1.5-2 3.9 1.5v2.9a2 2 0 0 1-2.2 2A16.2 16.2 0 0 1 4.6 5.4a2 2 0 0 1 2-2.2z" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="#FFFFFF"
            className="flex-none opacity-90"
            aria-hidden="true"
          >
            <circle cx="12" cy="4.5" r="1.9" />
            <circle cx="12" cy="12" r="1.9" />
            <circle cx="12" cy="19.5" r="1.9" />
          </svg>
        </div>
      </div>

      <div
        ref={list}
        aria-live="polite"
        className="relative z-[2] flex min-h-0 flex-1 flex-col gap-[7px] overflow-y-auto px-[12px] pt-[14px] pb-[6px]"
      >
        <div className="mb-[4px] max-w-[80%] self-center rounded-[8px] bg-[rgba(225,245,254,0.92)] px-[12px] py-[5px] text-center text-[10.5px] leading-[1.4] text-[#3A6A78]">
          {t('whatsapp.notice')}
        </div>
        {chat.msgs.map((msg) => (
          <div key={msg.id} className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}>
            <ChatBubble
              mine={msg.mine}
              className={`relative max-w-[80%] pt-[7px] pr-[9px] pb-[5px] pl-[10px] shadow-[0_1px_1px_rgba(11,20,26,0.13)] ${
                msg.mine ? 'rounded-[8px_8px_2px_8px] bg-[#D9FDD3]' : 'rounded-[8px_8px_8px_2px] bg-white'
              }`}
            >
              <div className="text-[14px] leading-[1.38] text-pretty whitespace-pre-wrap text-[#111B21]">
                {msg.text}
              </div>
              <div className="mt-[2px] flex items-center justify-end gap-[3px]">
                <span className={'text-[10px] text-[rgba(17,27,33,0.45)]'}>{msg.time}</span>
                {msg.mine && (
                  <svg
                    viewBox="0 0 18 12"
                    width="16"
                    height="11"
                    fill="none"
                    stroke="#53BDEB"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-none"
                    aria-hidden="true"
                  >
                    <path d="M1 6.4 3.9 9.6 9.3 2.5" />
                    <path d="M7.6 9.3 8.7 10.5 15.8 2.2" />
                  </svg>
                )}
              </div>
            </ChatBubble>
          </div>
        ))}
        {chat.typing && (
          <div className="flex justify-start">
            <div className="typing-wa flex items-center gap-[4px] rounded-[8px_8px_8px_2px] bg-white px-[13px] py-[11px] shadow-[0_1px_1px_rgba(11,20,26,0.13)]">
              <span className="block h-[6px] w-[6px] rounded-[50%] bg-[#667781]" />
              <span className="block h-[6px] w-[6px] rounded-[50%] bg-[#667781]" />
              <span className="block h-[6px] w-[6px] rounded-[50%] bg-[#667781]" />
            </div>
          </div>
        )}
        {chat.done && (
          <div className="mt-[6px] w-[94%] self-center rounded-[14px] border border-ink/18 bg-cream p-[14px] text-center">
            <div className="text-[13px] leading-[1.5] text-pretty text-ink">{t('whatsapp.done')}</div>
            <Link
              href="/contact"
              className="mt-[11px] inline-flex items-center gap-[7px] rounded-[99px] bg-coral px-[18px] py-[10px] text-[13px] font-[600] text-cream transition-[background] duration-[180ms] ease-[ease] hover:bg-ink hover:text-cream"
            >
              {t('bookCall')} <ArrowRight />
            </Link>
          </div>
        )}
      </div>

      {chat.chips.length > 0 && !chat.done && (
        <div className="relative z-[3] flex flex-wrap justify-end gap-[6px] px-[10px] pb-[8px]">
          {chat.chips.map((c) => (
            <button
              key={c.question}
              type="button"
              onClick={() => void chat.ask(c.question)}
              className="cursor-pointer rounded-[99px] border border-[#00A884] bg-[rgba(255,255,255,0.96)] px-[13px] py-[8px] text-[12px] font-[600] text-[#00755E] shadow-[0_1px_2px_rgba(11,20,26,0.12)] transition-[background] duration-[160ms] ease-[ease] hover:bg-[#D9FDD3]"
            >
              {c.question}
            </button>
          ))}
        </div>
      )}

      <div className="relative z-[3] flex items-end gap-[7px] bg-[#F0F2F5] px-[9px] pt-[8px] pb-[12px]">
        <div className="flex min-w-0 flex-1 items-center gap-[8px] rounded-[22px] bg-white px-[12px] py-[8px]">
          <svg
            viewBox="0 0 24 24"
            width="19"
            height="19"
            fill="none"
            stroke="#54656F"
            strokeWidth="1.8"
            className="flex-none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="9" cy="10" r="1" />
            <circle cx="15" cy="10" r="1" />
            <path d="M8.5 14.5a4.5 4.5 0 0 0 7 0" strokeLinecap="round" />
          </svg>
          <input
            value={chat.draft}
            onChange={(e) => chat.setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                chat.sendDraft();
              }
            }}
            placeholder={t('whatsapp.placeholder')}
            aria-label={t('whatsapp.placeholder')}
            className="min-w-0 flex-1 border-0 bg-transparent px-0 py-[2px] font-sans text-[14px] text-[#111B21] outline-none"
          />
          <svg
            viewBox="0 0 24 24"
            width="19"
            height="19"
            fill="none"
            stroke="#54656F"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="flex-none"
            aria-hidden="true"
          >
            <path d="M18.5 11.5 12 18a4.6 4.6 0 0 1-6.5-6.5l7-7a3.1 3.1 0 0 1 4.4 4.4l-7 7a1.6 1.6 0 0 1-2.2-2.2l6.4-6.4" />
          </svg>
        </div>
        <button
          type="button"
          onClick={chat.sendDraft}
          aria-label={t('send')}
          className="flex h-[42px] w-[42px] flex-none cursor-pointer items-center justify-center rounded-[50%] bg-[#00A884] transition-[background] duration-[160ms] ease-[ease] hover:bg-[#00755E]"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#FFFFFF" aria-hidden="true">
            <path d="M3.2 20.5 21.5 12 3.2 3.5l.1 6.6L15 12 3.3 13.9z" />
          </svg>
        </button>
      </div>
    </PhoneFrame>
  );
}
