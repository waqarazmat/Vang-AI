// Placeholder for the real AI assistant (see src/lib/assistant/index.ts).
// Before enabling: add authentication or a per-IP rate limit, cap the message size, and keep
// the provider API key server-side only. Never expose an open proxy to a paid model.
export function POST() {
  return Response.json({ error: 'The live assistant is not connected yet.' }, { status: 501 });
}
