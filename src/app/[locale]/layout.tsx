import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import localFont from 'next/font/local';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { htmlLang, routing } from '@/i18n/routing';
import { site } from '@/config/site';
import { MotionProvider } from '@/components/animations/MotionProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import '../globals.css';

// The exact font files the design gets from Google Fonts (scripts/fetch-design-fonts.mjs).
// next/font/google fetches differently hinted files, which render measurably differently.
const archivo = localFont({
  src: [{ path: '../fonts/archivo-latin-variable.woff2', weight: '400 800', style: 'normal' }],
  variable: '--font-archivo',
  display: 'swap',
});
const plexMono = localFont({
  src: [
    { path: '../fonts/ibm-plex-mono-400-latin.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/ibm-plex-mono-500-latin.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={htmlLang[locale]} className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        <NextIntlClientProvider>
          <MotionProvider>
            <div className="min-h-screen">
              <Header />
              {children}
              <Footer />
            </div>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
