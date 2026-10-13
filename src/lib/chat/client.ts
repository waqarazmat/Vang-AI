import type { Socket } from 'socket.io-client';
import { site } from '@/config/site';

/**
 * ============================================================================
 *  SITE CHAT (VangAI web chat backend)
 * ============================================================================
 * The chat widget on every page talks to the VangAI chat backend
 * (site.chatWidget.apiBase) for the organisation site.chatWidget.orgId:
 *
 *   GET  {apiBase}/api/public/webchat/{orgId}/config
 *   GET  {apiBase}/api/public/webchat/{orgId}/conversations/{id}/messages
 *   Socket.IO namespace {apiBase}/chat, auth { org_id, conversation_id? }
 *     emit  join                       after every connect
 *     emit  send_message { message }   the server creates the conversation on
 *                                      the first message and answers with
 *     on    connected { conversation_id }
 *     on    response_token { token }   the reply, streamed
 *     on    response_complete
 *     on    staff_message { content }  a team member took over
 *     on    takeover_event
 *
 * The conversation id is kept in localStorage so a visitor finds their chat
 * again after a reload or on another page.
 * ============================================================================
 */

export type ChatConfig = {
  greetingByLang?: Record<string, string>;
  suggestedQuestions?: string[] | null;
};

export type HistoryMessage = { id: string; direction: 'inbound' | 'outbound'; body: string | null };

export type ChatEvent =
  | { type: 'conversation'; id: string }
  | { type: 'token'; token: string }
  | { type: 'complete' }
  | { type: 'staff'; body: string }
  | { type: 'takeover' };

const { apiBase, orgId } = site.chatWidget;
export const chatEnabled = Boolean(apiBase && orgId);
const base = `${apiBase}/api/public/webchat/${orgId}`;
const storageKey = `_cw_conversation_${orgId}`;

export function storedConversation(): string | null {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

export function storeConversation(id: string | null) {
  try {
    if (id) localStorage.setItem(storageKey, id);
    else localStorage.removeItem(storageKey);
  } catch {}
}

export async function fetchConfig(): Promise<ChatConfig> {
  const res = await fetch(`${base}/config`);
  if (!res.ok) throw new Error(`chat config ${res.status}`);
  return res.json();
}

export async function fetchHistory(conversationId: string): Promise<HistoryMessage[]> {
  const res = await fetch(`${base}/conversations/${conversationId}/messages`);
  if (!res.ok) return [];
  return ((await res.json()).messages ?? []) as HistoryMessage[];
}

let sdk: Promise<typeof import('socket.io-client')> | null = null;
/** Loads Socket.IO ahead of time (on hover or focus of the launcher). */
export function preloadChat() {
  if (chatEnabled && !sdk) sdk = import('socket.io-client');
  return sdk;
}

export interface ChatConnection {
  send(message: string): void;
  close(): void;
}

export async function connectChat(
  conversationId: string | null,
  onEvent: (event: ChatEvent) => void,
): Promise<ChatConnection> {
  const { io } = await preloadChat()!;
  let current = conversationId;
  const socket: Socket = io(`${apiBase}/chat`, {
    // A function, so a reconnect sends the conversation id the server gave us.
    auth: (cb) => cb({ org_id: orgId, ...(current ? { conversation_id: current } : {}) }),
    transports: ['websocket', 'polling'],
  });
  socket.on('connect', () => socket.emit('join'));
  socket.on('connected', (p: { conversation_id: string }) => {
    current = p.conversation_id;
    onEvent({ type: 'conversation', id: p.conversation_id });
  });
  socket.on('response_token', (p: { token: string }) => onEvent({ type: 'token', token: p.token }));
  socket.on('response_complete', () => onEvent({ type: 'complete' }));
  socket.on('staff_message', (p: { content: string }) => onEvent({ type: 'staff', body: p.content }));
  socket.on('takeover_event', () => onEvent({ type: 'takeover' }));
  return {
    send: (message) => socket.emit('send_message', { message }),
    close: () => socket.disconnect(),
  };
}
