import type { AssistantAdapter } from './types';

export type ScriptedQA = { question: string; answer: string };

/**
 * Front-end demo adapter: answers the scripted questions from the design and a fixed
 * fallback for anything else. `delayMs` is the design's "typing" time before a reply.
 */
export function createScriptedAdapter({
  qa,
  fallback,
  delayMs,
}: {
  qa: ScriptedQA[];
  fallback: string;
  delayMs: number;
}): AssistantAdapter {
  const norm = (s: string) => s.trim().toLowerCase();
  return {
    async reply({ message }) {
      const hit = qa.find((item) => norm(item.question) === norm(message));
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return { text: hit ? hit.answer : fallback };
    },
  };
}
