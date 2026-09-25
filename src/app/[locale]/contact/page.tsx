import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { CtaBand } from '@/components/sections/CtaBand';
import { ContactPanels } from '@/components/sections/contact/ContactPanels';
import { site } from '@/config/site';

export async function generateMetadata({ params }: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, '/contact', 'contact');
}

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contact' });
  const buildDate = new Date();
  buildDate.setHours(0, 0, 0, 0);
  return (
    <main>
      <div
        id="top"
        className="mx-auto flex max-w-[1200px] flex-wrap items-end justify-between gap-x-[48px] gap-y-[24px] px-[40px] pt-[80px] pb-[40px]"
      >
        <div className="min-w-0">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h1 className="mx-0 mt-[24px] mb-0 max-w-[14ch] text-[66px] leading-[0.98] font-[800] tracking-[-0.042em] text-balance">
            {t('title')}
          </h1>
          <p className="mx-0 mt-[20px] mb-0 max-w-[48ch] text-[20px] leading-[1.6] text-pretty text-ink/78">
            {t('lead')}
          </p>
        </div>
        <div className="flex flex-col items-start gap-[6px]">
          <span className="font-mono text-[10.5px] tracking-[0.14em] text-ink/62 uppercase">{t('emailDirect')}</span>
          <a
            href={`mailto:${site.email}`}
            className="border-b-[2px] border-coral/35 pb-[2px] text-[24px] font-[800] tracking-[-0.025em] text-coral hover:text-ink"
          >
            {site.email}
          </a>
        </div>
      </div>
      <ContactPanels buildDate={buildDate.toISOString()} />
      <CtaBand title={t('cta.title')} text={t('cta.text')} cta={t('cta.button')} />
    </main>
  );
}
