import { afterEach, describe, expect, it, vi } from 'vitest';
import { createScriptedAdapter } from './scripted';

const qa = [
  { question: 'What does a basic service cost?', answer: 'A basic service is €89.' },
  { question: 'Can I book for this week?', answer: 'Yes, Thursday at 15:00.' },
];
const adapter = createScriptedAdapter({ qa, fallback: 'Only the suggested questions.', delayMs: 1000 });
const req = (message: string) => ({ channel: 'whatsapp' as const, locale: 'en', message, history: [] });

describe('scripted assistant', () => {
  afterEach(() => vi.useRealTimers());

  it('answers a scripted question, ignoring case and spaces, after the typing delay', async () => {
    vi.useFakeTimers();
    const reply = adapter.reply(req('  what does a BASIC service cost? '));
    await vi.advanceTimersByTimeAsync(999);
    let done = false;
    void reply.then(() => (done = true));
    await Promise.resolve();
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(await reply).toEqual({ text: 'A basic service is €89.' });
  });

  it('falls back for anything else', async () => {
    vi.useFakeTimers();
    const reply = adapter.reply(req('Do you repair bikes?'));
    await vi.advanceTimersByTimeAsync(1000);
    expect(await reply).toEqual({ text: 'Only the suggested questions.' });
  });
});
