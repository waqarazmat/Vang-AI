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

// VangChat demo: the chat widget on Garage Vanhees' website (design: VangWebChat.dc.html).
export function WebChatDemo() {
  const t = useTranslations('demos');
  const script = useDemoScript();
  const chat = useScriptedChat({
    channel: 'webchat',
    initial: [{ text: t('webchat.greeting'), mine: false }],
    qa: script.qa,
    fallback: script.fallback,
    delayMs: 950,
  });
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (list.current) list.current.scrollTop = list.current.scrollHeight;
  }, [chat.msgs, chat.typing, chat.done]);

  return (
    <PhoneFrame screen="bg-white">
      <div className="relative z-[2] flex items-center justify-between bg-[#F1EAE0] px-[22px] pt-[14px] text-ink">
        <span className="text-[12.5px] font-[700]">9:41</span>
        <StatusIcons color="#2B2118" faint="rgba(43,33,24,0.45)" />
      </div>
      <div className="relative z-[2] flex items-center gap-[8px] bg-[#F1EAE0] px-[14px] pt-[9px] pb-[10px]">
        <div className="flex min-w-0 flex-1 items-center gap-[6px] rounded-[99px] border border-ink/14 bg-white px-[12px] py-[6px]">
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="#6B6055"
            strokeWidth="2.2"
            className="flex-none"
            aria-hidden="true"
          >
            <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
            <path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" />
          </svg>
          <span className="overflow-hidden text-[11.5px] text-ellipsis whitespace-nowrap text-ink/65">
            {t('siteHost')}
          </span>
        </div>
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="#6B6055"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="flex-none"
          aria-hidden="true"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden bg-cream">
        <div className="px-[20px] pt-[22px] opacity-50" aria-hidden="true">
          <div className="font-mono text-[8.5px] tracking-[0.16em] text-coral-text">{t('webchat.pageTag')}</div>
          <div className="mt-[9px] text-[26px] leading-[1.02] font-[800] tracking-[-0.035em] text-ink">
            {t('webchat.pageTitle')}
          </div>
          <div className="mt-[14px] h-[9px] rounded-[99px] bg-ink/12" />
          <div className="mt-[7px] h-[9px] w-[72%] rounded-[99px] bg-ink/12" />
          <div className="mt-[16px] h-[74px] rounded-[14px] bg-ink/9" />
        </div>

        <div className="absolute top-[96px] right-[10px] bottom-[10px] left-[10px] flex flex-col overflow-hidden rounded-[20px] border border-ink/14 bg-white shadow-[0_18px_44px_rgba(43,33,24,0.18)]">
          <div className="flex items-center gap-[10px] bg-ink px-[15px] py-[13px]">
            <div className="flex h-[32px] w-[32px] flex-none items-center justify-center rounded-[50%] bg-cream">
              <Mark size={21} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-[700] tracking-[-0.015em] text-cream">{t('businessName')}</div>
              <div className="mt-[2px] flex items-center gap-[5px]">
                <span className="block h-[6px] w-[6px] rounded-[50%] bg-[#4ED07A]" />
                <span className="text-[10.5px] text-cream/75">{t('webchat.status')}</span>
              </div>
            </div>
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="rgba(250,238,218,0.7)"
              strokeWidth="2.4"
              strokeLinecap="round"
              className="flex-none"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </div>

          <div
            ref={list}
            aria-live="polite"
            className="flex min-h-0 flex-1 flex-col gap-[8px] overflow-y-auto bg-[#FFFDF8] px-[13px] py-[14px]"
          >
            {chat.msgs.map((msg) => (
              <div key={msg.id} className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}>
                <ChatBubble
                  mine={msg.mine}
                  className={`max-w-[84%] px-[13px] py-[10px] text-[13.5px] leading-[1.45] text-pretty ${
                    msg.mine
                      ? 'rounded-[14px_14px_4px_14px] bg-[#E8E4DC] text-ink'
                      : 'rounded-[14px_14px_14px_4px] bg-coral text-white'
                  }`}
                >
                  {msg.text}
                </ChatBubble>
              </div>
            ))}
            {chat.typing && (
              <div className="flex justify-start">
                <div className="typing-wc flex items-center gap-[4px] rounded-[14px_14px_14px_4px] bg-coral px-[14px] py-[12px]">
                  <span className="block h-[6px] w-[6px] rounded-[50%] bg-white" />
                  <span className="block h-[6px] w-[6px] rounded-[50%] bg-white" />
                  <span className="block h-[6px] w-[6px] rounded-[50%] bg-white" />
                </div>
              </div>
            )}
            {chat.done && (
              <div className="mt-[4px] rounded-[14px] border border-ink/16 bg-cream p-[13px] text-center">
                <div className="text-[12.5px] leading-[1.5] text-pretty text-ink">{t('webchat.done')}</div>
                <Link
                  href="/contact"
                  className="mt-[10px] inline-flex items-center gap-[7px] rounded-[99px] bg-coral px-[17px] py-[9px] text-[12.5px] font-[600] text-cream transition-[background] duration-[180ms] ease-[ease] hover:bg-ink hover:text-cream"
                >
                  {t('bookCall')} <ArrowRight />
                </Link>
              </div>
            )}
          </div>

          {chat.chips.length > 0 && !chat.done && (
            <div className="flex flex-col gap-[5px] bg-[#FFFDF8] px-[11px] pb-[8px]">
              {chat.chips.map((c) => (
                <button
                  key={c.question}
                  type="button"
                  onClick={() => void chat.ask(c.question)}
                  className="cursor-pointer rounded-[99px] border border-[rgba(216,90,48,0.55)] bg-white px-[13px] py-[9px] text-center text-[12.5px] font-[600] text-coral-deep transition-[background,color] duration-[160ms] ease-[ease] hover:bg-coral hover:text-white"
                >
                  {c.question}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-[8px] border-t border-ink/12 bg-white px-[10px] py-[9px]">
            <input
              value={chat.draft}
              onChange={(e) => chat.setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  chat.sendDraft();
                }
              }}
              placeholder={t('webchat.placeholder')}
              aria-label={t('webchat.placeholder')}
              className="min-w-0 flex-1 border-0 bg-transparent px-[2px] py-[4px] font-sans text-[13.5px] text-ink outline-none"
            />
            <button
              type="button"
              onClick={chat.sendDraft}
              aria-label={t('send')}
              className="flex h-[34px] w-[34px] flex-none cursor-pointer items-center justify-center rounded-[50%] bg-coral transition-[background] duration-[160ms] ease-[ease] hover:bg-ink"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#FAEEDA" aria-hidden="true">
                <path d="M3.2 20.5 21.5 12 3.2 3.5l.1 6.6L15 12 3.3 13.9z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
