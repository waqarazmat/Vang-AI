import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import { LegalPage } from '@/components/sections/LegalPage';

export async function generateMetadata({ params }: PageProps<'/[locale]/privacy'>): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, '/privacy', 'privacy');
}

export default async function PrivacyPage({ params }: PageProps<'/[locale]/privacy'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage page="privacy" />;
}
