'use client';

import { useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Mark } from '@/components/ui/Mark';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { duration, distance, ease } from '@/lib/animation/motion';
import { LanguageSwitch } from './LanguageSwitch';

const products = [
  { hash: 'voice', name: 'VangVoice' },
  { hash: 'whatsapp', name: 'VangMessage' },
  { hash: 'chat', name: 'VangChat' },
] as const;

// Sticky site header. Values from the design (VangAI Home.dc.html, header block).
export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Current page: #A83D1B, the approved contrast correction of the design's coral (16px on cream).
  const link = (active: boolean) =>
    `text-[16px] font-[600] transition-colors duration-[180ms] ease-[ease] hover:text-coral ${active ? 'text-coral-text' : 'text-ink'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/12 bg-cream/94 backdrop-blur-[10px]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-[28px] gap-y-[12px] px-[32px] py-[12px]">
        <Link href="/" aria-label={t('home')} className="mr-auto flex flex-none items-center gap-[11px]">
          <Mark size={34} priority />
          <div className="text-[21px] font-[800] tracking-[-0.03em]">VangAI</div>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-[26px] gap-y-[10px]">
          <div
            className="relative py-[6px]"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
          >
            <Link
              href="/product"
              aria-haspopup="true"
              aria-expanded={open}
              className={`flex items-center gap-[6px] ${link(pathname === '/product')}`}
            >
              {t('product')}{' '}
              <span aria-hidden="true" className="text-[11px]">
                ▾
              </span>
            </Link>
            <AnimatePresence>
              {open && (
                // Added motion: the dropdown fades and drops in (the design shows it instantly).
                <m.div
                  initial={{ opacity: 0, y: -distance.menu }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -distance.menu }}
                  transition={{ duration: duration.menu, ease: ease.out }}
                  className="absolute top-full left-1/2 z-50 -translate-x-1/2"
                >
                  <div className="flex min-w-[210px] flex-col gap-[2px] rounded-[16px] border border-ink/16 bg-cream p-[10px] shadow-[0_14px_34px_rgba(43,33,24,0.14)]">
                    {products.map((p) => (
                      <Link
                        key={p.hash}
                        href={{ pathname: '/product', hash: p.hash }}
                        onClick={() => setOpen(false)}
                        className="rounded-[10px] px-[14px] py-[10px] text-center text-[15px] font-[500] hover:bg-paper hover:text-coral"
                      >
                        {p.name}
                      </Link>
                    ))}
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
          <Link href="/pricing" className={link(pathname === '/pricing')}>
            {t('pricing')}
          </Link>
          <Link href="/about" className={link(pathname === '/about')}>
            {t('about')}
          </Link>
          <LanguageSwitch />
          <ButtonLink href="/contact" size="nav">
            {t('bookCall')}
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
