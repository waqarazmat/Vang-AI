'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from '@/components/ui/icons';
import { site } from '@/config/site';

// Values and behaviour from the design (VangAI Contact.dc.html).

const TIMES = ['09:00', '09:30', '10:30', '11:00', '13:30', '14:00', '15:30', '16:30'];
const intlLocale = { nl: 'nl-BE', fr: 'fr-BE', en: 'en-GB' } as const;

// Cal.com or Calendly embed URL, themed like the design.
function embedSrc(locale: string) {
  const url = site.booking.url.trim();
  if (!url) return '';
  const join = url.includes('?') ? '&' : '?';
  return site.booking.provider === 'calendly'
    ? `${url}${join}hide_gdpr_banner=1&background_color=2b2118&text_color=faeeda&primary_color=d85a30`
    : `${url}${join}embed=true&theme=dark&layout=month_view&brandColor=%23D85A30&locale=${locale}`;
}

/**
 * Booking panel and message form. With a booking link in src/config/site.ts the panel shows
 * the Cal.com / Calendly embed. Without one it shows the design's calendar placeholder;
 * choosing a time there fills the message form with that time, so the request reaches us.
 */
export function ContactPanels({ buildDate }: { buildDate: string }) {
  const [prefill, setPrefill] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <div className="mx-auto max-w-[1200px] px-[40px] pt-[16px] pb-[88px]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] items-start gap-[20px]">
        <BookingPanel
          buildDate={buildDate}
          onRequest={(slot) => {
            setPrefill(slot);
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            formRef.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true });
          }}
        />
        <MessageForm formRef={formRef} prefill={prefill} />
      </div>
    </div>
  );
}

