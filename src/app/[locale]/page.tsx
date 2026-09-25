import type { Metadata } from 'next';
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

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });
  return { title: t('title'), description: t('description') };
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'home' });
  return (
    <main>
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
