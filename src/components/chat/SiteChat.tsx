'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Mark } from '@/components/ui/Mark';
import { ChatBubble } from '@/components/demos/ChatBubble';
import { site } from '@/config/site';
import { ease } from '@/lib/animation/motion';
import {
  chatEnabled,
  connectChat,
  fetchConfig,
  fetchHistory,
  preloadChat,
  storeConversation,
  storedConversation,
  type ChatConfig,
  type ChatConnection,
  type ChatEvent,
} from '@/lib/chat/client';
import { ChatText } from './ChatText';

type Msg = { id: string; role: 'visitor' | 'ai' | 'staff' | 'notice' | 'error'; text: string };

/** How long to wait for the first part of a reply before showing the error message. */
const REPLY_TIMEOUT_MS = 45_000;

/**
 * The VangAI chat on every page: a launcher bottom right that opens the chat panel, styled
 * like the VangChat demo (design: VangWebChat.dc.html). Talks to the VangAI chat backend
 * through src/lib/chat/client.ts; Socket.IO loads only when the visitor opens the chat.
 */
export function SiteChat() {
  const t = useTranslations('chat');
  const locale = useLocale();
  const panelId = useId();

  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<ChatConfig | null | undefined>(undefined);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);

  const started = useRef(false);
  const conn = useRef<Promise<ChatConnection> | null>(null);
  const streamId = useRef<string | null>(null);
  const tookOver = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);

  const stopWaiting = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setTyping(false);
  };

  const onEvent = useCallback((event: ChatEvent) => {
    if (event.type === 'conversation') return storeConversation(event.id);
    if (event.type === 'token') {
      stopWaiting();
      const id = streamId.current;
      if (id) setMsgs((all) => all.map((msg) => (msg.id === id ? { ...msg, text: msg.text + event.token } : msg)));
      else {
        const next = `ai-${Date.now()}`;
        streamId.current = next;
        setMsgs((all) => [...all, { id: next, role: 'ai', text: event.token }]);
      }
      return;
    }
    if (event.type === 'complete') {
      stopWaiting();
      streamId.current = null;
      setBusy(false);
      return;
    }
    // A team member took over the conversation.
    stopWaiting();
    setBusy(false);
    setMsgs((all) => {
      const notice: Msg[] = tookOver.current ? [] : [{ id: `notice-${Date.now()}`, role: 'notice', text: '' }];
      tookOver.current = true;
      return event.type === 'staff'
        ? [...all, ...notice, { id: `staff-${Date.now()}`, role: 'staff', text: event.body }]
        : [...all, ...notice];
    });
  }, []);

  const connection = useCallback(() => {
    conn.current ??= connectChat(storedConversation(), onEvent);
    return conn.current;
  }, [onEvent]);

  // First open: load the backend's greeting and suggestions, restore an earlier chat, connect.
  const start = useCallback(() => {
    if (started.current || !chatEnabled) return;
    started.current = true;
    fetchConfig()
      .then(setConfig)
      .catch(() => setConfig(null));
    const id = storedConversation();
    if (id)
      void fetchHistory(id).then((history) => {
        if (!history.length) return storeConversation(null);
        setMsgs((now) => [
          ...history
            .filter((h) => h.body)
            .map((h): Msg => ({ id: h.id, role: h.direction === 'outbound' ? 'visitor' : 'ai', text: h.body! })),
          ...now,
        ]);
      });
    connection().catch(() => {});
  }, [connection]);

  useEffect(() => () => void conn.current?.then((c) => c.close()).catch(() => {}), []);

  useEffect(() => {
    if (list.current) list.current.scrollTop = list.current.scrollHeight;
  }, [msgs, typing, open]);

  useEffect(() => {
    if (!open) return;
    input.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      launcher.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const fail = () => {
    stopWaiting();
    streamId.current = null;
    setBusy(false);
    setMsgs((all) => [...all, { id: `error-${Date.now()}`, role: 'error', text: t('error', { email: site.email }) }]);
  };

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || busy) return;
    setMsgs((all) => [...all, { id: `me-${Date.now()}`, role: 'visitor', text: message }]);
    setDraft('');
    setBusy(true);
    setTyping(true);
    timer.current = setTimeout(fail, REPLY_TIMEOUT_MS);
    try {
      (await connection()).send(message);
    } catch {
      conn.current = null;
      fail();
    }
  };

  const reset = () => {
    void conn.current?.then((c) => c.close()).catch(() => {});
    conn.current = null;
    storeConversation(null);
    stopWaiting();
    streamId.current = null;
    tookOver.current = false;
    setBusy(false);
    setMsgs([]);
    connection().catch(() => {});
    input.current?.focus();
  };

  const toggle = () => {
    if (!open) start();
    setOpen(!open);
  };

  if (!chatEnabled) return null;

  const greeting = config === undefined ? null : (config?.greetingByLang?.[locale] ?? t('greeting'));
  const suggestions = config?.suggestedQuestions?.length
    ? config.suggestedQuestions
    : (t.raw('suggestions') as string[]);
  const asked = msgs.some((msg) => msg.role === 'visitor');

  return (
    <div
      data-site-chat=""
      className="fixed right-[20px] bottom-[20px] z-[60] max-480:right-[12px] max-480:bottom-[12px]"
    >
      <AnimatePresence>
        {open && (
          <m.div
            id={panelId}
            role="dialog"
            aria-label={t('title')}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.24, ease: ease.out }}
            style={{ transformOrigin: 'bottom right' }}
            className="absolute right-0 bottom-[66px] flex h-[min(500px,calc(100dvh-110px))] w-[330px] flex-col overflow-hidden rounded-[18px] border border-ink/14 bg-white shadow-[0_18px_44px_rgba(43,33,24,0.22)] max-480:fixed max-480:top-[12px] max-480:right-[12px] max-480:bottom-[74px] max-480:left-[12px] max-480:h-auto max-480:w-auto"
          >
            <div className="flex items-center gap-[10px] bg-ink px-[14px] py-[11px]">
              <div className="flex h-[32px] w-[32px] flex-none items-center justify-center rounded-[50%] bg-cream">
                <Mark size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-[700] tracking-[-0.015em] text-cream">{t('title')}</div>
                <div className="mt-[2px] flex items-center gap-[5px]">
                  <span className="block h-[6px] w-[6px] rounded-[50%] bg-[#4ED07A]" />
                  <span className="text-[11px] text-cream/75">{t('status')}</span>
                </div>
              </div>
              {(asked || msgs.length > 0) && (
                <button
                  type="button"
                  onClick={reset}
                  aria-label={t('reset')}
                  title={t('reset')}
                  className="flex h-[30px] w-[30px] flex-none cursor-pointer items-center justify-center rounded-[50%] text-cream/70 transition-[background,color] duration-[160ms] ease-[ease] hover:bg-cream/10 hover:text-cream"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="17"
                    height="17"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 3v6h6" />
                    <path d="M3.5 13a8.5 8.5 0 1 0 2.6-6.6L3 9" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  launcher.current?.focus();
                }}
                aria-label={t('close')}
                className="flex h-[30px] w-[30px] flex-none cursor-pointer items-center justify-center rounded-[50%] text-cream/70 transition-[background,color] duration-[160ms] ease-[ease] hover:bg-cream/10 hover:text-cream"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div
              ref={list}
              aria-live="polite"
              className="flex min-h-0 flex-1 flex-col gap-[8px] overflow-y-auto bg-[#FFFDF8] px-[12px] py-[14px]"
            >
              {greeting && <Bubble role="ai" text={greeting} />}
              {msgs.map((msg) =>
                msg.role === 'notice' ? (
                  <div
                    key={msg.id}
                    className="self-center rounded-[99px] bg-ink/6 px-[10px] py-[5px] text-center text-[11px] text-ink/70"
                  >
                    {t('takeover')}
                  </div>
                ) : (
                  <Bubble key={msg.id} role={msg.role} text={msg.text} team={t('team')} />
                ),
              )}
              {(typing || config === undefined) && (
                <div className="flex justify-start" role="status" aria-label={t('typing')}>
                  <div className="typing-wc flex items-center gap-[4px] rounded-[14px_14px_14px_4px] bg-coral px-[13px] py-[11px]">
                    <span className="block h-[6px] w-[6px] rounded-[50%] bg-white" />
                    <span className="block h-[6px] w-[6px] rounded-[50%] bg-white" />
                    <span className="block h-[6px] w-[6px] rounded-[50%] bg-white" />
                  </div>
                </div>
              )}
            </div>

            {!asked && config !== undefined && (
              <div className="flex flex-col gap-[5px] bg-[#FFFDF8] px-[11px] pb-[9px]">
                {suggestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => void send(q)}
                    className="cursor-pointer rounded-[99px] border border-[rgba(216,90,48,0.55)] bg-white px-[13px] py-[8px] text-center text-[12.5px] font-[600] text-coral-deep transition-[background,color] duration-[160ms] ease-[ease] hover:bg-coral hover:text-white"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(draft);
              }}
              className="flex items-center gap-[8px] border-t border-ink/12 bg-white px-[11px] py-[8px]"
            >
              <input
                ref={input}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t('placeholder')}
                aria-label={t('placeholder')}
                maxLength={2000}
                className="min-w-0 flex-1 border-0 bg-transparent px-[3px] py-[5px] font-sans text-[13.5px] text-ink outline-none placeholder:text-ink/45"
              />
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                aria-label={t('send')}
                className="flex h-[34px] w-[34px] flex-none cursor-pointer items-center justify-center rounded-[50%] bg-coral transition-[background,opacity] duration-[160ms] ease-[ease] hover:bg-ink disabled:cursor-default disabled:opacity-50 disabled:hover:bg-coral"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#FAEEDA" aria-hidden="true">
                  <path d="M3.2 20.5 21.5 12 3.2 3.5l.1 6.6L15 12 3.3 13.9z" />
                </svg>
              </button>
            </form>
            <div className="bg-white px-[13px] pb-[8px] text-[10px] leading-[1.4] text-ink/55">
              {`${t('storage')} `}
              <Link href="/privacy" className="text-ink/70 underline underline-offset-2 hover:text-coral">
                {t('privacy')}
              </Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <button
        ref={launcher}
        type="button"
        onClick={toggle}
        onPointerEnter={() => void preloadChat()}
        onFocus={() => void preloadChat()}
        aria-label={open ? t('close') : t('open')}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className="flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-[50%] bg-coral text-cream shadow-[0_10px_24px_rgba(216,90,48,0.36)] transition-[background,transform] duration-[180ms] ease-[ease] hover:-translate-y-[2px] hover:bg-ink active:translate-y-0"
      >
        {open ? (
          <svg
            viewBox="0 0 24 24"
            width="21"
            height="21"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="23"
            height="23"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}

function Bubble({ role, text, team }: { role: Exclude<Msg['role'], 'notice'>; text: string; team?: string }) {
  const mine = role === 'visitor';
  const tone =
    role === 'visitor'
      ? 'rounded-[14px_14px_4px_14px] bg-[#E8E4DC] text-ink'
      : role === 'error'
        ? 'rounded-[14px_14px_14px_4px] border border-coral/40 bg-cream text-ink'
        : role === 'staff'
          ? 'rounded-[14px_14px_14px_4px] bg-ink text-cream'
          : 'rounded-[14px_14px_14px_4px] bg-coral text-white';
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <ChatBubble
        mine={mine}
        className={`max-w-[86%] px-[12px] py-[9px] text-[13px] leading-[1.45] text-pretty break-words ${tone}`}
      >
        {role === 'staff' && team && (
          <div className="mb-[4px] font-mono text-[9.5px] tracking-[0.12em] text-cream/60 uppercase">{team}</div>
        )}
        {mine ? text : <ChatText text={text} linkClass="underline underline-offset-2" />}
      </ChatBubble>
    </div>
  );
}
