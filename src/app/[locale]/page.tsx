import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/home/Hero';
import { ProblemSection } from '@/components/sections/home/ProblemSection';
import { HowItWorks } from '@/components/sections/home/HowItWorks';
import { OneMemory } from '@/components/sections/home/OneMemory';
import { Included } from '@/components/sections/home/Included';
import { ExtraService } from '@/components/sections/ExtraService';
import { PricingTeaser } from '@/components/sections/home/PricingTeaser';
import { WhyVangAI } from '@/components/sections/home/WhyVangAI';
import { HomeFaq } from '@/components/sections/home/HomeFaq';
import { CtaBand } from '@/components/sections/CtaBand';
import { JsonLd, faqLd, organizationLd } from '@/components/seo/JsonLd';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, '/', 'home');
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home' });
  const meta = await getTranslations({ locale, namespace: 'meta.home' });
  const faq = Object.values(t.raw('faq.items') as Record<string, { q: string; a: string; link?: string }>).map(
    ({ q, a, link }) => ({ q, a: link ? `${a} ${link}.` : a }),
  );
  return (
    <main>
      <JsonLd data={organizationLd(meta('description'))} />
      <JsonLd data={faqLd(faq)} />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <OneMemory />
      <Included />
      <div className="h-[88px]" />
      <ExtraService />
      <PricingTeaser />
      <WhyVangAI />
      <HomeFaq />
      <CtaBand title={t('cta.title')} text={t('cta.text')} cta={t('cta.button')} />
    </main>
  );
}
