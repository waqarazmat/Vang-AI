import type { AssistantAdapter } from './types';
import { createScriptedAdapter, type ScriptedQA } from './scripted';

export type { AssistantAdapter, AssistantReply, AssistantRequest, Channel, ChatTurn } from './types';
export type { ScriptedQA } from './scripted';

/**
 * ============================================================================
 *  CONNECT REAL AI HERE
 * ============================================================================
 * Every demo on the site (VangVoice, VangMessage, VangChat) gets its replies from
 * getAssistant(). Today it returns the scripted front-end adapter with the design's
 * questions and answers.
 *
 * To connect the real assistant:
 *   1. Implement the POST handler in src/app/api/assistant/route.ts (it returns 501 now).
 *   2. Return an adapter here that calls it, e.g.
 *        reply: async (req) => (await fetch('/api/assistant', { method: 'POST',
 *          body: JSON.stringify(req) })).json()
 *   3. Keep the scripted adapter as the fallback if the API is unavailable.
 * The demo components do not need to change.
 * ============================================================================
 */
export function getAssistant(script: { qa: ScriptedQA[]; fallback: string; delayMs: number }): AssistantAdapter {
  return createScriptedAdapter(script);
}
