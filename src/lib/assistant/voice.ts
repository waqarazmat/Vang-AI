import { site } from '@/config/site';

/**
 * ============================================================================
 *  LIVE VOICE AGENT (Retell)
 * ============================================================================
 * "Call the assistant" on the VangVoice demo starts a real Retell web call when
 * NEXT_PUBLIC_RETELL_PUBLIC_KEY is set (the agent id lives in src/config/site.ts).
 * The browser talks to Retell directly with a public key; Retell only accepts that
 * key from the domains allowed on it, so no server route is involved.
 *
 * The agent gets the page language as the dynamic variable {{language}} ("nl", "fr"
 * or "en"), so its prompt can greet in the visitor's language.
 *
 * Without a key, or when the call cannot start, the demo falls back to its scripted
 * mode. The demo component only uses the VoiceCall interface below.
 * ============================================================================
 */

export const voiceAgentEnabled = Boolean(site.voiceAgent.publicKey && site.voiceAgent.agentId);

export interface VoiceCall {
  /** Resolves when the call is live; rejects when it could not start. */
  ready: Promise<void>;
  /** The assistant's audio, for the waveform. Available once the call is live. */
  analyser(): AnalyserNode | null;
  mute(): void;
  unmute(): void;
  end(): Promise<void>;
}

type Hooks = { onEnd: () => void; onError: (error: Error) => void };

let sdk: Promise<typeof import('retell-client-js-sdk')> | null = null;

/** Loads the SDK ahead of the click, so the call starts inside the user gesture. */
export function preloadVoiceAgent() {
  if (voiceAgentEnabled && !sdk) sdk = import('retell-client-js-sdk');
  return sdk;
}

export async function startVoiceCall(locale: string, hooks: Hooks): Promise<VoiceCall> {
  const { RetellClient } = await preloadVoiceAgent()!;
  const client = new RetellClient({ key: site.voiceAgent.publicKey });
  const session = client.createWebCall({
    agent_id: site.voiceAgent.agentId,
    retell_llm_dynamic_variables: { language: locale },
    metadata: { source: 'website', page: typeof location === 'undefined' ? '' : location.pathname },
    hooks: { onEnd: hooks.onEnd, onError: hooks.onError },
  });
  return {
    ready: session.ready,
    analyser: () => session.analyzerComponent?.analyser ?? null,
    mute: () => session.mute(),
    unmute: () => session.unmute(),
    end: () => session.end(),
  };
}
