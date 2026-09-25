import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CtaBand } from '@/components/sections/CtaBand';
import { AboutContact, AboutIntro, HowWeWork, Values } from '@/components/sections/about/AboutSections';

export async function generateMetadata({ params }: PageProps<'/[locale]/about'>): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, '/about', 'about');
}

export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about.cta' });
  return (
    <main>
      <AboutIntro />
      <Values />
      <HowWeWork />
      <AboutContact />
      <CtaBand title={t('title')} text={t('text')} cta={t('button')} tone="coral" />
    </main>
  );
}