function BookingPanel({ buildDate, onRequest }: { buildDate: string; onRequest: (slot: string) => void }) {
  const t = useTranslations('contact.booking');
  const locale = useLocale() as keyof typeof intlLocale;
  const src = embedSrc(locale);

  // The page is static: start from the build date, then switch to today's date on the client.
  const [today, setToday] = useState(() => new Date(buildDate));
  const [view, setView] = useState(() => ({ y: today.getFullYear(), m: today.getMonth() }));
  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- a static page catches up with the visitor's clock
    setToday(now);
    setView({ y: now.getFullYear(), m: now.getMonth() });
  }, []);
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const monthName = (d: Date) => new Intl.DateTimeFormat(intlLocale[locale], { month: 'long' }).format(d);
  const dow = t('dow').split(',');
  const { y, m } = view;
  const first = new Date(y, m, 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const atMin = y === today.getFullYear() && m === today.getMonth();
  const available = useMemo(() => (day ? TIMES.filter((_, i) => (i * 7 + day.getDate()) % 5 !== 0) : []), [day]);
  const ready = Boolean(day && slot);
  const label = (d: Date) => `${d.getDate()} ${monthName(d)}`;

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-[12px]">
      <div>
        <div className="font-mono text-[10.5px] tracking-[0.14em] text-coral-light uppercase">{t('label')}</div>
        <div className="mt-[8px] text-[24px] font-[800] tracking-[-0.028em] text-cream">{t('title')}</div>
      </div>
      {!src && (
        <div className="flex items-center gap-[6px]">
          <button
            type="button"
            aria-label={t('prev')}
            disabled={atMin}
            onClick={() => setView({ y: m === 0 ? y - 1 : y, m: (m + 11) % 12 })}
            className={`flex h-[36px] w-[36px] items-center justify-center rounded-[50%] border border-cream/30 text-cream hover:border-cream ${
              atMin ? 'cursor-default opacity-[0.35]' : 'cursor-pointer'
            }`}
          >
            ‹
          </button>
          <div className="min-w-[118px] text-center font-mono text-[12px] tracking-[0.08em] text-cream">
            {`${monthName(first)} ${y}`}
          </div>
          <button
            type="button"
            aria-label={t('next')}
            onClick={() => setView({ y: m === 11 ? y + 1 : y, m: (m + 1) % 12 })}
            className="flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-[50%] border border-cream/30 text-cream hover:border-cream"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-w-0 flex-col gap-[20px] rounded-[26px] bg-ink p-[30px] text-cream">
      {header}
      {src ? (
        <iframe
          src={src}
          title={t('iframeTitle')}
          loading="lazy"
          className="block h-[680px] w-full rounded-[16px] border-0 bg-ink"
        />
      ) : (
        <div className="flex flex-col gap-[20px]">
          <div className="grid grid-cols-[repeat(7,minmax(0,1fr))] gap-[6px]">
            {dow.map((d) => (
              <div key={d} className="py-[4px] text-center font-mono text-[10px] tracking-[0.1em] text-cream/55">
                {d}
              </div>
            ))}
            {Array.from({ length: offset }, (_, i) => (
              <div
                key={`pad${i}`}
                aria-hidden="true"
                className="aspect-square rounded-[12px] border border-transparent"
              />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const date = new Date(y, m, i + 1);
              const wd = date.getDay();
              const ok = date > today && wd !== 0 && wd !== 6;
              const on = day?.getTime() === date.getTime();
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!ok}
                  aria-label={label(date)}
                  aria-pressed={on}
                  onClick={() => {
                    setDay(date);
                    setSlot(null);
                    setBooked(false);
                  }}
                  className={`flex aspect-square items-center justify-center rounded-[12px] border text-[15px] font-[700] transition-[background,color] duration-[160ms] ease-[ease] ${
                    on
                      ? 'cursor-pointer border-coral bg-coral text-white'
                      : ok
                        ? 'cursor-pointer border-cream/16 bg-cream/8 text-cream'
                        : 'cursor-default border-transparent bg-transparent text-cream/28'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-[12px] border-t border-cream/16 pt-[18px]">
            <div className="font-mono text-[10.5px] tracking-[0.12em] text-cream/70 uppercase">
              {day ? t('freeTimes', { date: label(day) }) : t('pickDay')}
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(84px,100%),1fr))] gap-[8px]">
              {available.map((time) => {
                const on = slot === time;
                return (
                  <button
                    key={time}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setSlot(time);
                      setBooked(false);
                    }}
                    className={`cursor-pointer rounded-[99px] border py-[10px] text-center text-[14.5px] font-[600] transition-[background,color] duration-[160ms] ease-[ease] hover:border-coral-light ${
                      on ? 'border-cream bg-cream text-ink' : 'border-cream/30 bg-transparent text-cream'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-[14px] rounded-[16px] bg-cream/7 px-[16px] py-[14px]">
            <div className="text-[15px] leading-[1.45] font-[600] text-cream" aria-live="polite">
              {booked ? t('noted') : ready && day ? `${label(day)}, ${slot}` : t('noTime')}
            </div>
            <button
              type="button"
              disabled={!ready}
              onClick={() => {
                if (!ready || !day || !slot) return;
                setBooked(true);
                onRequest(`${label(day)} ${day.getFullYear()}, ${slot}`);
              }}
              className={`group inline-flex items-center gap-[9px] rounded-[99px] border px-[26px] py-[14px] text-[15px] font-[600] whitespace-nowrap transition-[background,color] duration-[180ms] ease-[ease] hover:border-cream hover:bg-cream hover:text-ink ${
                ready
                  ? 'cursor-pointer border-coral bg-coral text-white'
                  : 'cursor-default border-cream/18 bg-cream/18 text-cream/60'
              }`}
            >
              {t('confirm')} <ArrowRight />
            </button>
          </div>
        </div>
      )}
      <div className="text-[14px] leading-[1.55] text-pretty text-cream/82">{t('note')}</div>
      <div className="font-mono text-[10px] tracking-[0.1em] text-cream/55 uppercase">{t('tz')}</div>
    </div>
  );
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

function MessageForm({
  formRef,
  prefill,
}: {
  formRef: React.RefObject<HTMLFormElement | null>;
  prefill: string | null;
}) {
  const t = useTranslations('contact.form');
  const locale = useLocale();
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- a time picked in the booking panel lands in the message
    if (prefill) setMessage((m) => (m ? `${m}\n${prefill}` : prefill));
  }, [prefill]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, locale, shownAt: shownAt.current }),
      });
      setStatus(res.ok ? 'sent' : 'error');
      if (res.ok) {
        e.currentTarget?.reset();
        setMessage('');
      }
    } catch {
      setStatus('error');
    }
  };

  const field =
    'min-w-0 rounded-[14px] border border-ink/20 bg-white px-[15px] py-[13px] font-sans text-[16px] text-ink outline-none focus:border-coral';
  const labelText = 'font-mono text-[10.5px] tracking-[0.12em] text-ink/68 uppercase';

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      className="flex min-w-0 flex-col gap-[20px] rounded-[26px] border border-ink/12 bg-paper p-[30px]"
    >
      <div>
        <div className="font-mono text-[10.5px] tracking-[0.14em] text-amber uppercase">{t('label')}</div>
        <div className="mt-[8px] text-[24px] font-[800] tracking-[-0.028em]">{t('title')}</div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-[14px]">
        <label className="flex min-w-0 flex-col gap-[7px]">
          <span className={labelText}>{t('name')}</span>
          <input className={field} name="name" type="text" autoComplete="name" required maxLength={100} />
        </label>
        <label className="flex min-w-0 flex-col gap-[7px]">
          <span className={labelText}>{t('business')}</span>
          <input className={field} name="business" type="text" autoComplete="organization" required maxLength={120} />
        </label>
        <label className="flex min-w-0 flex-col gap-[7px]">
          <span className={labelText}>{t('email')}</span>
          <input className={field} name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
        <label className="flex min-w-0 flex-col gap-[7px]">
          <span className={labelText}>
            {`${t('phone')} `}
            <span className="text-ink/65">{t('optional')}</span>
          </span>
          <input className={field} name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
        <label className="col-[1/-1] flex min-w-0 flex-col gap-[7px]">
          <span className={labelText}>{t('message')}</span>
          <textarea
            className={`${field} resize-y`}
            name="message"
            rows={5}
            maxLength={4000}
            placeholder={t('placeholder')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        {/* Spam trap: hidden from people, bots fill it in. */}
        <input
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-px w-px overflow-hidden opacity-0"
        />
      </div>
      <div className="flex flex-wrap items-center gap-[14px]">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group inline-flex cursor-pointer items-center gap-[9px] rounded-[99px] border border-coral bg-coral px-[26px] py-[14px] font-sans text-[15px] font-[600] whitespace-nowrap text-white transition-[background,color,border-color] duration-[180ms] ease-[ease] hover:border-ink hover:bg-ink hover:text-white"
        >
          {status === 'sending' ? t('sending') : t('send')} <ArrowRight />
        </button>
        <div aria-live="polite">
          {status === 'sent' && <div className="text-[15px] font-[600] text-amber">{t('sent')}</div>}
          {status === 'error' && <div className="text-[15px] font-[600] text-coral-deep">{t('error')}</div>}
        </div>
      </div>
      <div className="text-[13.5px] leading-[1.55] text-pretty text-ink/65">
        {`${t('privacyBefore')} `}
        <Link href="/privacy" className="font-[600] text-coral-deep">
          {t('privacyLink')}
        </Link>
        .
      </div>
    </form>
  );
}
