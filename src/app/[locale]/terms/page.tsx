import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import { setRequestLocale } from 'next-intl/server';
import { LegalPage } from '@/components/sections/LegalPage';

export async function generateMetadata({ params }: PageProps<'/[locale]/terms'>): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale as Locale, '/terms', 'terms');
}

export default async function TermsPage({ params }: PageProps<'/[locale]/terms'>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage page="terms" />;
}
