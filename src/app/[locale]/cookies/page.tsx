import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import { LegalPage } from '@/components/sections/LegalPage';

export async function generateMetadata({ params }: PageProps<'/[locale]/cookies'>): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, '/cookies', 'cookies');
}

export default async function CookiesPage({ params }: PageProps<'/[locale]/cookies'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage page="cookies" />;
}
