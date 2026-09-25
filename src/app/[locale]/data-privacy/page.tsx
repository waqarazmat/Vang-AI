import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import { LegalPage } from '@/components/sections/LegalPage';

export async function generateMetadata({ params }: PageProps<'/[locale]/data-privacy'>): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, '/data-privacy', 'dataPrivacy');
}

export default async function DataPrivacyPage({ params }: PageProps<'/[locale]/data-privacy'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage page="dataPrivacy" />;
}
