import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CtaBand } from '@/components/sections/CtaBand';
import { JsonLd, faqLd } from '@/components/seo/JsonLd';
import { ExtraService } from '@/components/sections/ExtraService';
import {
  Plans,
  PricingFaq,
  PricingIntro,
  SetupOptions,
  SupportBand,
} from '@/components/sections/pricing/PricingSections';

export async function generateMetadata({ params }: PageProps<'/[locale]/pricing'>): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, '/pricing', 'pricing');
}

export default async function PricingPage({ params }: PageProps<'/[locale]/pricing'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pricing.cta' });
  const f = await getTranslations({ locale, namespace: 'pricing.faq' });
  return (
    <main>
      <JsonLd data={faqLd(f.raw('items') as { q: string; a: string }[])} />
      <PricingIntro />
      <Plans />
      <SupportBand />
      <SetupOptions />
      <ExtraService />
      <PricingFaq />
      <CtaBand title={t('title')} text={t('text')} cta={t('button')} tone="coral" />
    </main>
  );
}
