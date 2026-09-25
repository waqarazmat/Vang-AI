import { useTranslations } from 'next-intl';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Faq, type FaqEntry } from '@/components/ui/Faq';
import type { AppPathname } from '@/i18n/routing';
import { Reveal } from '@/components/animations/Reveal';

const LINKS: Partial<Record<string, AppPathname>> = { q9: '/data-privacy', q10: '/pricing' };
const KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'] as const;

// Home FAQ on the dark band: five questions, five more behind "Show more questions".
export function HomeFaq() {
  const t = useTranslations('home.faq');
  const entries: FaqEntry[] = KEYS.map((k) => {
    const href = LINKS[k];
    return {
      q: t(`items.${k}.q`),
      a: t(`items.${k}.a`),
      link: href ? { label: t(`items.${k}.link`), href } : undefined,
    };
  });
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto max-w-[1200px] px-[40px] py-[88px]">
        <Reveal>
          <Eyebrow onDark>{t('eyebrow')}</Eyebrow>
          <h2 className="mx-0 mt-[18px] mb-0 max-w-[22ch] text-[40px] leading-[1.05] font-[800] tracking-[-0.035em] text-balance text-cream">
            {t('title')}
          </h2>
        </Reveal>
        <Reveal className="mt-[30px] max-w-[880px]" delay={0.1}>
          <Faq entries={entries} variant="dark" visible={5} moreLabel={t('more')} lessLabel={t('less')} />
        </Reveal>
      </div>
    </section>
  );
}
