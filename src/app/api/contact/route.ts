import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { site, isPlaceholder } from '@/config/site';

// Contact form -> email to the team (Resend).

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  business: z.string().trim().min(1).max(120),
  email: z.email().max(200),
  phone: z.string().trim().max(40).optional().default(''),
  message: z.string().trim().max(4000).optional().default(''),
  locale: z.enum(['nl', 'fr', 'en']).default('nl'),
  // Spam protection: a field people never see, and the time the form was shown.
  website: z.string().max(0).optional().default(''),
  shownAt: z.number().int().positive(),
});

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const d = parsed.data;

  // Bots fill the hidden field or submit instantly: pretend success, send nothing.
  if (d.website || Date.now() - d.shownAt < 2500) return NextResponse.json({ ok: true });

  const key = process.env.RESEND_API_KEY;
  if (!key || isPlaceholder(site.contactForm.to)) {
    console.error('Contact form: RESEND_API_KEY or contactForm.to is not configured.');
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  const rows: [string, string][] = [
    ['Name', d.name],
    ['Business', d.business],
    ['Email', d.email],
    ['Phone', d.phone || '-'],
    ['Language', d.locale.toUpperCase()],
    ['Message', d.message || '-'],
  ];
  const subject = `Website message: ${d.business}`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  const html = `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="color:#6B5D4F;vertical-align:top">${k}</td><td>${escape(v).replace(/\n/g, '<br>')}</td></tr>`,
    )
    .join('')}</table>`;

  const { error } = await new Resend(key).emails.send({
    from: site.contactForm.from,
    to: site.contactForm.to,
    replyTo: d.email,
    subject: subject.replace(/[\r\n]+/g, ' ').slice(0, 180),
    text,
    html,
  });
  if (error) {
    console.error('Contact form: Resend error', error.name);
    return NextResponse.json({ error: 'send_failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
