'use client';

import { useRef, useState } from 'react';
import { m } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link, usePathname } from '@/i18n/navigation';
import { locales, type Locale } from '@/i18n/routing';
import { duration, ease } from '@/lib/animation/motion';

type Slide = { x0: number; w0: number; x1: number; w1: number; h: number; top: number };

/**
 * NL / FR / EN pill switch. Keeps the visitor on the same page in the other language.
 *
 * At rest the active option paints its own background, exactly like the design (a separate
 * background layer changes how Chrome smooths the text). Added motion: on click, a pill
 * slides from the current option to the clicked one while that language loads.
 */
export function LanguageSwitch({ dark = false }: { dark?: boolean }) {
  const t = useTranslations('nav');
  const current = useLocale() as Locale;
  const [target, setTarget] = useState<Locale>(current);
  const [slide, setSlide] = useState<Slide | null>(null);
  const group = useRef<HTMLDivElement>(null);
  const items = useRef<Partial<Record<Locale, HTMLAnchorElement | null>>>({});
  const pathname = usePathname();
  const params = useParams();

  const start = (to: Locale) => {
    const from = items.current[target];
    const next = items.current[to];
    const box = group.current?.getBoundingClientRect();
    if (to !== target && from && next && box) {
      const a = from.getBoundingClientRect();
      const b = next.getBoundingClientRect();
      setSlide({
        x0: a.left - box.left,
        w0: a.width,
        x1: b.left - box.left,
        w1: b.width,
        h: a.height,
        top: a.top - box.top,
      });
    }
    setTarget(to);
  };

  const pillBg = dark ? 'bg-cream' : 'bg-ink';
  const onText = dark ? 'text-ink hover:text-ink' : 'text-cream hover:text-cream';
  const offText = dark ? 'text-cream/70 hover:text-cream/70' : 'text-ink/70 hover:text-ink/70';

  return (
    <div
      ref={group}
      role="group"
      aria-label={t('language')}
      className={`relative flex items-center gap-[2px] rounded-[99px] border p-[3px] font-mono text-[11.5px] tracking-[0.08em] ${
        dark ? 'border-cream/28' : 'border-ink/22'
      }`}
    >
      {slide && (
        <m.span
          aria-hidden="true"
          className={`absolute left-0 rounded-[99px] ${pillBg}`}
          style={{ top: slide.top, height: slide.h }}
          initial={{ x: slide.x0, width: slide.w0 }}
          animate={{ x: slide.x1, width: slide.w1 }}
          transition={{ duration: duration.pill, ease: ease.out }}
        />
      )}
      {locales.map((locale) => {
        const on = locale === target;
        return (
          <Link
            key={locale}
            ref={(el) => {
              items.current[locale] = el;
            }}
            // @ts-expect-error -- the current route's params are valid in every locale
            href={{ pathname, params }}
            locale={locale}
            hrefLang={locale}
            aria-current={locale === current ? 'true' : undefined}
            onClick={() => start(locale)}
            className={`relative rounded-[99px] px-[10px] py-[6px] ${on ? onText : offText} ${
              on && !slide ? pillBg : ''
            }`}
          >
            {locale.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
