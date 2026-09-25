'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { getAssistant, type Channel, type ScriptedQA } from '@/lib/assistant';

export type ChatMessage = { id: number; text: string; mine: boolean; time?: string };

const clock = () => {
  const d = new Date();
  const m = d.getMinutes();
  return `${d.getHours()}:${m < 10 ? '0' + m : m}`;
};

/**
 * Chat demo state, ported from the design (VangWhatsApp / VangWebChat components):
 * - suggestion chips are the scripted questions from index `asked` onward,
 * - a message sent while the assistant is typing is ignored,
 * - after three questions the closing "that is the demo" card is shown.
 */
export function useScriptedChat({
  channel,
  initial,
  qa,
  fallback,
  delayMs,
  withTime = false,
}: {
  channel: Channel;
  initial: Omit<ChatMessage, 'id'>[];
  qa: ScriptedQA[];
  fallback: string;
  delayMs: number;
  withTime?: boolean;
}) {
  const locale = useLocale();
  const nextId = useRef(initial.length);
  const [msgs, setMsgs] = useState<ChatMessage[]>(() => initial.map((m, i) => ({ ...m, id: i })));
  const [typing, setTyping] = useState(false);
  const [asked, setAsked] = useState(0);
  const [draft, setDraft] = useState('');
  const assistant = useMemo(() => getAssistant({ qa, fallback, delayMs }), [qa, fallback, delayMs]);

  const push = useCallback(
    (text: string, mine: boolean) =>
      setMsgs((list) => [...list, { id: nextId.current++, text, mine, time: withTime ? clock() : undefined }]),
    [withTime],
  );

  const ask = useCallback(
    async (question: string) => {
      if (typing) return;
      push(question, true);
      setTyping(true);
      setAsked((n) => n + 1);
      setDraft('');
      const history = msgs.map((m) => ({
        role: m.mine ? ('customer' as const) : ('assistant' as const),
        text: m.text,
      }));
      const { text } = await assistant.reply({ channel, locale, message: question, history });
      setTyping(false);
      push(text, false);
    },
    [typing, push, msgs, assistant, channel, locale],
  );

  const sendDraft = useCallback(() => {
    const value = draft.trim();
    if (value) void ask(value);
  }, [draft, ask]);

  return {
    msgs,
    typing,
    done: asked >= 3 && !typing,
    chips: qa.slice(asked),
    draft,
    setDraft,
    ask,
    sendDraft,
  };
}
