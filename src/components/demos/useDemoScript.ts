'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { ScriptedQA } from '@/lib/assistant';

// The three scripted questions and answers shared by the WhatsApp and web chat demos.
const KEYS = ['service', 'visit', 'book'] as const;

export function useDemoScript(): { qa: ScriptedQA[]; fallback: string } {
  const t = useTranslations('demos');
  return useMemo(
    () => ({
      qa: KEYS.map((k) => ({ question: t(`qa.${k}.question`), answer: t(`qa.${k}.answer`) })),
      fallback: t('fallback'),
    }),
    [t],
  );
}
